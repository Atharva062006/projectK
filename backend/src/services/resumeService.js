import { findProfileByUserId, findProfileById } from "../repositories/profileRepository.js";
import { createResume, findResumesByProfileId, logResumeDownload } from "../repositories/resumeRepository.js";
import { logOutboundClick } from "../repositories/analyticsRepository.js";

// # Uploads a new resume and links it to the member's profile
export const uploadResumeService = async (userId, filePath) => {
    const profile = await findProfileByUserId(userId);
    if (!profile) {
        throw new Error("Profile not found");
    }

    return await createResume(profile.profile_id, filePath);
};

// # Tracks and downloads the latest resume for a profile
export const downloadResumeService = async (profileId, downloaderUserId) => {
    const profile = await findProfileById(profileId);
    if (!profile) {
        throw new Error("Profile not found");
    }

    const resumes = await findResumesByProfileId(profileId);
    if (!resumes || resumes.length === 0) {
        throw new Error("No resume found for this profile");
    }

    // Log the download event in the database for analytics safely
    try {
        await logResumeDownload(profileId, downloaderUserId);
    } catch (logErr) {
        console.error("Failed to log resume download analytics:", logErr);
    }

    // Return the file path of the latest uploaded resume
    return resumes[0].file_path;
};

// # Tracks an outbound click event
export const trackOutboundClickService = async (profileId, userId, linkType, clickedUrl) => {
    const profile = await findProfileById(profileId);
    if (!profile) {
        throw new Error("Profile not found");
    }

    await logOutboundClick(profileId, userId, linkType, clickedUrl);
    return { success: true };
};
