import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { verifyAccessToken } from "../utils/jwt.helper";
import { IJwtPayload } from "../types";

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new AppError("Unauthorized request", 401);
    }

    const decoded = verifyAccessToken(token) as IJwtPayload;

    req.userId = decoded.userId;

    next();
  } catch (error) {
    next(new AppError("Invalid or expired token", 401));
  }
};
