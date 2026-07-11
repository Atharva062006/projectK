import { searchDirectory } from "../repositories/profileRepository.js";

// # Service to fetch, format and group directory profiles
export const getDirectoryService = async (queryParams) => {
    // 1. Fetch search and filter results from repository
    const profiles = await searchDirectory(queryParams);

    // 2. Initialize grouped structure
    const grouped = {
        "Core Team": [],
        "Technical Team": [],
        "Other Members": [],
        "Alumni": []
    };

    // 3. Format and distribute into groups
    profiles.forEach(profile => {
        // Limit skills in the card preview to top 3
        const cardSkills = Array.isArray(profile.skills) ? profile.skills.slice(0, 3) : [];

        const profileCard = {
            profile_id: profile.profile_id,
            full_name: profile.full_name,
            profile_image: profile.profile_image,
            tagline: profile.tagline,
            availability: profile.availability,
            department: profile.department,
            role_category: profile.role_category,
            role: profile.role,
            skills: cardSkills
        };

        // Determine category group
        const groupKey = profile.role_category || "Other Members";
        if (grouped[groupKey]) {
            grouped[groupKey].push(profileCard);
        } else {
            // Fallback group
            grouped["Other Members"].push(profileCard);
        }
    });

    return grouped;
};
