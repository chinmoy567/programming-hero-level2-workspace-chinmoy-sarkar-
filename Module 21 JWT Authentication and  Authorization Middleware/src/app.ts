import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";

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
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

export default app;
