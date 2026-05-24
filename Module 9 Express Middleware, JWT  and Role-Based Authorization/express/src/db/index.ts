import { Pool } from "pg";
import config  from "../config";
// Create a connection pool to the PostgreSQL database
export const pool = new Pool({
  connectionString: config.connection_string,
});

// Function to initialize the database and create the users table if it doesn't exist
export const initDB = async () => {
  try {
    // Create the users table
    await pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    age INTEGER,
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
    // Create the profiles table with a foreign key reference to the users table
    await pool.query(`
  CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    address VARCHAR(255),
    phone VARCHAR(20),
    gender VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`);
  } catch (error: any) {
    console.error("Error initializing database:", error);
  } finally {
    console.log("Database initialized successfully");
  }
};
