import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { 
    findUserByGoogleId, 
    findUserByEmail, 
    findUserByUsername,
    createGoogleUser, 
    linkGoogleId,
    updateLastLogin 
} from "../repositories/userRepository.js";
import { createProfile } from "../repositories/profileRepository.js";
import { createApprovalRequest } from "../repositories/approvalRepository.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuthService = async (idToken) => {
    if (!idToken) {
        throw new Error("Google ID token is required");
    }

    let payload;
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        payload = ticket.getPayload();
    } catch (err) {
        console.error("Google ID Token Verification Error:", err.message);
        throw new Error("Invalid or expired Google token");
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
        throw new Error("Email not provided by Google authentication");
    }

    // 1. Check if user exists by Google ID
    let user = await findUserByGoogleId(googleId);

    // 2. If not found by googleId, check if account exists with matching email
    if (!user) {
        user = await findUserByEmail(email);
        if (user) {
            // Link Google ID to existing account
            user = await linkGoogleId(user.user_id, googleId);
        } else {
            // 3. Register new Google user (default role: member, auto-approved)
            const baseUsername = (name || email.split("@")[0]).trim();
            let username = baseUsername;

            // Handle potential username collision by appending random digits if username exists
            let existingUsername = await findUserByUsername(username);
            while (existingUsername) {
                const randomSuffix = Math.floor(1000 + Math.random() * 9000);
                username = `${baseUsername}_${randomSuffix}`;
                existingUsername = await findUserByUsername(username);
            }

            user = await createGoogleUser(username, email, googleId, "member", true);

            // Automatically initialize user profile
            const profile = await createProfile({
                user_id: user.user_id,
                full_name: name || username,
                profile_image: picture || null,
                role_category: "Other Members"
            });

            await createApprovalRequest(profile.profile_id);
        }
    }

    // Ensure account is approved
    if (!user.is_approved) {
        throw new Error("Account pending admin approval");
    }

    // Update last login
    await updateLastLogin(user.user_id);

    // Issue JWT Token
    const jwtPayload = {
        user_id: user.user_id,
        email: user.email,
        role: user.role
    };

    const jwtSecret = process.env.JWT_SECRET || "fallback_secure_secret_key_123";
    const token = jwt.sign(jwtPayload, jwtSecret, { expiresIn: "1d" });

    return { user, token };
};
