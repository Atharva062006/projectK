import pool from "../config/db.js";

// # Logs an outbound link click event (e.g., GitHub, Portfolio, LeetCode)
export const logOutboundClick = async (profileId, userId, linkType, clickedUrl) => {
    await pool.query(
        "INSERT INTO outbound_clicks (profile_id, user_id, link_type, clicked_url) VALUES ($1, $2, $3, $4)",
        [profileId, userId, linkType, clickedUrl]
    );
};

// # Retrieves overall statistics for Admin Dashboard
export const getAdminAnalyticsStats = async () => {
    // 1. Total users by role
    const usersCountRes = await pool.query(
        "SELECT role, count(*)::int as count FROM users GROUP BY role"
    );
    const usersCount = usersCountRes.rows.reduce((acc, row) => {
        acc[row.role] = row.count;
        return acc;
    }, { member: 0, alumni: 0, recruiter: 0, guest: 0, admin: 0 });

    // Total approved and pending accounts
    const approvedRes = await pool.query(
        "SELECT is_approved, count(*)::int as count FROM users GROUP BY is_approved"
    );
    const approvalStatus = approvedRes.rows.reduce((acc, row) => {
        acc[row.is_approved ? 'approved' : 'pending'] = row.count;
        return acc;
    }, { approved: 0, pending: 0 });

    // 2. Profile views stats (total views)
    const totalViewsRes = await pool.query("SELECT count(*)::int as count FROM profile_views");
    const totalViews = totalViewsRes.rows[0].count;

    // 3. Resume downloads stats (total downloads)
    const totalDownloadsRes = await pool.query("SELECT count(*)::int as count FROM resume_downloads");
    const totalDownloads = totalDownloadsRes.rows[0].count;

    // 4. Skill trends: Most popular skills added by members
    const skillTrendsRes = await pool.query(
        `SELECT s.name, s.category, count(*)::int as occurrences 
         FROM member_skills ms
         JOIN skills s ON ms.skill_id = s.skill_id
         GROUP BY s.name, s.category
         ORDER BY occurrences DESC
         LIMIT 10`
    );
    const skillTrends = skillTrendsRes.rows;

    // 5. Top viewed profiles
    const topViewedProfilesRes = await pool.query(
        `SELECT p.profile_id, p.full_name, p.tagline, p.role_category, count(*)::int as views_count
         FROM profile_views pv
         JOIN profiles p ON pv.viewed_profile_id = p.profile_id
         GROUP BY p.profile_id, p.full_name, p.tagline, p.role_category
         ORDER BY views_count DESC
         LIMIT 10`
    );
    const topViewedProfiles = topViewedProfilesRes.rows;

    // 6. Resume downloads by profile (download count for each member profile)
    const resumeDownloadStatsRes = await pool.query(
        `SELECT p.profile_id, p.full_name, count(*)::int as download_count
         FROM resume_downloads rd
         JOIN profiles p ON rd.profile_id = p.profile_id
         GROUP BY p.profile_id, p.full_name
         ORDER BY download_count DESC
         LIMIT 10`
    );
    const resumeDownloadStats = resumeDownloadStatsRes.rows;

    return {
        usersCount,
        approvalStatus,
        totalViews,
        totalDownloads,
        skillTrends,
        topViewedProfiles,
        resumeDownloadStats
    };
};
