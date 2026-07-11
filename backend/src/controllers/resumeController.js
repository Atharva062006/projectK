import path from "path";
import handleResponse from "../util/handleResponse.js";
import { 
    uploadResumeService, 
    downloadResumeService, 
    trackOutboundClickService 
} from "../services/resumeService.js";

// # Upload resume controller
export const uploadResume = async (req, res) => {
    if (!req.file) {
        return handleResponse(res, 400, "No file uploaded or file format is invalid. Only PDF files are allowed.");
    }

    try {
        const result = await uploadResumeService(req.user.user_id, req.file.path);
        return handleResponse(res, 201, "Resume uploaded successfully", result);
    } catch (error) {
        const statusCode = error.message === "Profile not found" ? 404 : 500;
        return handleResponse(res, statusCode, error.message);
    }
};

// # Download resume controller (logged-in users only)
export const downloadResume = async (req, res) => {
    const { profileId } = req.params;
    if (!profileId) {
        return handleResponse(res, 400, "Profile ID is required");
    }

    try {
        const filePath = await downloadResumeService(profileId, req.user.user_id);
        const resolvedPath = path.resolve(filePath);
        
        // Trigger download of the PDF file
        return res.download(resolvedPath);
    } catch (error) {
        const statusCode = (error.message === "Profile not found" || error.message === "No resume found for this profile") ? 404 : 500;
        return handleResponse(res, statusCode, error.message);
    }
};

// # Track outbound clicks controller
export const trackOutboundClick = async (req, res) => {
    const { profileId, linkType, clickedUrl } = req.body;
    if (!profileId || !linkType || !clickedUrl) {
        return handleResponse(res, 400, "profileId, linkType, and clickedUrl are required");
    }

    try {
        // req.user might be optional/nullable here, depending on if we protect it. 
        // Let's allow public tracking but capture user if authenticated
        const userId = req.user ? req.user.user_id : null;
        const result = await trackOutboundClickService(profileId, userId, linkType, clickedUrl);
        return handleResponse(res, 200, "Outbound click logged successfully", result);
    } catch (error) {
        const statusCode = error.message === "Profile not found" ? 404 : 500;
        return handleResponse(res, statusCode, error.message);
    }
};
