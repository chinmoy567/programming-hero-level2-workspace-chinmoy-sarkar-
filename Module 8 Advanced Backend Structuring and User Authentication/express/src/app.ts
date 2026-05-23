import express from "express";
import looger from "./middleware/logger";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.routes";
import { authRoute } from "./modules/auth/auth.route";

const app = express();
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

// Logger Middleware
app.use(looger);

app.use("/api/users", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/auth", authRoute);

export default app;
