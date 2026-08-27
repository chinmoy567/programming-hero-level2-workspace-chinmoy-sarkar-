import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import config from "../../config";
import { registerUserPayload } from "./user.interface";

//user registration service
const registerUserIntoDB = async (payload: registerUserPayload) => {
  const { name, email, password, profilephoto } = payload;

  //is user exisits or not
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (isUserExists) {
    throw new Error("User already exists");
  }

  //hash the password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  //create user
  const createduser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      profile: {
        create: {
          profilephoto,
        },
      },
    },
  });
  //fetch the user without password and with profile
  const user = await prisma.user.findUnique({
    where: {
      id: createduser.id,
      email: createduser.email,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
  return user;
};

//get my profile service
const getMyProfileFromDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
  return user;
};

export const userService = {
  registerUserIntoDB,
  getMyProfileFromDB,
};
