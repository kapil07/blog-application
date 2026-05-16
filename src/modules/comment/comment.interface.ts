import { Comment } from "../../../generated/prisma";
import { createCommentDTO } from "./comment.schema";

export interface ICommentRepository {
  createComment(
    postId: string,
    userId: string,
    data: createCommentDTO,
  ): Promise<any>;
  getCommentsByPostId(
    postId: string,
    limit: number,
    cursor?: string,
  ): Promise<Comment[]>;
  getCommentById(id: string): Promise<any>;
  deleteCommentById(id: string): Promise<any>;
}
