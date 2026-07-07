// # Import the postgres connection pool
import pool from "../config/db.js";

// # Creates a new project entry linked to a profile.
export const createProject = async (projectData) => {
    const {
        profile_id,
        title,
        description = null,
        github_link = null,
        tech_stack = null,
        demo_link = null
    } = projectData;

    // # Insert project data into the projects table
    const result = await pool.query(
        `INSERT INTO projects (profile_id, title, description, github_link, tech_stack, demo_link) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [profile_id, title, description, github_link, tech_stack, demo_link]
    );
    return result.rows[0];
};

// # Retrieves a specific project by its project_id.
export const findProjectById = async (projectId) => {
    // # Query projects table by project_id
    const result = await pool.query("SELECT * FROM projects WHERE project_id = $1", [projectId]);
    return result.rows[0];
};

// # Retrieves all projects linked to a user profile.
export const findProjectsByProfileId = async (profileId) => {
    // # Query projects table filtering by profile_id
    const result = await pool.query("SELECT * FROM projects WHERE profile_id = $1 ORDER BY created_at DESC", [profileId]);
    return result.rows;
};

// # Updates a project with new information.
export const updateProject = async (projectId, updateFields) => {
    const { title, description, github_link, tech_stack, demo_link } = updateFields;

    // # Execute update query using COALESCE to keep old value if field is undefined
    const result = await pool.query(
        `UPDATE projects 
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             github_link = COALESCE($3, github_link),
             tech_stack = COALESCE($4, tech_stack),
             demo_link = COALESCE($5, demo_link)
         WHERE project_id = $6 RETURNING *`,
        [title, description, github_link, tech_stack, demo_link, projectId]
    );
    return result.rows[0];
};

// # Deletes a project by its project_id.
export const deleteProject = async (projectId) => {
    // # Execute delete query
    const result = await pool.query("DELETE FROM projects WHERE project_id = $1 RETURNING *", [projectId]);
    return result.rows[0];
};
