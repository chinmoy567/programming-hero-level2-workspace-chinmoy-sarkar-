import express, { type Request, type Response } from "express";
import { pool } from "./db";
import { userRoute } from "./modules/user/user.route";

const app = express();
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoute);

export default app;
