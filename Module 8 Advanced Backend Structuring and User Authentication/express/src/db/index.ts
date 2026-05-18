

import { Pool } from "pg";
import { config } from "../config";
// Create a connection pool to the PostgreSQL database
export const pool = new Pool({
  connectionString: config.connection_string,
});

// Function to initialize the database and create the users table if it doesn't exist
export const initDB = async () => {
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
