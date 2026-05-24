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
    is_active: user.is_active,
  };
  const accessToken = jwt.sign(jwtPayload, config.secret_key as string, {
    expiresIn: "365d",
  });
  return { accessToken };
};

export const authService = {
  loginUserIntoDB,
};
