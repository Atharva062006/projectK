// # Import jsonwebtoken for session token generation
import jwt from "jsonwebtoken";
// # Import bcrypt for secure password hashing and comparison
import bcrypt from "bcrypt";
// # Import crypto for secure reset token generation
import crypto from "crypto";
// # Import user and profile repositories
import { 
    createUser, 
    findUserByEmail, 
    findUserByUsername,
    updateLastLogin,
    setResetToken,
    findUserByResetToken,
    updatePassword
} from "../repositories/userRepository.js";
import { createProfile, findProfileByUserId } from "../repositories/profileRepository.js";
import { createApprovalRequest } from "../repositories/approvalRepository.js";

// # Register user service
export const registerUserService = async ({ name, user_name, email, password, role = "member" }) => {
    const username = name || user_name;

    // # 1. Check if email or username already exists in the database
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new Error("Email already in use");
    }

    const existingUsername = await findUserByUsername(username);
    if (existingUsername) {
        throw new Error("Username already in use");
    }
    
    // # 2. Hash the user's plain-text password using bcrypt (salt rounds = 10)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // # 3. Guest, recruiter and admin roles are active immediately; members and alumni require admin approval.
    const isApproved = role === "guest" || role === "recruiter" || role === "admin";

    // # 4. Save the new user record with the hashed password into the database
    const user = await createUser(username, email, passwordHash, role, isApproved);

    // # 5. Automatically initialize an empty profile record linked to this user for members and alumni
    if (role === "member" || role === "alumni") {
        const profile = await createProfile({ 
            user_id: user.user_id,
            full_name: username,
            role_category: role === "alumni" ? "Alumni" : "Other Members"
        });
        // Create matching approval request
        await createApprovalRequest(profile.profile_id);
    }

    return user;
};

// # Login user service
export const loginUserService = async ({ email, password }) => {
    // # 1. Fetch user by email
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error("Invalid credentials");
    }

    // # 2. Compare the hashed password from database with input password using bcrypt
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
        throw new Error("Invalid credentials");
    }

    // # 3. Ensure the account is approved by admin
    if (!user.is_approved) {
        throw new Error("Account pending admin approval");
    }

    // # 4. Update last_login timestamp in database for audit/security tracking
    await updateLastLogin(user.user_id);

    // # 5. Generate JWT payload including user_id, email, and user role for RBAC
    const payload = {
        user_id: user.user_id,
        email: user.email,
        role: user.role
    };

    // # 6. Sign the token using secret key and set 1 day expiry duration
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.warn("WARNING: JWT_SECRET environment variable is missing. Using insecure fallback.");
    }
    
    const token = jwt.sign(
        payload,
        jwtSecret || "fallback_secure_secret_key_123",
        { expiresIn: "1d" }
    );

    // # 7. Attach profile_id to the response so the frontend can navigate directly to the showcase page
    let profile_id = null;
    if (user.role === "member" || user.role === "alumni") {
        const profile = await findProfileByUserId(user.user_id);
        if (profile) profile_id = profile.profile_id;
    }

    return { user, token, profile_id };
};

// # Request password reset service
export const requestPasswordResetService = async (email) => {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error("User not found");
    }

    // Generate secure token and expiry time (15 mins from now)
    const token = crypto.randomUUID();
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await setResetToken(email, token, expiry);

    // Log the reset link in the console (mocking mail sending)
    console.log(`\n========================================\n[MAIL MOCK] Password Reset Requested for ${email}\nReset Token: ${token}\nReset Link: http://localhost:5000/api/v1/auth/reset-password?token=${token}\n========================================\n`);

    return { message: "Password reset link generated. Check console logs for link.", token };
};

// # Reset password using token service
export const resetPasswordService = async (token, newPassword) => {
    const user = await findUserByResetToken(token);
    if (!user) {
        throw new Error("Invalid or expired password reset token");
    }

    // Hash the new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    await updatePassword(user.user_id, passwordHash);

    return { message: "Password reset successful" };
};