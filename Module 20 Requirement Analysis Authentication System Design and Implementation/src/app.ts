import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config";
import { userRouter } from "./modules/user/user.router";

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

//test route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

//user route
app.use("/api/users", userRouter);

export default app;
