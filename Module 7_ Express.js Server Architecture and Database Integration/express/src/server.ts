import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

// Create a connection pool to the PostgreSQL database
const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_fmU9eqQJrCA7@ep-falling-hall-apbwucr4-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

// Function to initialize the database and create the users table if it doesn't exist
const initDB = async () => {
  try {
    await pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Error initializing database:", err);
  }
};
initDB();

// Middleware to parse JSON bodies
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello, World!",
    author: "chinmoy",
  });
});

// Endpoint to receive JSON data
app.post("/", (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  res.status(201).json({
    message: "Data received successfully",
    data: {
      name,
      email,
      password,
    },
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
