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
import { IAuthRepository } from "./auth.interface";
import { toUserResponse } from "./auth.mapper";
import {
  loginUserDTO,
  refeshTokenDTO,
  registerUserDTO,
} from "./auth.schema.js";

export class AuthService {
  constructor(private repo: IAuthRepository) {}

  async registerUser(body: registerUserDTO) {
    const { username, email, password } = body;

    const existingUserByUsername = await this.repo.findUserByUsername(username);

    if (existingUserByUsername) {
      throw new AppError("User already exist", 400);
    }

    const existingUserByEmail = await this.repo.findUserByEmail(email);

    if (existingUserByEmail) {
      throw new AppError("User already exist", 400);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await this.repo.createUser(username, email, hashedPassword);

    const accessToken = generateAccessToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);

    const hashedRefreshToken = hashRefreshToken(refreshToken);

    await this.repo.createRefreshToken({
      token: hashedRefreshToken,
      userId: newUser.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7d
    });

    return {
      user: toUserResponse(newUser),
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async loginUser(body: loginUserDTO) {
    const { email, password } = body;

    const user = await this.repo.findUserByEmail(email);

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

    await this.repo.createRefreshToken({
      token: hashedRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7d
    });

    return {
      user: toUserResponse(user),
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(body: refeshTokenDTO) {
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

    const existingToken = await this.repo.findRefreshToken(hashedToken);
    if (!existingToken) {
      throw new AppError("Refresh Token not found", 403);
    }

    await this.repo.deleteRefreshTokenById(existingToken.id);

    const newAccessToken = generateAccessToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);

    const newRefreshHashedToken = hashRefreshToken(newRefreshToken);

    await this.repo.createRefreshToken({
      token: newRefreshHashedToken,
      userId: decoded.userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7d
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.repo.findUserById(userId);

    if (!user) {
      throw new AppError("User Not Found", 404);
    }

    return {
      user: toUserResponse(user),
    };
  }

  async logOut(refreshToken: string) {
    if (!refreshToken) {
      throw new AppError("Refresh Token required", 401);
    }

    const hashedRefreshToken = hashRefreshToken(refreshToken);

    const existingToken = await this.repo.findRefreshToken(hashedRefreshToken);

    if (!existingToken) {
      throw new AppError("Refresh Token is invalid", 404);
    }

    await this.repo.deleteRefreshTokenById(existingToken.id);

    return true;
  }

  async logOutAllDevices(userId: string) {
    if (!userId) {
      throw new AppError("User id not found", 404);
    }

    await this.repo.deleteAllRefreshTokenByUserId(userId);

    return true;
  }
}
