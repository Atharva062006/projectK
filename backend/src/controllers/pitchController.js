import handleResponse from "../util/handleResponse.js";
import { 
    createPitchService, 
    getPitchDetailsService, 
    deactivatePitchService 
} from "../services/pitchService.js";

// # Create a pitch (Admin only)
export const createPitch = async (req, res) => {
    try {
        // req.user.user_id is the admin creator ID
        const result = await createPitchService(req.user.user_id, req.body);
        return handleResponse(res, 201, "Pitch created successfully", result);
    } catch (error) {
        const statusCode = error.message.includes("required") || error.message.includes("selected") ? 400 : 500;
        return handleResponse(res, statusCode, error.message);
    }
};

// # View a shareable pitch page (Publicly accessible)
export const getPitchDetails = async (req, res) => {
    const { pitchId } = req.params;
    if (!pitchId) {
        return handleResponse(res, 400, "Pitch ID is required");
    }

    try {
        const result = await getPitchDetailsService(pitchId);
        return handleResponse(res, 200, "Pitch details retrieved successfully", result);
    } catch (error) {
        let statusCode = 500;
        if (error.message === "Pitch not found") {
            statusCode = 404;
        } else if (error.message.includes("deactivated")) {
            statusCode = 410; // Gone (or 403 Forbidden)
        }
        return handleResponse(res, statusCode, error.message);
    }
};

// # Deactivate a pitch page (Admin only)
export const deactivatePitch = async (req, res) => {
    const { pitchId } = req.params;
    if (!pitchId) {
        return handleResponse(res, 400, "Pitch ID is required");
    }

    try {
        const result = await deactivatePitchService(pitchId);
        return handleResponse(res, 200, "Pitch page deactivated successfully", result);
    } catch (error) {
        const statusCode = error.message === "Pitch not found" ? 404 : 500;
        return handleResponse(res, statusCode, error.message);
    }
};
