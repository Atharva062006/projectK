import handleResponse from "../util/handleResponse.js";
import { getAdminAnalyticsService } from "../services/analyticsService.js";

// # Get analytics dashboard stats controller (Admin only)
export const getAdminAnalytics = async (req, res) => {
    try {
        const stats = await getAdminAnalyticsService();
        return handleResponse(res, 200, "Analytics retrieved successfully", stats);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};
