import { PostRepository } from "../post/post.repository";
import { CommentRepository } from "./comment.repository";
import { CommentService } from "./comment.service";

 const postRepository = new PostRepository();
 const commentRepository = new CommentRepository();

 const commentService = new CommentService(
  commentRepository,
  postRepository,
);

export default commentService
