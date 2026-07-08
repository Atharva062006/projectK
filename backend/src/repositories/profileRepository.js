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
        location
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
             updated_at = CURRENT_TIMESTAMP
         WHERE profile_id = $10 
         RETURNING *`,
        [
            full_name, yr_of_graduation, bio, tagline, availability,
            profile_image, department, college, location, profileId
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
