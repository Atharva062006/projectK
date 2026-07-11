import handleResponse from "../util/handleResponse.js";
import { getDirectoryService } from "../services/directoryService.js";

// # Get all profiles for the public directory listing
export const getDirectory = async (req, res) => {
    try {
        const groupedProfiles = await getDirectoryService(req.query);
        return handleResponse(res, 200, "Directory profiles retrieved successfully", groupedProfiles);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};
