import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./container";
import { destroyCookies, setCookies } from "../../utils/auth.helper";

export const registerController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.registerUser(req.body);
    
    setCookies(res, result.accessToken,result.refreshToken)

    sendResponse(res, 201, {
      success: true,
      message: "Account created Successfully",
      data: result,
    });
  },
);

export const loginUserController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.loginUser(req.body);

    setCookies(res, result.accessToken,result.refreshToken)

    sendResponse(res, 200, {
      success: true,
      message: "Logged in successfully",
      data: result,
    });
  },
);

export const refreshTokenController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.refreshToken(req.body);

    setCookies(res, result.accessToken,result.refreshToken)

    sendResponse(res, 200, {
      success: true,
      message: "Token refreshed successfully",
      data: result,
    });
  },
);

export const currentUserController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId as string;
    const result = await authService.getCurrentUser(userId);

    sendResponse(res, 200, {
      success: true,
      message: "User details fecthed Successfully",
      data: result,
    });
  },
);

export const logOutController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;
    const result = await authService.logOut(refreshToken);

    destroyCookies(res);

    sendResponse(res, 200, {
      success: true,
      message: "Logged Out Successfully",
      data: result,
    });
  },
);

export const logOutAllController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId as string;

    const result = await authService.logOutAllDevices(userId);

    destroyCookies(res);

    sendResponse(res, 200, {
      success: true,
      message: "Logged Out from all the devices",
      data: result,
    });
  },
);
