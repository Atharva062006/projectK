// # Import the postgres connection pool
import pool from "../config/db.js";

// # Creates an audit log entry for security tracking and actions.
export const createAuditLog = async (userId, action, ipAddress = null) => {
    // # Insert action log into audit_logs table
    const result = await pool.query(
        "INSERT INTO audit_logs (user_id, action, ip_address) VALUES ($1, $2, $3) RETURNING *",
        [userId, action, ipAddress]
    );
    return result.rows[0];
};

// # Retrieves system audit logs sorted by newest first.
export const getAuditLogs = async (limit = 100) => {
    // # Query audit logs with custom record limit
    const result = await pool.query(
        "SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT $1",
        [limit]
    );
    return result.rows;
};
