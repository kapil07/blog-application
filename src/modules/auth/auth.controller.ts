import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";

export const registerController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.registerUserService(req.body);
    sendResponse(res, 201, {
      success: true,
      message: "Account created Successfully",
      data: result,
    });
  },
);
