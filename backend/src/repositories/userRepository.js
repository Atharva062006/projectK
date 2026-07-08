// # Import the postgres connection pool
import pool from "../config/db.js";

// # Creates a new user record in the database using hashed password.
// # The database automatically generates a UUID for user_id.
export const createUser = async (username, email, passwordHash, role = "member") => {
    // # Execute insertion and return the created user row
    const result = await pool.query(
        "INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *",
        [username, email, passwordHash, role]
    );
    return result.rows[0];
};

// # Finds a user in the database by their unique email address.
export const findUserByEmail = async (email) => {
    // # Query users table filtering by email column
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
};

// # Finds a user by their user_id UUID.
export const findUserById = async (userId) => {
    // # Query users table filtering by user_id primary key
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [userId]);
    return result.rows[0];
};

// # Updates the last_login timestamp for a user.
export const updateLastLogin = async (userId) => {
    // # Set last_login column to current timestamp
    await pool.query(
        "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1",
        [userId]
    );
};