import { PostRepository } from "./post.repository";
import { PostService } from "./post.service";

const postRespository = new PostRepository();
const postService = new PostService(postRespository)

export default postService