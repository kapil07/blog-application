import express from "express";
import { verifyUser } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createCommentSchema } from "./comment.schema";
import {
  createCommentController,
  deleteCommentController,
  getCommentsByPostIdController,
} from "./comment.controller";

const router = express.Router();

router
  .route("/create/post/:postId")
  .post(verifyUser, validate(createCommentSchema), createCommentController);
router.route("/:postId").get(verifyUser, getCommentsByPostIdController);
router.route("/delete/:commentId").delete(verifyUser, deleteCommentController);

export default router;
