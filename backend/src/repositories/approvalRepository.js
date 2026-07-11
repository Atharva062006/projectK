import pool from "../config/db.js";

// # Creates a new approval request for a profile.
export const createApprovalRequest = async (profileId) => {
    const result = await pool.query(
        "INSERT INTO approval_requests (profile_id, status) VALUES ($1, 'pending') RETURNING *",
        [profileId]
    );
    return result.rows[0];
};

// # Updates the status of an approval request.
export const updateApprovalRequestStatus = async (profileId, status, reviewedBy) => {
    const result = await pool.query(
        "UPDATE approval_requests SET status = $1, reviewed_by = $2, reviewed_at = CURRENT_TIMESTAMP WHERE profile_id = $3 RETURNING *",
        [status, reviewedBy, profileId]
    );
    return result.rows[0];
};

// # Retrieves all pending approval requests with user and profile details.
export const getPendingApprovalRequests = async () => {
    const result = await pool.query(
        `SELECT ar.request_id, ar.status, ar.profile_id, p.full_name, u.email, u.role, u.user_id, u.created_at
         FROM approval_requests ar
         JOIN profiles p ON ar.profile_id = p.profile_id
         JOIN users u ON p.user_id = u.user_id
         WHERE ar.status = 'pending'
         ORDER BY u.created_at DESC`
    );
    return result.rows;
};
