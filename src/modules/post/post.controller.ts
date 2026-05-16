import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import postService from "./post.container";
import { sendResponse } from "../../utils/sendResponse";

export const createPostController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let result;
    if (req.file?.path) {
      result = await postService.createPost(
        req.body,
        req.userId as string,
        req.file.path,
      );
    } else {
      result = await postService.createPost(req.body, req.userId as string);
    }
    sendResponse(res, 201, {
      success: true,
      message: "Post created successfully",
      data: result,
    });
  },
);

export const geUsertPostsController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getUserPosts(req.userId as string);
    sendResponse(res, 200, {
      success: true,
      message: "User posts fetched successfully",
      data: result,
    });
  },
);

export const updatePostsController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id as string;

    const result = await postService.updatePost(
      postId,
      req.userId as string,
      req.body,
    );

    sendResponse(res, 200, {
      success: true,
      message: "Posts updated successfully",
      data: result,
    });
  },
);

export const getAllPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { cursor, limit } = req.query;
    const parsedLimit = limit ? parseInt(limit as string) : 5;

    const result = await postService.getAllPosts(cursor as string, parsedLimit);

    sendResponse(res, 200, {
      success: true,
      message: "All posts fetched successfully",
      data: {
        result,
        meta: {
          nextCursor: result.length > 0 ? result[result.length - 1].id : null,
        },
      },
    });
  },
);

export const deletePostController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id as string;

    const result = await postService.deletePost(postId, req.userId as string);

    sendResponse(res, 200, {
      success: true,
      message: "Posts deleted successfully",
      data: result,
    });
  },
);
