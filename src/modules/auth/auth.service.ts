import { AppError } from "../../utils/AppError";
import { hashPassword } from "../../utils/auth.helper";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.helper";
import { toUserResponse } from "./auth.mapper";
import { authRepository } from "./auth.repository.js";
import { registerUserDTO } from "./auth.schema.js";

export const authService = {
  registerUserService: async (body: registerUserDTO) => {
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

    await authRepository.createRefreshToken({
      token: refreshToken,
      userId: newUser.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7d
    })

    return {
      user: toUserResponse(newUser),
      accessToken: accessToken,
      refreshToken: refreshToken
    }

  },
};
