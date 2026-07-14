import pool from "../config/db.js";

export const createProject = async (projectData) => {
    const {
        profile_id,
        title,
        description = null,
        github_link = null,
        tech_stack = null,
        demo_link = null
    } = projectData;


    const result = await pool.query(
        `INSERT INTO projects (profile_id, title, description, github_link, tech_stack, demo_link) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [profile_id, title, description, github_link, tech_stack, demo_link]
    );
    return result.rows[0];
};

export const findProjectById = async (projectId) => {

    const result = await pool.query("SELECT * FROM projects WHERE project_id = $1", [projectId]);
    return result.rows[0];
};

export const findProjectsByProfileId = async (profileId) => {
    const result = await pool.query("SELECT * FROM projects WHERE profile_id = $1 ORDER BY created_at DESC", [profileId]);
    return result.rows;
};

export const updateProject = async (projectId, updateFields) => {
    const { title, description, github_link, tech_stack, demo_link } = updateFields;


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

export const deleteProject = async (projectId) => {
    const result = await pool.query("DELETE FROM projects WHERE project_id = $1 RETURNING *", [projectId]);
    return result.rows[0];
};
