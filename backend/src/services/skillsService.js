import { findProfileByUserId } from "../repositories/profileRepository.js";
import { 
    getAllPredefinedSkills, 
    addSkillToProfile, 
    removeSkillFromProfile,
    createPredefinedSkill
} from "../repositories/skillsRepository.js";

// # Get all predefined skills
export const getPredefinedSkillsService = async () => {
    return await getAllPredefinedSkills();
};

// # Add a skill to user's profile
export const addSkillToOwnProfileService = async (userId, skillId, level) => {
    const profile = await findProfileByUserId(userId);
    if (!profile) {
        throw new Error("Profile not found");
    }
    return await addSkillToProfile(profile.profile_id, skillId, level);
};

// # Remove a skill from user's profile
export const removeSkillFromOwnProfileService = async (userId, skillId) => {
    const profile = await findProfileByUserId(userId);
    if (!profile) {
        throw new Error("Profile not found");
    }
    const result = await removeSkillFromProfile(profile.profile_id, skillId);
    if (!result) {
        throw new Error("Skill association not found on this profile");
    }
    return result;
};

// # Create a new predefined skill (e.g. if admin wants to add one)
export const createPredefinedSkillService = async (name, category) => {
    if (!name) {
        throw new Error("Skill name is required");
    }
    return await createPredefinedSkill(name, category);
};
