import { Request, Response, NextFunction } from "express";
import { NODE_ENV } from "../config/config";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = { ...err };
  error.message = err.message;

  error.statusCode = err.statusCode || 500;
  error.status = err.status || "error";

  if (NODE_ENV === "development") {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      stack: err.stack,
      error,
    });
  }

  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }

  // unknow error
  return res
    .status(500)
    .json({ status: error, message: "something went wrong" });
};
