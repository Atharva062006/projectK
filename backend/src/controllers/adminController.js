import handleResponse from "../util/handleResponse.js";
import { listPendingUsersService, approveUserService, disableUserService } from "../services/adminService.js";
import { getPitchesAdminService } from "../services/pitchService.js";

// # Get list of pending users
export const getPendingUsers = async (req, res) => {
    try {
        const pending = await listPendingUsersService();
        return handleResponse(res, 200, "Pending users retrieved successfully", pending);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

// # Approve a user
export const approveUser = async (req, res) => {
    const { profileId } = req.params;
    if (!profileId) {
        return handleResponse(res, 400, "Profile ID is required");
    }

    try {
        const result = await approveUserService(profileId, req.user.user_id);
        return handleResponse(res, 200, result.message);
    } catch (error) {
        const statusCode = error.message === "Profile not found" ? 404 : 500;
        return handleResponse(res, statusCode, error.message);
    }
};

// # Disable a user account
export const disableUser = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return handleResponse(res, 400, "User ID is required");
    }

    try {
        const result = await disableUserService(userId, req.user.user_id);
        return handleResponse(res, 200, result.message, result.user);
    } catch (error) {
        const statusCode = error.message === "User not found" ? 404 : 500;
        return handleResponse(res, statusCode, error.message);
    }
};

// # Get all pitches overview (admin only)
export const getPitchesAdmin = async (req, res) => {
    try {
        const pitches = await getPitchesAdminService();
        return handleResponse(res, 200, "Pitches retrieved successfully", pitches);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

