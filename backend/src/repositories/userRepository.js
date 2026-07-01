import { randomUUID } from "crypto";
import pool from "../config/db.js"; // [NEW] Restored missing pool import to prevent connection crash
export const createUser = async (username, email, password, role = "member") => {
    const userId = randomUUID();
    const result = await pool.query(
        "INSERT INTO users (user_id, username, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [userId, username, email, password, role]
    );
    return result.rows[0];
};

export const findUserByEmail = async (email) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
};