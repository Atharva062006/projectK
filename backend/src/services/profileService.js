import { 
    findProfileByUserId, 
    findProfileById, 
    updateProfile, 
    getContactInfo, 
    updateOrCreateContactInfo,
    logProfileView,
    getProfileAnalytics
} from "../repositories/profileRepository.js";
import { getProfileSkills } from "../repositories/skillsRepository.js";
import { findProjectsByProfileId } from "../repositories/projectsRepository.js";
import { findResumesByProfileId } from "../repositories/resumeRepository.js";

// # Calculates profile completion percentage.
export const calculateProfileCompletion = (profile, contact, skills, projects, resumes) => {
    let completion = 0;

    // 1. Profile fields (45% total, 5% each for 9 fields)
    const baseFields = [
        'full_name', 'yr_of_graduation', 'bio', 'tagline', 
        'availability', 'profile_image', 'department', 'college', 'location'
    ];
    baseFields.forEach(field => {
        if (profile && profile[field] !== null && profile[field] !== undefined && String(profile[field]).trim() !== '') {
            completion += 5;
        }
    });

    // 2. Contact fields (20% total, 5% each for 4 fields)
    const contactFields = ['phone', 'linkedin', 'github', 'portfolio_url'];
    contactFields.forEach(field => {
        if (contact && contact[field] !== null && contact[field] !== undefined && String(contact[field]).trim() !== '') {
            completion += 5;
        }
    });

    // 3. Projects (15% if at least one project exists)
    if (projects && projects.length > 0) {
        completion += 15;
    }

    // 4. Skills (10% if at least one skill is linked)
    if (skills && skills.length > 0) {
        completion += 10;
    }

    // 5. Resume (10% if at least one resume is uploaded)
    if (resumes && resumes.length > 0) {
        completion += 10;
    }

    return completion;
};

// # Retrieves full own profile details (for logged-in member/alumni)
export const getOwnProfileService = async (userId) => {
    const profile = await findProfileByUserId(userId);
    if (!profile) {
        throw new Error("Profile not found");
    }

    const [contact, skills, projects, resumes, analytics] = await Promise.all([
        getContactInfo(profile.profile_id),
        getProfileSkills(profile.profile_id),
        findProjectsByProfileId(profile.profile_id),
        findResumesByProfileId(profile.profile_id),
        getProfileAnalytics(profile.profile_id)
    ]);

    const completion = calculateProfileCompletion(profile, contact, skills, projects, resumes);

    return {
        ...profile,
        contact,
        skills,
        projects,
        resumes,
        completion_percentage: completion,
        analytics
    };
};

// # Updates profile and contact info
export const updateOwnProfileService = async (userId, updateFields) => {
    const profile = await findProfileByUserId(userId);
    if (!profile) {
        throw new Error("Profile not found");
    }

    // 1. Update base profile fields
    const updatedProfile = await updateProfile(profile.profile_id, updateFields);

    // 2. Update contact details if provided
    let updatedContact = null;
    const hasContactFields = updateFields.phone !== undefined || 
                             updateFields.linkedin !== undefined || 
                             updateFields.github !== undefined || 
                             updateFields.portfolio_url !== undefined ||
                             updateFields.contact !== undefined;

    if (hasContactFields) {
        const contactData = updateFields.contact || {
            phone: updateFields.phone,
            linkedin: updateFields.linkedin,
            github: updateFields.github,
            portfolio_url: updateFields.portfolio_url
        };
        updatedContact = await updateOrCreateContactInfo(profile.profile_id, contactData);
    } else {
        updatedContact = await getContactInfo(profile.profile_id);
    }

    const [skills, projects, resumes, analytics] = await Promise.all([
        getProfileSkills(profile.profile_id),
        findProjectsByProfileId(profile.profile_id),
        findResumesByProfileId(profile.profile_id),
        getProfileAnalytics(profile.profile_id)
    ]);

    const completion = calculateProfileCompletion(updatedProfile, updatedContact, skills, projects, resumes);

    return {
        ...updatedProfile,
        contact: updatedContact,
        skills,
        projects,
        resumes,
        completion_percentage: completion,
        analytics
    };
};

// # Retrieves full details of any profile (used by authenticated directory view). Logs the view.
export const getProfileDetailsService = async (profileId, viewerUserId) => {
    const profile = await findProfileById(profileId);
    if (!profile) {
        throw new Error("Profile not found");
    }

    // Log detailed view if viewer is not the profile owner
    if (viewerUserId && profile.user_id !== viewerUserId) {
        await logProfileView(profileId, viewerUserId);
    }

    const [contact, skills, projects, resumes] = await Promise.all([
        getContactInfo(profile.profile_id),
        getProfileSkills(profile.profile_id),
        findProjectsByProfileId(profile.profile_id),
        findResumesByProfileId(profile.profile_id)
    ]);

    const completion = calculateProfileCompletion(profile, contact, skills, projects, resumes);

    return {
        ...profile,
        contact,
        skills,
        projects,
        resumes,
        completion_percentage: completion
    };
};
