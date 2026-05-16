import { AppError } from "../../utils/AppError";
import { IPostRepository } from "../post/post.interface";
import { ICommentRepository } from "./comment.interface";
import { createCommentDTO } from "./comment.schema";
import { Post } from '../../../generated/prisma/index';

export class CommentService {
  constructor(
    private commentRepo: ICommentRepository,
    private postRepo: IPostRepository,
  ) {}

  async createComment(postId: string, userId: string, data: createCommentDTO) {
    const post = await this.postRepo.getPostById(postId);

    if (!post) {
      throw new AppError("Post not found", 400);
    }

    const newComment = await this.commentRepo.createComment(
      postId,
      userId,
      data,
    );

    return newComment;
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.commentRepo.getCommentById(commentId)

    if(!(comment.userId === userId || comment.post.userId === userId)){
        throw new AppError("Unauthorized to perform this action", 401)
    }

    await this.commentRepo.deleteCommentById(commentId)

    return true

  }
}
