import handleResponse from "../util/handleResponse.js";
import cloudinary from "../config/cloudinary.js";
import { 
    uploadResumeService, 
    downloadResumeService, 
    trackOutboundClickService 
} from "../services/resumeService.js";

const SAMPLE_FALLBACK_PDF = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
const isUUID = (str) => typeof str === "string" && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);

// # Upload resume controller — uploads to Cloudinary as .pdf raw file, stores URL in DB
export const uploadResume = async (req, res) => {
    if (!req.file) {
        return handleResponse(res, 400, "No file uploaded or file format is invalid. Only PDF files are allowed.");
    }

    try {
        const publicId = `projectk/resumes/resume_${Date.now()}.pdf`;

        const cloudinaryUrl = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    public_id: publicId,
                    resource_type: "raw"
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

// # Download / View resume controller — serves Cloudinary PDF with valid Content-Type and uncompressed byte stream
export const downloadResume = async (req, res) => {
    const { profileId } = req.params;
    if (!profileId || !isUUID(profileId)) {
        return res.redirect(SAMPLE_FALLBACK_PDF);
    }

    try {
        const userId = req.user ? req.user.user_id : null;
        let fileUrl = await downloadResumeService(profileId, userId);

        if (!fileUrl) {
            return res.redirect(SAMPLE_FALLBACK_PDF);
        }

        const isDownloadMode = req.query.download === "true" || req.query.disposition === "attachment";

        try {
            // Force identity encoding so Cloudinary returns raw uncompressed bytes (%PDF-...)
            const response = await fetch(fileUrl, {
                headers: {
                    "Accept-Encoding": "identity",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
                }
            });

            if (response.ok) {
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                res.setHeader("Content-Type", "application/pdf");
                res.setHeader("Content-Length", buffer.length);

                if (isDownloadMode) {
                    res.setHeader("Content-Disposition", 'attachment; filename="candidate_resume.pdf"');
                } else {
                    res.setHeader("Content-Disposition", 'inline; filename="candidate_resume.pdf"');
                }
                return res.send(buffer);
            }
        } catch (streamErr) {
            console.error("Download stream error", streamErr);
        }

        // Direct fallback redirect
        return res.redirect(fileUrl);
    } catch (error) {
        return res.redirect(SAMPLE_FALLBACK_PDF);
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
