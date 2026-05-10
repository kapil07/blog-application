import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { globalErrorHandler } from "./middlewares/error.middleware";

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "",
  }),
);

app.get("/health-check", (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({
    success: true,
    message: "API is working fine..",
  });
});

import authRouter from "./modules/auth/auth.route.js";

app.use("/api/v1/auth", authRouter);

app.use(globalErrorHandler);
