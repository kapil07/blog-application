import { cloudinaryService } from "../../utils/cloudinary.service";
import { PostRepository } from "./post.repository";
import { PostService } from "./post.service";

const postRespository = new PostRepository();
const fileService = new cloudinaryService();
const postService = new PostService(postRespository, fileService)

export default postService