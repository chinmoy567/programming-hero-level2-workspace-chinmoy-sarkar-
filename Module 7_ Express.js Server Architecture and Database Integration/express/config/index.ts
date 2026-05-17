import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  connection_string: process.env.NEONDVCONNECTIONSTRING as string,
  port: Number(process.env.PORT) || 3000,
};

export default config;
