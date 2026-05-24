import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";

// Function to handle user login and generate JWT token
const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;
  // Check if user exists
  const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);
  const user = userData.rows[0];
  console.log(user);

  if (userData.rows.length === 0) {
    throw new Error("User not found");
  }
  // Check if password matches
  const matchpasword = await bcrypt.compare(password, user.password);
  if (!matchpasword) {
    throw new Error("Invalid password");
  }

  //generate token
  const jwtPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    is_active: user.is_active,
  };

  //access token with 365 days expiry
  const accessToken = jwt.sign(jwtPayload, config.secret_key as string, {
    expiresIn: "365d",
  });

  //refresh token with 365 days expiry
  const refreshToken = jwt.sign(jwtPayload, config.secret_key as string, {
    expiresIn: "365d",
  });

  return { accessToken, refreshToken };
};

// Function to verify refresh token and generate new tokens
const generateRefreshToken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized");
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
    throw new Error("User not found");
  }
  
  //if user is not active, return 403 Forbidden
  if (!user?.is_active) {
    throw new Error("User is not active");
  }

  // Generate new token payloads
  const jwtPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    is_active: user.is_active,
  };

  const accessToken = jwt.sign(jwtPayload, config.secret_key as string, {
    expiresIn: "365d",
  });

  const refreshToken = jwt.sign(jwtPayload, config.secret_key as string, {
    expiresIn: "365d",
  });

  return { accessToken, refreshToken };
};

export const authService = {
  loginUserIntoDB,
  generateRefreshToken,
};
