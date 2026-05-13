import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { verifyAccessToken } from "../utils/jwt.helper";
import { IJwtPayload } from "../types";
import { authRepository } from "../modules/auth/auth.repository";
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

      if(!token) {
        throw new AppError("Unauthorized request", 401)
      }

      const decoded = verifyAccessToken(token) as IJwtPayload;

      const user = await authRepository.findUserById(decoded.userId);

      if(!user) {
        throw new AppError("Unauthorized request", 401)
      }

      req.userId = user.id;

      next();

  } catch (error) {
    next(new AppError("Invalid or expired token", 401))
  }
};
