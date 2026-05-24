import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Check if token is present in the header
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        sucess: false,
        message: "Unauthorized",
      });
    }
    //if token is present then verify the token
    const decoded = jwt.verify(
      token as string,
      config.secret_key as string,
    ) as jwt.JwtPayload;

    // Check if user exists in the database
    const userData = await pool.query("SELECT * FROM users WHERE email = $1", [
      decoded.email,
    ]);
    // If user does not exist, return unauthorized
    const user = userData.rows[0];
    if (userData.rows.length === 0) {
      return res.status(401).json({
        sucess: false,
        message: "User not found",
      });
    }
    // If user is not active, return unauthorized
    if (!user.is_active) {
      return res.status(403).json({
        sucess: false,
        message: "User is not active",
      });
    }
    req.user = decoded;
    next();
  };
};

export default auth;
