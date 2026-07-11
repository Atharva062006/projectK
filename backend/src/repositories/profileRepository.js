// # Import the postgres connection pool
import pool from "../config/db.js";

// # Creates a profile for a given user with optional profile fields.
export const createProfile = async (profileData) => {
    const {
        user_id,
        full_name = null,
        yr_of_graduation = null,
        bio = null,
        tagline = null,
        availability = null,
        profile_image = null,
        department = null,
        college = null,
        location = null
    } = profileData;

    // # Insert profile data into the database
    const result = await pool.query(
        `INSERT INTO profiles (
            user_id, full_name, yr_of_graduation, bio, tagline, 
            availability, profile_image, department, college, location
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [
            user_id, full_name, yr_of_graduation, bio, tagline,
            availability, profile_image, department, college, location
        ]
    );
    return result.rows[0];
};

// # Retrieves a profile record by the profile_id.
export const findProfileById = async (profileId) => {
    // # Query profile table by profile_id primary key
    const result = await pool.query("SELECT * FROM profiles WHERE profile_id = $1", [profileId]);
    return result.rows[0];
};

// # Retrieves a profile record associated with a specific user_id.
export const findProfileByUserId = async (userId) => {
    // # Query profile table filtering by user_id foreign key
    const result = await pool.query("SELECT * FROM profiles WHERE user_id = $1", [userId]);
    return result.rows[0];
};

// # Updates a profile with new details.
export const updateProfile = async (profileId, updateFields) => {
    const {
        full_name,
        yr_of_graduation,
        bio,
        tagline,
        availability,
        profile_image,
        department,
        college,
        location,
        role_category
    } = updateFields;

    // # Execute update statement setting fields and updated_at timestamp
    const result = await pool.query(
        `UPDATE profiles 
         SET full_name = COALESCE($1, full_name),
             yr_of_graduation = COALESCE($2, yr_of_graduation),
             bio = COALESCE($3, bio),
             tagline = COALESCE($4, tagline),
             availability = COALESCE($5, availability),
             profile_image = COALESCE($6, profile_image),
             department = COALESCE($7, department),
             college = COALESCE($8, college),
             location = COALESCE($9, location),
             role_category = COALESCE($10, role_category),
             updated_at = CURRENT_TIMESTAMP
         WHERE profile_id = $11 
         RETURNING *`,
        [
            full_name, yr_of_graduation, bio, tagline, availability,
            profile_image, department, college, location, role_category, profileId
        ]
    );
    return result.rows[0];
};

// # Deletes a profile record from the database.
export const deleteProfile = async (profileId) => {
    // # Perform delete query by profile_id
    const result = await pool.query("DELETE FROM profiles WHERE profile_id = $1 RETURNING *", [profileId]);
    return result.rows[0];
};

// # Retrieves contact info associated with a specific profile.
export const getContactInfo = async (profileId) => {
    const result = await pool.query("SELECT * FROM contact_info WHERE profile_id = $1", [profileId]);
    return result.rows[0];
};

// # Updates contact info or creates it if it doesn't exist.
export const updateOrCreateContactInfo = async (profileId, contactFields) => {
    const { phone = null, linkedin = null, github = null, portfolio_url = null } = contactFields;
    const existing = await getContactInfo(profileId);
    if (existing) {
        const result = await pool.query(
            `UPDATE contact_info 
             SET phone = COALESCE($1, phone),
                 linkedin = COALESCE($2, linkedin),
                 github = COALESCE($3, github),
                 portfolio_url = COALESCE($4, portfolio_url)
             WHERE profile_id = $5
             RETURNING *`,
            [phone, linkedin, github, portfolio_url, profileId]
        );
        return result.rows[0];
    } else {
        const result = await pool.query(
            `INSERT INTO contact_info (profile_id, phone, linkedin, github, portfolio_url)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [profileId, phone, linkedin, github, portfolio_url]
        );
        return result.rows[0];
    }
};

// # Logs a detailed profile view with viewer user ID and timestamp.
export const logProfileView = async (viewedProfileId, viewerUserId) => {
    // Log the view in profile_views
    await pool.query(
        "INSERT INTO profile_views (viewed_profile_id, viewer_user_id) VALUES ($1, $2)",
        [viewedProfileId, viewerUserId]
    );
};

// # Directory search and filter query
export const searchDirectory = async (queryParams) => {
    const { search, skills, skillLevel, role, availability } = queryParams;
    
    let query = `
        SELECT 
            p.profile_id, 
            p.full_name, 
            p.profile_image, 
            p.tagline, 
            p.availability, 
            p.department, 
            p.role_category, 
            u.role,
            COALESCE(
                (SELECT json_agg(json_build_object('skill_id', s.skill_id, 'name', s.name, 'category', s.category, 'level', ms.level))
                 FROM member_skills ms
                 JOIN skills s ON ms.skill_id = s.skill_id
                 WHERE ms.profile_id = p.profile_id),
                '[]'::json
            ) as skills
        FROM profiles p
        JOIN users u ON p.user_id = u.user_id
        WHERE u.is_approved = true
    `;

    const values = [];
    let paramCounter = 1;

    // Search by Name, Skill, Project keyword
    if (search) {
        query += ` AND (
            p.full_name ILIKE $${paramCounter} 
            OR p.tagline ILIKE $${paramCounter}
            OR p.profile_id IN (
                SELECT ms.profile_id 
                FROM member_skills ms 
                JOIN skills s ON ms.skill_id = s.skill_id 
                WHERE s.name ILIKE $${paramCounter}
            )
            OR p.profile_id IN (
                SELECT pr.profile_id 
                FROM projects pr 
                WHERE pr.title ILIKE $${paramCounter} OR pr.description ILIKE $${paramCounter} OR pr.tech_stack ILIKE $${paramCounter}
            )
        )`;
        values.push(`%${search}%`);
        paramCounter++;
    }

    // Filter by specific skill IDs (multi-select)
    if (skills) {
        const skillIds = skills.split(',').map(s => s.trim());
        query += ` AND p.profile_id IN (
            SELECT ms.profile_id 
            FROM member_skills ms 
            WHERE ms.skill_id = ANY($${paramCounter}::uuid[])
        )`;
        values.push(skillIds);
        paramCounter++;
    }

    // Filter by skill level (e.g. Beginner, Intermediate, Expert)
    if (skillLevel) {
        query += ` AND p.profile_id IN (
            SELECT ms.profile_id 
            FROM member_skills ms 
            WHERE ms.level = $${paramCounter}
        )`;
        values.push(skillLevel);
        paramCounter++;
    }

    // Filter by role (member vs alumni)
    if (role) {
        query += ` AND u.role = $${paramCounter}`;
        values.push(role);
        paramCounter++;
    }

    // Filter by availability
    if (availability) {
        query += ` AND p.availability = $${paramCounter}`;
        values.push(availability);
        paramCounter++;
    }

    query += ` ORDER BY p.full_name ASC`;

    const result = await pool.query(query, values);
    return result.rows;
};
