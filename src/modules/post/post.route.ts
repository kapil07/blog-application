import express from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { createPostSchema, updatePostSchema } from "./post.schema.js";
import { verifyUser } from "../../middlewares/auth.middleware.js";
import { authService } from "../auth/container.js";
import { upload } from "../../middlewares/multer.middleware.js";
import {
  createPostController,
  deletePostController,
  getAllPost,
  geUsertPostsController,
  updatePostsController,
} from "./post.controller.js";

const router = express.Router();

router
  .route("/create")
  .post(
    verifyUser(authService),
    upload.single("media"),
    validate(createPostSchema),
    createPostController,
  );
router
  .route("/your-posts")
  .get(verifyUser(authService), geUsertPostsController);
router
  .route("/:id")
  .patch(
    verifyUser(authService),
    validate(updatePostSchema),
    updatePostsController,
  );
router.route("/").get(verifyUser(authService),getAllPost)
router.route("/:id").delete(verifyUser(authService), deletePostController);

export default router;
