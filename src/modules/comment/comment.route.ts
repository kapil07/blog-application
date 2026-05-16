import express from 'express'
import { authService } from '../auth/container';
import { verifyUser } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createCommentSchema } from './comment.schema';
import { createCommentController, deleteCommentController } from './comment.controller';

const router = express.Router()

router.route("/create/post/:postId").post(verifyUser(authService),validate(createCommentSchema),createCommentController)
router.route("/delete/:commentId").delete(verifyUser(authService),deleteCommentController)

export default router