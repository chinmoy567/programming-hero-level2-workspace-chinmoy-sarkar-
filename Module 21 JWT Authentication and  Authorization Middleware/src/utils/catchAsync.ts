import { Request, Response, NextFunction, RequestHandler } from "express";
import httpStatus from "http-status";


export const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error("Error in catchAsync:", error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        message: "An unexpected error occurred",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
};

