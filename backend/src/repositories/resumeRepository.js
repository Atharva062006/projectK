// # Import the postgres connection pool
import pool from "../config/db.js";

// # Registers a new resume file path for a member profile.
export const createResume = async (profileId, filePath) => {
    // # Insert resume record linking to profile
    const result = await pool.query(
        "INSERT INTO resumes (profile_id, file_path) VALUES ($1, $2) RETURNING *",
        [profileId, filePath]
    );
    return result.rows[0];
};

// # Retrieves a resume record by its resume_id.
export const findResumeById = async (resumeId) => {
    // # Query resumes by id
    const result = await pool.query("SELECT * FROM resumes WHERE resume_id = $1", [resumeId]);
    return result.rows[0];
};

// # Retrieves all resume records associated with a profile.
export const findResumesByProfileId = async (profileId) => {
    // # Query resumes filtering by profile_id
    const result = await pool.query("SELECT * FROM resumes WHERE profile_id = $1 ORDER BY uploaded_at DESC", [profileId]);
    return result.rows;
};

// # Deletes a resume record from the database.
export const deleteResume = async (resumeId) => {
    // # Execute delete query
    const result = await pool.query("DELETE FROM resumes WHERE resume_id = $1 RETURNING *", [resumeId]);
    return result.rows[0];
};

// # Logs a resume download event.
export const logResumeDownload = async (profileId, downloaderUserId) => {
    await pool.query(
        "INSERT INTO resume_downloads (profile_id, downloader_user_id) VALUES ($1, $2)",
        [profileId, downloaderUserId]
    );
};
