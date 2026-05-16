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

const router = express.Router();

router
  .route("/register")
  .post(validate(registerUserSchema), registerController);

router.route("/login").post(validate(loginUserSchema), loginUserController);
router
  .route("/refreshToken")
  .post(validate(refreshTokenSchema), refreshTokenController);
router.route("/me").get(verifyUser, currentUserController);
router.route("/logout").post(verifyUser, logOutController);
router.route("/logOut-all-devices").post(verifyUser, logOutAllController);

export default router;
