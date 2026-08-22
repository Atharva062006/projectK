// # Import the postgres connection pool
import pool from "../config/db.js";

// # Creates a new user record in the database using hashed password.
// # The database automatically generates a UUID for user_id.
export const createUser = async (username, email, passwordHash, role = "member", isApproved = false) => {
    // # Execute insertion and return the created user row
    const result = await pool.query(
        "INSERT INTO users (username, email, password_hash, role, is_approved) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [username, email, passwordHash, role, isApproved]
    );
    return result.rows[0];
};

// # Finds a user in the database by their Google ID.
export const findUserByGoogleId = async (googleId) => {
    const result = await pool.query("SELECT * FROM users WHERE google_id = $1", [googleId]);
    return result.rows[0];
};

// # Creates a new Google authenticated user record (without password hash).
export const createGoogleUser = async (username, email, googleId, role = "member", isApproved = true) => {
    const result = await pool.query(
        "INSERT INTO users (username, email, google_id, role, is_approved) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [username, email, googleId, role, isApproved]
    );
    return result.rows[0];
};

// # Links Google ID to an existing email user account.
export const linkGoogleId = async (userId, googleId) => {
    const result = await pool.query(
        "UPDATE users SET google_id = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING *",
        [googleId, userId]
    );
    return result.rows[0];
};

// # Finds a user by their username.
export const findUserByUsername = async (username) => {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
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
    // # Set last_login column column to current timestamp
    await pool.query(
        "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1",
        [userId]
    );
};

// # Gets all users with pending approval (is_approved = false) who are members or alumni.
export const getPendingUsers = async () => {
    const result = await pool.query(
        "SELECT user_id, username, email, role, created_at FROM users WHERE is_approved = false AND role IN ('member', 'alumni') ORDER BY created_at DESC"
    );
    return result.rows;
};

// # Updates a user's approval status (approve or disable).
export const updateApprovalStatus = async (userId, isApproved) => {
    const result = await pool.query(
        "UPDATE users SET is_approved = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING *",
        [isApproved, userId]
    );
    return result.rows[0];
};

// # Retrieves all users for admin reporting.
export const getAllUsers = async () => {
    const result = await pool.query(
        "SELECT user_id, username, email, role, is_approved, last_login, created_at FROM users ORDER BY created_at DESC"
    );
    return result.rows;
};

// # Sets reset token and expiry for a user by email.
export const setResetToken = async (email, token, expiry) => {
    const result = await pool.query(
        "UPDATE users SET reset_token = $1, reset_token_expiry = $2, updated_at = CURRENT_TIMESTAMP WHERE email = $3 RETURNING *",
        [token, expiry, email]
    );
    return result.rows[0];
};

// # Finds a user by reset token that is not expired.
export const findUserByResetToken = async (token) => {
    const result = await pool.query(
        "SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > CURRENT_TIMESTAMP",
        [token]
    );
    return result.rows[0];
};

// # Updates a user's password and clears reset token.
export const updatePassword = async (userId, passwordHash) => {
    const result = await pool.query(
        `UPDATE users 
         SET password_hash = $1, 
             reset_token = NULL, 
             reset_token_expiry = NULL, 
             updated_at = CURRENT_TIMESTAMP 
         WHERE user_id = $2 
         RETURNING *`,
        [passwordHash, userId]
    );
    return result.rows[0];
};