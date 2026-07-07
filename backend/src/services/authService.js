// # Import jsonwebtoken for session token generation
import jwt from "jsonwebtoken";
// # Import bcrypt for secure password hashing and comparison
import bcrypt from "bcrypt";
// # Import user and profile repositories
import { createUser, findUserByEmail, updateLastLogin } from "../repositories/userRepository.js";
import { createProfile } from "../repositories/profileRepository.js";

// # Register user service
export const registerUserService = async ({ name, user_name, email, password, role = "member" }) => {
    // # 1. Check if user already exists in the database
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new Error("Email already in use");
    }

    // # 2. Hash the user's plain-text password using bcrypt (salt rounds = 10)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const username = name || user_name;
    
    // # 3. Save the new user record with the hashed password into the database
    const user = await createUser(username, email, passwordHash, role);

    // # 4. Automatically initialize an empty profile record linked to this user
    await createProfile({ 
        user_id: user.user_id,
        full_name: username
    });

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

    // # 3. Update last_login timestamp in database for audit/security tracking
    await updateLastLogin(user.user_id);

    // # 4. Generate JWT payload including user_id, email, and user role for RBAC
    const payload = {
        user_id: user.user_id,
        email: user.email,
        role: user.role
    };

    // # 5. Sign the token using secret key and set 1 day expiry duration
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.warn("WARNING: JWT_SECRET environment variable is missing. Using insecure fallback.");
    }
    
    const token = jwt.sign(
        payload,
        jwtSecret || "fallback_secure_secret_key_123",
        { expiresIn: "1d" }
    );

    return { user, token };
};