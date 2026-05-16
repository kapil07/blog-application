import { updatePostDTO } from "./post.schema";

export interface IPostRepository {
  createPost(
    title: string,
    description: string,
    userId: string,
    imageUrl?: string,
  ): Promise<any>;
  
  getPostById(postId: string):Promise<any>
  getAllPost():Promise<any>;
  getPostByUserId(userId: string): Promise<any>;
  getPostByUserIdAndPostId(postId: string, userId: string): Promise<any>;
  updatePost(postId: string, data: updatePostDTO): Promise<any>;
  deletePost(postId: string): Promise<any>
}
