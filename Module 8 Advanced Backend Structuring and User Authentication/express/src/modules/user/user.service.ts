import { pool } from "../../db";
import type { Iuser } from "./user.interface";
import bycrypt from "bcryptjs";

// Function to create a new user in the database
const createUserIntoDB = async (payload: Iuser) => {
  const { name, email, password, age } = payload;

  const hashedPassword = await bycrypt.hash(password, 12);
  console.log("Hashed Password:", hashedPassword); // Debugging log

  const result = await pool.query(
    `INSERT INTO users(name, email, password, age) VALUES($1, $2, $3, $4) RETURNING *`,
    [name, email, hashedPassword, age],
  );
  console.log(result.rows[0]);
  delete result.rows[0].password;
  delete result.rows[0].is_active;
  return result;
};

// Function to retrieve all users from the database
const getAllUsersFromDB = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};
const getSingleUserFromDB = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
  return result;
};

// Function to update a user in the database by ID
const updateUserFromDB = async (payload: Iuser, id: string) => {
  const { name, password, age, is_active } = payload;
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
  return result;
};

// Function to delete a user from the database by ID
const deleteUserFromDB = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id=$1 RETURNING *`, [
    id,
  ]);
  return result;
};

// Exporting the service functions as an object for use in controllers
export const userService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserFromDB,
  deleteUserFromDB,
};
