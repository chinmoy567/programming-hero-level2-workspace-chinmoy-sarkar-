import httpStatus from "http-status";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponce";
import jwt from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

// User registration controller
const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await userService.registerUserIntoDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: { user },
    });
  },
);

// Get my profile controller
const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;
    console.log(accessToken);

    const verifiedToken = jwtUtils.verifyToken(
      accessToken,
      config.JWT_ACCESS_SECRET,
    );
    console.log(verifiedToken);

    if (typeof verifiedToken == "string") {
      throw new Error("Invalid token");
    }

    const profile = await userService.getMyProfileFromDB(
      verifiedToken.id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User profile fetched successfully",
      data: { profile },
    });
  },
);

export const userController = {
  registerUser,
  getMyProfile,
};
