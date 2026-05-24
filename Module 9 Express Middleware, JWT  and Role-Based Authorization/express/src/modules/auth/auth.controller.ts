import { type Request, type Response } from "express";
import { authService } from "./auth.service";

// Login Controller
const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);

    const { refreshToken } = result;

    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

// Refresh Token Controller
const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;

    const result = await authService.generateRefreshToken(token);

    res.status(200).json({
      success: true,
      message: "Access token generated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

export const authController = {
  loginUser,
  refreshToken,
};

// import { type Request, type Response } from "express";
// import { authService } from "./auth.service";

// const loginUser = async (req: Request, res: Response) => {
//   try {
//     const result = await authService.loginUserIntoDB(req.body);
//     const { refreshToken } = result;

//     res.status(200).cookie("refreshToken", refreshToken, {
//       secure: false,
//       httpOnly: true,
//       sameSite: "lax",
//     });
//     res.status(200).json({
//       success: true,
//       message: "User logged in successfully",
//       data: result,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//       error: error,
//     });
//   }
// };

// // Controller function to handle refreshing the access token
// const refresshToken = async (req: Request, res: Response) => {
//   try {
//     const result = await authService.generateRefreshToken(req.cookies.refreshToken);

//     res.status(200).json({
//       success: true,
//       message: "User logged in successfully",
//       data: result,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//       error: error,
//     });
//   }
// };

// export const authController = {
//   loginUser,
//   refresshToken,
// };
