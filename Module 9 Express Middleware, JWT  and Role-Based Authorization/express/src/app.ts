import express from "express";
import looger from "./middleware/logger";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.routes";
import { authRoute } from "./modules/auth/auth.route";
import cookieParser from "cookie-parser";
import cros from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app = express();
app.use(cros());
app.use(cookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use(cros({ origin: "http://localhost:3000", credentials: true }));

app.use(looger);
app.use("/api/users", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/auth", authRoute);

app.use(globalErrorHandler);

export default app;
