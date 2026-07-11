import { findProfileByUserId } from "../repositories/profileRepository.js";
import { 
    createProject, 
    findProjectById, 
    updateProject, 
    deleteProject 
} from "../repositories/projectsRepository.js";

// # Add a project to user's profile
export const addProjectService = async (userId, projectData) => {
    const profile = await findProfileByUserId(userId);
    if (!profile) {
        throw new Error("Profile not found");
    }

    return await createProject({
        ...projectData,
        profile_id: profile.profile_id
    });
};

// # Update a project
export const updateProjectService = async (userId, projectId, updateFields) => {
    const profile = await findProfileByUserId(userId);
    if (!profile) {
        throw new Error("Profile not found");
    }

    const project = await findProjectById(projectId);
    if (!project) {
        throw new Error("Project not found");
    }

    // Security check: Ensure the project belongs to the current user's profile
    if (project.profile_id !== profile.profile_id) {
        throw new Error("Unauthorized: You cannot modify this project");
    }

    return await updateProject(projectId, updateFields);
};

// # Delete a project
export const deleteProjectService = async (userId, projectId) => {
    const profile = await findProfileByUserId(userId);
    if (!profile) {
        throw new Error("Profile not found");
    }

    const project = await findProjectById(projectId);
    if (!project) {
        throw new Error("Project not found");
    }

    // Security check
    if (project.profile_id !== profile.profile_id) {
        throw new Error("Unauthorized: You cannot delete this project");
    }

    return await deleteProject(projectId);
};
