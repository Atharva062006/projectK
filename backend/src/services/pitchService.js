import { 
    createPitch, 
    addProfileToPitch, 
    findPitchById, 
    findPitchMembersDetails, 
    deactivatePitch 
} from "../repositories/pitchRepository.js";

// # Creates a curated talent pitch page
export const createPitchService = async (adminUserId, { title, description, profileIds }) => {
    if (!title) {
        throw new Error("Pitch title is required");
    }
    if (!Array.isArray(profileIds) || profileIds.length === 0) {
        throw new Error("At least one profile ID must be selected");
    }

    // 1. Create pitch metadata
    const pitch = await createPitch(title, description, adminUserId);

    // 2. Link all selected profile IDs
    const addPromises = profileIds.map(profileId => addProfileToPitch(pitch.pitch_id, profileId));
    await Promise.all(addPromises);

    return pitch;
};

// # Retrieves details and selected members of a shareable pitch page
export const getPitchDetailsService = async (pitchId) => {
    const pitch = await findPitchById(pitchId);
    if (!pitch) {
        throw new Error("Pitch not found");
    }
    if (!pitch.is_active) {
        throw new Error("This pitch page has been deactivated");
    }

    const members = await findPitchMembersDetails(pitchId);

    return {
        ...pitch,
        members
    };
};

// # Deactivates a pitch page
export const deactivatePitchService = async (pitchId) => {
    const pitch = await findPitchById(pitchId);
    if (!pitch) {
        throw new Error("Pitch not found");
    }

    return await deactivatePitch(pitchId);
};
