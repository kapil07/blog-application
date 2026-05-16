import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import commentService from "./comment.container";
import { sendResponse } from "../../utils/sendResponse";

export const createCommentController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId as string

    const result = await commentService.createComment(postId, req.userId as string,req.body)

    sendResponse(res, 201,{
        success: true,
        message: "Comment created successfully",
        data: result
    })
  },
);

export const deleteCommentController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId as string

    const result = await commentService.deleteComment(commentId,req.userId as string)

    sendResponse(res, 201,{
        success: true,
        message: "Comment deleted successfully",
        data: result
    })
  },
);

