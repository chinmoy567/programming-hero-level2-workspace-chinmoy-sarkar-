
import { type Request, type Response } from "express";
import { userService } from "./user.service";


const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body);
    

    res.status(201).json({
      success: true,
      message: "Data received successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error inserting data:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while inserting data",
      error: error,
    });
  }
};

export const userController = { createUser };