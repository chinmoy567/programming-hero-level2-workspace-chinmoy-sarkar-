import type { Request, Response, NextFunction } from "express";
import config from "../config";
import jwt from "jsonwebtoken";
import { pool } from "../db";
import type { ROLES } from "../types";

const auth = (...roles: ROLES[]) => {
  console.log("Roles in auth middleware:", roles); // Debugging log
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      //if token is not present, return 401 Unauthorized
      if (!token) {
        return res.status(401).json({
          sucess: false,
          message: "Unauthorized",
        });
      }
      const decoded = jwt.verify(
        token,
        config.secret_key as string,
      ) as jwt.JwtPayload;

      //fetch user from database using email from decoded token
      const userData = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [decoded.email],
      );
      const user = userData.rows[0];
      //if user is not found, return 401 Unauthorized
      if (userData.rowCount === 0) {
        return res.status(404).json({
          sucess: false,
          message: "user not found",
        });
      }

      if (!user?.is_active) {
        return res.status(403).json({
          success: false,
          message: "user is not active",
        });
      }

      if (roles.length > 0 && !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }

      req.user = decoded;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
