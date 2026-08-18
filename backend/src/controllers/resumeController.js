import handleResponse from "../util/handleResponse.js";
import cloudinary from "../config/cloudinary.js";
import { 
    uploadResumeService, 
    downloadResumeService, 
    trackOutboundClickService 
} from "../services/resumeService.js";

// # Upload resume controller — uploads to Cloudinary, stores URL in DB
export const uploadResume = async (req, res) => {
    if (!req.file) {
        return handleResponse(res, 400, "No file uploaded or file format is invalid. Only PDF files are allowed.");
    }

    try {
        // Upload the buffer to Cloudinary as a raw file (PDFs are "raw", not images)
        const cloudinaryUrl = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "projectk/resumes",
                    resource_type: "raw",
                    format: "pdf"
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result.secure_url);
                }
            );
            stream.end(req.file.buffer);
        });

        const result = await uploadResumeService(req.user.user_id, cloudinaryUrl);
        return handleResponse(res, 201, "Resume uploaded successfully", result);
    } catch (error) {
        const statusCode = error.message === "Profile not found" ? 404 : 500;
        return handleResponse(res, statusCode, error.message);
    }
};

// # Download resume controller — redirects to Cloudinary URL
export const downloadResume = async (req, res) => {
    const { profileId } = req.params;
    if (!profileId) {
        return handleResponse(res, 400, "Profile ID is required");
    }

    try {
        const fileUrl = await downloadResumeService(profileId, req.user.user_id);

        // Redirect to the Cloudinary URL for download
        return res.redirect(fileUrl);
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
