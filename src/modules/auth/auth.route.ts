import express from "express";
import {
  logOutAllController,
  currentUserController,
  loginUserController,
  logOutController,
  refreshTokenController,
  registerController,
} from "./auth.controller.js";
import {
  loginUserSchema,
  refreshTokenSchema,
  registerUserSchema,
} from "./auth.schema.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { verifyUser } from "../../middlewares/auth.middleware.js";
import { authService } from "./container.js";

const router = express.Router();

router
  .route("/register")
  .post(validate(registerUserSchema), registerController);

router.route("/login").post(validate(loginUserSchema), loginUserController);
router
  .route("/refreshToken")
  .post(validate(refreshTokenSchema), refreshTokenController);
router.route("/me").get(verifyUser(authService), currentUserController);
router.route("/logout").post(verifyUser(authService), logOutController);
router.route("/logOut-all-devices").post(verifyUser(authService), logOutAllController);

export default router;
