import { ApiResponse } from "../types";
import { Response } from "express";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  payload: ApiResponse<T>,
) => {
  return res.status(statusCode).json(payload);
};
