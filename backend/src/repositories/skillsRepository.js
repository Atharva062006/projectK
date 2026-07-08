// # Import the postgres connection pool
import pool from "../config/db.js";

// # Lists all predefined skills from the skills table.
export const getAllPredefinedSkills = async () => {
    // # Query to fetch all predefined skills ordered by category
    const result = await pool.query("SELECT * FROM skills ORDER BY category, name");
    return result.rows;
};

// # Adds a new unique skill to the predefined skills table.
export const createPredefinedSkill = async (name, category) => {
    // # Inserts new skill or does nothing if skill name exists
    const result = await pool.query(
        "INSERT INTO skills (name, category) VALUES ($1, $2) ON CONFLICT (name) DO UPDATE SET category = COALESCE($2, skills.category) RETURNING *",
        [name, category]
    );
    return result.rows[0];
};

// # Links a predefined skill to a user profile in the member_skills table.
export const addSkillToProfile = async (profileId, skillId, level = 'Intermediate') => {
    // # Inserts link with confidence level (Beginner, Intermediate, Expert)
    const result = await pool.query(
        `INSERT INTO member_skills (profile_id, skill_id, level) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (profile_id, skill_id) 
         DO UPDATE SET level = $3 
         RETURNING *`,
        [profileId, skillId, level]
    );
    return result.rows[0];
};

// # Retrieves all skills associated with a specific profile.
export const getProfileSkills = async (profileId) => {
    // # Join query between member_skills and skills to get names and categories
    const result = await pool.query(
        `SELECT s.skill_id, s.name, s.category, ms.level 
         FROM member_skills ms
         JOIN skills s ON ms.skill_id = s.skill_id
         WHERE ms.profile_id = $1`,
        [profileId]
    );
    return result.rows;
};

// # Removes a linked skill from a profile.
export const removeSkillFromProfile = async (profileId, skillId) => {
    // # Delete junction record for profile and skill
    const result = await pool.query(
        "DELETE FROM member_skills WHERE profile_id = $1 AND skill_id = $2 RETURNING *",
        [profileId, skillId]
    );
    return result.rows[0];
};
