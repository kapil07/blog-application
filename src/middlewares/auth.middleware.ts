import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { verifyAccessToken } from "../utils/jwt.helper";
import { IJwtPayload } from "../types";
import { AuthService } from "../modules/auth/auth.service";

export const verifyUser = (authService: AuthService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        throw new AppError("Unauthorized request", 401);
      }

      const decoded = verifyAccessToken(token) as IJwtPayload;

      const userData = await authService.getCurrentUser(decoded.userId);

      if (!userData) {
        throw new AppError("Unauthorized request", 401);
      }

      req.userId = userData.user.id;

      next();
    } catch (error) {
      next(new AppError("Invalid or expired token", 401));
    }
  };
};
