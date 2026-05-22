import express, { type Request, type Response } from "express";
import { pool } from "./db";

const app = express();
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

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

// Route to handle GET requests and retrieve all users from the database
app.get("/api/users", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello, World!",
    author: "chinmoy",
  });
});

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
app.put("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, password, age, is_active } = req.body;

  // console.log("Id : ", id);
  // console.log({ name, password, age, is_active });

  try {
    const result = await pool.query(
      `
    UPDATE users 
    SET 
    name=COALESCE($1,name),
    password=COALESCE($2,password),
    age=COALESCE($3,age),
    is_active=COALESCE($4,is_active) 

    WHERE id=$5 RETURNING *
    `,
      [name, password, age, is_active, id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User Not found!",
      });
    }

    // console.log(result);
    res.status(200).json({
      success: true,
      message: "User updated successfully!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

// Route to handle DELETE requests and delete a user by ID
app.delete("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
    DELETE FROM users WHERE id=$1  
      `,
      [id],
    );

    console.log(result);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User Not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully!",
      data: {},
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

export default app;
