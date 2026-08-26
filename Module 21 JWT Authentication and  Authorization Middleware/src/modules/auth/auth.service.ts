import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import { ILoginUser } from "./auth.interface";
import bcrypt from "bcrypt";

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  //find user by email
  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });
  //check password
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new Error("Password is incorrect");
  }

  //create jwt payload
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  //create acess token
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET,
    config.JWT_ACCESS_EXPIRES_IN,
  );

  //create refresh token
  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.JWT_REFRESH_SECRET,
    config.JWT_REFRESH_EXPIRES_IN,
  );


  return {
    accessToken,
    refreshToken,
  };
};
export const authService = {
  loginUser,
};
