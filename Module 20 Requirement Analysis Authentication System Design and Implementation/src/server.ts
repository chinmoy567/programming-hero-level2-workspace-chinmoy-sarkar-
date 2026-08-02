import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";
import "dotenv/config";
const port = config.port;

async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
