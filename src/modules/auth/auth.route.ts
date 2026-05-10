import express from "express";
import { registerController } from "./auth.controller.js";
import { registerUserSchema } from "./auth.schema.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = express.Router();

router
  .route("/register")
  .post(validate(registerUserSchema), registerController);

export default router;
