import pool from "../config/db.js";

export const createAuditLog = async (userId, action, ipAddress = null) => {

    const result = await pool.query(
        "INSERT INTO audit_logs (user_id, action, ip_address) VALUES ($1, $2, $3) RETURNING *",
        [userId, action, ipAddress]
    );
    return result.rows[0];
};

export const getAuditLogs = async (limit = 100) => {
    const result = await pool.query(
        "SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT $1",
        [limit]
    );
    return result.rows;
};
