import { uploadToCloudinary } from "../../utils/cloudinary.helper.js";
import { IPostRepository } from "./post.interface.js";
import { createPostDTO } from "./post.schema.js";

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
      createdPost = await this.repo.createPost(title, description, userId, imageUrl);
    } else {
      createdPost = await this.repo.createPost(title, description, userId);
    }
    return createdPost;
  }
}
