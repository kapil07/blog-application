import { prisma } from "../../lib/prisma.js";
import { IPostRepository } from "./post.interface.js";
import { updatePostDTO } from "./post.schema.js";

export class PostRepository implements IPostRepository {
 
 async getPostById(postId: string){
  const post = await prisma.post.findFirst({
    where:{
      id: postId
    }
  })
  return post
 }

  async createPost(
    title: string,
    description: string,
    userId: string,
    imageUrl?: string,
  ) {
    let createdPost;
    if (imageUrl) {
      createdPost = await prisma.post.create({
        data: {
          title,
          description,
          imageUrl,
          userId,
        },
      });
    } else {
      createdPost = await prisma.post.create({
        data: {
          title,
          description,
          userId,
        },
      });
    }

    return createdPost;
  }

  async getPostByUserId(userId: string) {
    const posts = await prisma.post.findMany({
      where: {
        userId,
      },
    });

    return posts;
  }

  async getPostByUserIdAndPostId(postId: string, userId: string) {
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        userId,
      },
    });
    return post;
  }

  async updatePost(postId: string, data: updatePostDTO) {
    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title: data.title,
        description: data.description,
      },
    });

    return updatedPost;
  }

  async getAllPost(cursor?: string, limit: number =  5) {
    const posts = await prisma.post.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? {id: cursor} : undefined,
      orderBy:{
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        createdAt: true,
        userId: true
      }
    })

    return posts
  }

  async deletePost(postId: string) {
    await prisma.post.delete({
      where: {
        id: postId
      }
    })  
  }
}
