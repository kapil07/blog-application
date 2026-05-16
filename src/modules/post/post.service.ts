import { AppError } from "../../utils/AppError.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../../utils/cloudinary.helper.js";
import { IPostRepository } from "./post.interface.js";
import { createPostDTO, updatePostDTO } from "./post.schema.js";

export class PostService {
  constructor(private repo: IPostRepository) {}

  async createPost(
    body: createPostDTO,
    userId: string,
    localFilePath?: string,
  ) {
    const { title, description } = body;
    let createdPost;
    if (localFilePath) {
      const imageUrl = await uploadToCloudinary(localFilePath);
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

  async getAllPosts(){
    const posts = await this.repo.getAllPost();

    return posts;
  }

  async deletePost(postId: string, userId: string) {

    const post = await this.repo.getPostByUserIdAndPostId(postId, userId);

    if(!post) {
      throw new AppError("Post not found", 404)
    }

    if(post.imageUrl) {
      await deleteFromCloudinary(post.imageUrl)
    }

    await this.repo.deletePost(postId)

    return true;
  }
}
