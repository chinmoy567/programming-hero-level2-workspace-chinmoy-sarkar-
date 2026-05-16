import express, {
  type Application,
  type Request,
  type Response,
} from "express";
const app = express();
const port = 3000;
app.use(express.json());

// Middleware to parse JSON bodies
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello, World!",
    author: "chinmoy",
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
