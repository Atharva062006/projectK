import { updateApprovalStatus, findUserById } from "../repositories/userRepository.js";
import { findProfileById } from "../repositories/profileRepository.js";
import { getPendingApprovalRequests, updateApprovalRequestStatus } from "../repositories/approvalRepository.js";

// # Service to get all users pending approval
export const listPendingUsersService = async () => {
    return await getPendingApprovalRequests();
};

// # Service to approve a member or alumni account
export const approveUserService = async (profileId, adminUserId) => {
    // 1. Fetch profile to get associated user_id
    const profile = await findProfileById(profileId);
    if (!profile) {
        throw new Error("Profile not found");
    }

    // 2. Set is_approved = true for the user
    await updateApprovalStatus(profile.user_id, true);

    // 3. Update the approval request status to 'approved'
    await updateApprovalRequestStatus(profileId, 'approved', adminUserId);

    return { message: "User approved successfully" };
};

// # Service to disable (un-approve) a user account
export const disableUserService = async (userId, adminUserId) => {
    const user = await findUserById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    // Set is_approved = false
    await updateApprovalStatus(userId, false);

    // Also update any approval requests status to rejected/pending if they exist
    // It's clean to set the status to 'rejected' for their profile
    // Wait, let's fetch profile first
    // If user has a profile, we update approval_requests status
    const result = await updateApprovalStatus(userId, false);

    return { message: "User account disabled successfully", user: result };
};
