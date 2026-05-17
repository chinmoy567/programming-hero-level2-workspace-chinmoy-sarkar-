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
    age INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  } catch (error: any) {
    console.error("Error initializing database:", error);
  } finally {
    console.log("Database initialized successfully");
  }
};
initDB();

// Route to handle POST requests and insert data into the database
app.post("/api/user", async (req: Request, res: Response) => {
  try {
    const { name, email, password, age } = req.body;
    const result = await pool.query(
      `INSERT INTO users(name, email, password, age) VALUES($1, $2, $3, $4) RETURNING *`,
      [name, email, password, age],
    );
    console.log(result.rows[0]);

    res.status(201).json({
      success: true,
      message: "Data received successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error inserting data:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while inserting data",
      error: error,
    });
  }
});

// // Middleware to parse JSON bodies
// app.get("/api/users", (req: Request, res: Response) => {
//   res.status(200).json({
//     message: "Hello, World!",
//     author: "chinmoy",
//   });
// });

// Route to handle GET requests and retrieve all users from the database
app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    console.error("Error retrieving users:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while retrieving users",
      error: error,
    });
  }
});

// Route to handle GET requests and retrieve a user by ID
app.get("/api/user/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Print full user data in terminal
    console.log(result.rows[0]);

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error retrieving user:", error);

    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while retrieving the user",
      error: error,
    });
  }
});

// Route to handle PUT requests and update a user by ID
app.patch("/api/user/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { name, email, password, age } = req.body;
    const result = await pool.query(
      `UPDATE users SET name = $1, email = $2, password = $3, age = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *`,
      [name, email, password, age, userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    console.log(result.rows[0]);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while updating the user",
      error: error,
    });
  }
});

// Route to handle DELETE requests and delete a user by ID
app.delete("/api/user/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING *`,
      [userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    console.log(result.rows[0]);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while deleting the user",
      error: error,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
