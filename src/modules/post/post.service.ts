import { AppError } from "../../utils/AppError.js";
import { IFileService } from "../../utils/file.interface.js";
import { IPostRepository } from "./post.interface.js";
import { createPostDTO, updatePostDTO } from "./post.schema.js";

export class PostService {
  constructor(private repo: IPostRepository, private fileService: IFileService) {}

  async createPost(
    body: createPostDTO,
    userId: string,
    localFilePath?: string,
  ) {
    const { title, description } = body;
    let createdPost;
    if (localFilePath) {
      const imageUrl = await this.fileService.upload(localFilePath);
      createdPost = await this.repo.createPost(
        title,
        description,
        userId,
        imageUrl,
      );
    } else {
      createdPost = await this.repo.createPost(title, description, userId);
    }
    return createdPost;
  }

  async getUserPosts(userId: string) {
    const posts = await this.repo.getPostByUserId(userId)
    return posts;
  }

  async updatePost(postId: string, userId: string, data: updatePostDTO){
    const post = await this.repo.getPostByUserIdAndPostId(postId, userId);

    if(!post) {
      throw new AppError("Post not found", 404)
    }

    const updatedPost = await this.repo.updatePost(postId, data)

    return updatedPost
  }

  async getAllPosts(cursor?: string, limit?: number){
    const posts = await this.repo.getAllPost(cursor, limit);

    return posts;
  }

  async deletePost(postId: string, userId: string) {

    const post = await this.repo.getPostByUserIdAndPostId(postId, userId);

    if(!post) {
      throw new AppError("Post not found", 404)
    }

    if(post.imageUrl) {
      await this.fileService.delete(post.imageUrl)
    }

    await this.repo.deletePost(postId)

    return true;
  }
}
