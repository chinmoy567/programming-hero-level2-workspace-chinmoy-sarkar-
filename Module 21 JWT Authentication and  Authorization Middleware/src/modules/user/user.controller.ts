import httpStatus from "http-status";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponce";

// //user registration controller
// const registerUser = async (req: Request, res: Response) => {

// try{
//   const payload = req.body;
//   const user = await userService.registerUserIntoDB(payload);

//   //send response
//   res.status(httpStatus.CREATED).json({
//     sucess: true,
//     statusCode: httpStatus.CREATED,
//     message: "User registered successfully",
//     data: { user },
//   });
// }
// catch(error){
//     console.error("Error registering user:", error);
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       statusCode: httpStatus.INTERNAL_SERVER_ERROR,
//       message: "Failed to register user",
//       error: error instanceof Error ? error.message : "Unknown error",
//     });
// };
// }


const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await userService.registerUserIntoDB(payload);

    // res.status(httpStatus.CREATED).json({
    //   success: true,
    //   statusCode: httpStatus.CREATED,
    //   message: "User registered successfully",
    //   data: { user },
    // });
    sendResponse(res,{
      success: true,
      statusCode: httpStatus.CREATED, 
      message: "User registered successfully",
      data: { user },
    });
  },
);

export const userController = {
  registerUser,
};
