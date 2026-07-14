import pool from "../config/db.js";

// # Creates a new pitch record
export const createPitch = async (title, description, createdBy) => {
    const result = await pool.query(
        "INSERT INTO pitches (title, description, created_by) VALUES ($1, $2, $3) RETURNING *",
        [title, description, createdBy]
    );
    return result.rows[0];
};

// # Adds a profile to a pitch
export const addProfileToPitch = async (pitchId, profileId) => {
    await pool.query(
        "INSERT INTO pitch_members (pitch_id, profile_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [pitchId, profileId]
    );
};

// # Fetches a pitch record by ID
export const findPitchById = async (pitchId) => {
    const result = await pool.query("SELECT * FROM pitches WHERE pitch_id = $1", [pitchId]);
    return result.rows[0];
};

// # Fetches members of a pitch along with card details and contact info
export const findPitchMembersDetails = async (pitchId) => {
    const result = await pool.query(
        `SELECT 
            p.profile_id, 
            p.full_name, 
            p.profile_image, 
            p.tagline, 
            p.availability, 
            p.department,
            p.role_category,
            u.email,
            c.phone,
            c.linkedin,
            c.github,
            c.portfolio_url,
            COALESCE(
                (SELECT json_agg(json_build_object('skill_id', s.skill_id, 'name', s.name, 'category', s.category, 'level', ms.level))
                 FROM member_skills ms
                 JOIN skills s ON ms.skill_id = s.skill_id
                 WHERE ms.profile_id = p.profile_id),
                '[]'::json
            ) as skills
         FROM pitch_members pm
         JOIN profiles p ON pm.profile_id = p.profile_id
         JOIN users u ON p.user_id = u.user_id
         LEFT JOIN contact_info c ON p.profile_id = c.profile_id
         WHERE pm.pitch_id = $1`,
        [pitchId]
    );
    return result.rows;
};

// # Deactivates a pitch page
export const deactivatePitch = async (pitchId) => {
    const result = await pool.query(
        "UPDATE pitches SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE pitch_id = $1 RETURNING *",
        [pitchId]
    );
    return result.rows[0];
};

// # Retrieves all pitches for admin overview
export const getAllPitches = async () => {
    const result = await pool.query(
        `SELECT p.*, count(pm.profile_id)::int as member_count 
         FROM pitches p 
         LEFT JOIN pitch_members pm ON p.pitch_id = pm.pitch_id 
         GROUP BY p.pitch_id 
         ORDER BY p.created_at DESC`
    );
    return result.rows;
};

