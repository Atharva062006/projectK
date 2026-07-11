import { getAdminAnalyticsStats } from "../repositories/analyticsRepository.js";

// # Service to get analytics dashboard stats
export const getAdminAnalyticsService = async () => {
    return await getAdminAnalyticsStats();
};
