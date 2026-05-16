import { prisma } from "../../lib/prisma";
import { ICommentRepository } from "./comment.interface";
import { createCommentDTO } from "./comment.schema";

export class CommentRepository implements ICommentRepository {
  async createComment(postId: string, userId: string, data: createCommentDTO) {
    const newComment = await prisma.comment.create({
      data: {
        postId,
        userId,
        comment: data.comment,
      },
    });
    return newComment
  }

  async getCommentById(id: string){
    const comment = await prisma.comment.findUnique({
        where: {
            id
        },
        include:{
            post: true
        }
    }) 

    return comment
  }

  async deleteCommentById(id: string) {
    await prisma.comment.delete({
        where:{
            id
        }
    })
  }
}
