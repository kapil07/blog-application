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
    sendResponse(res,201,{
        success: true,
        message: "Post created successfully",
        data: result
    })
  },
);
