import httpStatus from "http-status";
import { Request, Response } from "express";
import { userService } from "./user.service";


//user registration controller
const registerUser = async (req: Request, res: Response) => {

try{
  const payload = req.body;
  const user = await userService.registerUserIntoDB(payload);

  //send response
  res.status(httpStatus.CREATED).json({
    sucess: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: { user },
  });
}
catch(error){
    console.error("Error registering user:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to register user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
};
}

export const userController = {
  registerUser,
};
