import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config";
import httpStatus from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcrypt";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.post("/api/users/register", async (req: Request, res: Response) => {
  const { name, email, password, profilephoto } = req.body;
  console.log("Received payload:", { name, email, password, profilephoto });

  //is user exisits or not
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (isUserExists) {
    return res
      .status(httpStatus.CONFLICT)
      .json({ message: "User already exists" });
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
    },
  });

  //create profile
  const profile = await prisma.profile.create({
    data: {
      userId: createduser.id,
      profilephoto,
    },
  });

  //find user
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

  //send response
  res.status(httpStatus.CREATED).json({
    sucess: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: { user },
  });
});

export default app;
