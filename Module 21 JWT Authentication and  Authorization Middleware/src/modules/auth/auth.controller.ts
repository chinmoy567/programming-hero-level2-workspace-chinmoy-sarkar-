import {NextFunction, Request, Response} from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponce";

const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const loginResult =  await authService.loginUser(payload);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User logged in successfully",
        data: loginResult,
    });
});



export const authController = {
    loginUser
}