import { IJwtPayload } from "../../types";
import { AppError } from "../../utils/AppError";
import {
  comparePassword,
  hashPassword,
  hashRefreshToken,
} from "../../utils/auth.helper";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.helper";
import { toUserResponse } from "./auth.mapper";
import { authRepository } from "./auth.repository.js";
import {
  loginUserDTO,
  refeshTokenDTO,
  registerUserDTO,
} from "./auth.schema.js";

export const authService = {
  registerUser: async (body: registerUserDTO) => {
    const { username, email, password } = body;

    const existingUserByUsername =
      await authRepository.findUserByUsername(username);

    if (existingUserByUsername) {
      throw new AppError("User already exist", 400);
    }

    const existingUserByEmail = await authRepository.findUserByEmail(email);

    if (existingUserByEmail) {
      throw new AppError("User alreday exist", 400);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await authRepository.createUser(
      username,
      email,
      hashedPassword,
    );

    const accessToken = generateAccessToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);

    const hashedRefreshToken = hashRefreshToken(refreshToken);

    await authRepository.createRefreshToken({
      token: hashedRefreshToken,
      userId: newUser.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7d
    });

    return {
      user: toUserResponse(newUser),
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  },

  loginUser: async (body: loginUserDTO) => {
    const { email, password } = body;

    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new AppError("Invalid Credentials", 401);
    }

    const isPassword = await comparePassword(password, user.password);

    if (!isPassword) {
      throw new AppError("Invalid Credentials", 401);
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    const hashedRefreshToken = hashRefreshToken(refreshToken);

    await authRepository.createRefreshToken({
      token: hashedRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7d
    });

    return {
      user: toUserResponse(user),
      accessToken,
      refreshToken,
    };
  },

  refreshToken: async (body: refeshTokenDTO) => {
    const { token } = body;
    if (!token) {
      throw new AppError("Refresh Token required", 401);
    }

    let decoded;

    try {
      decoded = verifyRefreshToken(token) as IJwtPayload;
    } catch (error) {
      throw new AppError("Invalid or expired Refresh token", 401);
    }

    const hashedToken = hashRefreshToken(token);

    const existingToken = await authRepository.findRefreshToken(hashedToken);
    if (!existingToken) {
      throw new AppError("Refresh Token not found", 403);
    }

    await authRepository.deleteRefreshTokenById(existingToken.id);

    const newAccessToken = generateAccessToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);

    const newRefreshHashedToken = hashRefreshToken(newRefreshToken);

    await authRepository.createRefreshToken({
      token: newRefreshHashedToken,
      userId: decoded.userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7d
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },

  getCurrentUser: async (userId: string) => {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new AppError("User Not Found", 404);
    }

    return {
      user: toUserResponse(user),
    };
  },

  logOut: async (refreshToken: string) => {
    if (!refreshToken) {
      throw new AppError("Refresh Token required", 401);
    }

    const hashedRefreshToken = hashRefreshToken(refreshToken);

    const existingToken =
      await authRepository.findRefreshToken(hashedRefreshToken);

    if (!existingToken) {
      throw new AppError("Refresh Token is invalid", 404);
    }

    await authRepository.deleteRefreshTokenById(existingToken.id);

    return true;
  },

  logOutAllDevices: async (userId: string) => {
    if (!userId) {
      throw new AppError("User id not found", 404);
    }

    await authRepository.deleteAllRefreshTokenByUserId(userId);

    return true;
  },
};
