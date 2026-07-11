import handleResponse from "../util/handleResponse.js";
import { 
    getOwnProfileService, 
    updateOwnProfileService, 
    getProfileDetailsService 
} from "../services/profileService.js";
import { 
    getPredefinedSkillsService, 
    addSkillToOwnProfileService, 
    removeSkillFromOwnProfileService 
} from "../services/skillsService.js";
import { 
    addProjectService, 
    updateProjectService, 
    deleteProjectService 
} from "../services/projectsService.js";

// # Fetch current user's profile
export const getOwnProfile = async (req, res) => {
    try {
        const profile = await getOwnProfileService(req.user.user_id);
        return handleResponse(res, 200, "Profile retrieved successfully", profile);
    } catch (error) {
        const statusCode = error.message === "Profile not found" ? 404 : 500;
        return handleResponse(res, statusCode, error.message);
    }
};

// # Update current user's profile
export const updateOwnProfile = async (req, res) => {
    try {
        const profile = await updateOwnProfileService(req.user.user_id, req.body);
        return handleResponse(res, 200, "Profile updated successfully", profile);
    } catch (error) {
        const statusCode = error.message === "Profile not found" ? 404 : 500;
        return handleResponse(res, statusCode, error.message);
    }
};

// # Fetch detailed profile of any member (requires login)
export const getProfileDetails = async (req, res) => {
    const { profileId } = req.params;
    if (!profileId) {
        return handleResponse(res, 400, "Profile ID is required");
    }

    try {
        // req.user exists because this route is authenticated
        const profile = await getProfileDetailsService(profileId, req.user.user_id);
        return handleResponse(res, 200, "Profile details retrieved successfully", profile);
    } catch (error) {
        const statusCode = error.message === "Profile not found" ? 404 : 500;
        return handleResponse(res, statusCode, error.message);
    }
};

// # Get all predefined skills (for selection list)
export const getPredefinedSkills = async (req, res) => {
    try {
        const skills = await getPredefinedSkillsService();
        return handleResponse(res, 200, "Skills list retrieved successfully", skills);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

// # Add skill to profile
export const addSkill = async (req, res) => {
    const { skillId, level } = req.body;
    if (!skillId) {
        return handleResponse(res, 400, "Skill ID is required");
    }

    try {
        const result = await addSkillToOwnProfileService(req.user.user_id, skillId, level);
        return handleResponse(res, 201, "Skill added to profile successfully", result);
    } catch (error) {
        const statusCode = error.message === "Profile not found" ? 404 : 500;
        return handleResponse(res, statusCode, error.message);
    }
};

// # Remove skill from profile
export const removeSkill = async (req, res) => {
    const { skillId } = req.params;
    if (!skillId) {
        return handleResponse(res, 400, "Skill ID is required");
    }

    try {
        const result = await removeSkillFromOwnProfileService(req.user.user_id, skillId);
        return handleResponse(res, 200, "Skill removed from profile successfully", result);
    } catch (error) {
        const statusCode = (error.message === "Profile not found" || error.message === "Skill association not found on this profile") ? 404 : 500;
        return handleResponse(res, statusCode, error.message);
    }
};

// # Add project
export const addProject = async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return handleResponse(res, 400, "Project title is required");
    }

    try {
        const result = await addProjectService(req.user.user_id, req.body);
        return handleResponse(res, 201, "Project added successfully", result);
    } catch (error) {
        const statusCode = error.message === "Profile not found" ? 404 : 500;
        return handleResponse(res, statusCode, error.message);
    }
};

// # Update project
export const updateProject = async (req, res) => {
    const { projectId } = req.params;
    if (!projectId) {
        return handleResponse(res, 400, "Project ID is required");
    }

    try {
        const result = await updateProjectService(req.user.user_id, projectId, req.body);
        return handleResponse(res, 200, "Project updated successfully", result);
    } catch (error) {
        let statusCode = 500;
        if (error.message === "Profile not found" || error.message === "Project not found") {
            statusCode = 404;
        } else if (error.message.startsWith("Unauthorized")) {
            statusCode = 403;
        }
        return handleResponse(res, statusCode, error.message);
    }
};

// # Delete project
export const deleteProject = async (req, res) => {
    const { projectId } = req.params;
    if (!projectId) {
        return handleResponse(res, 400, "Project ID is required");
    }

    try {
        const result = await deleteProjectService(req.user.user_id, projectId);
        return handleResponse(res, 200, "Project deleted successfully", result);
    } catch (error) {
        let statusCode = 500;
        if (error.message === "Profile not found" || error.message === "Project not found") {
            statusCode = 404;
        } else if (error.message.startsWith("Unauthorized")) {
            statusCode = 403;
        }
        return handleResponse(res, statusCode, error.message);
    }
};
