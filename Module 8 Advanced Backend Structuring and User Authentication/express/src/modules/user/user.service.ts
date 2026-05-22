
import { pool } from "../../db"; 
import type { Iuser } from "./user.interface";


const createUserIntoDB = async (payload: Iuser) => {
    const { name, email, password, age } = payload;
    const result = await pool.query(
      `INSERT INTO users(name, email, password, age) VALUES($1, $2, $3, $4) RETURNING *`,
      [name, email, password, age],
    );
    console.log(result.rows[0]);
    return result;
}

export const userService = { createUserIntoDB };