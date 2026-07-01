
import jwt from "jsonwebtoken"; // Import jsonwebtoken to generate secure access tokens
import { createUser, findUserByEmail } from "../repositories/userRepository.js";

// Register user
export const registerUserService = async ({name, user_name, email, password}) => { // [NEW] Accept name or user_name
    
    if (await findUserByEmail(email)) {
        throw new Error("Email already in use");
    }

    // TODO : Assigning a JWT token

    const username = name || user_name; // [NEW] Fallback mapping to match controller body input or user_name
    const user = await createUser(username, email, password); // [NEW] Pass plain-text password to createUser without hashing
    return user;
}

// Login user service
// Handles finding user, verifying password hash, and generating a session JWT token.
export const loginUserService = async ({email, password}) => {
    // 1. Find user in the database by their email address
    const user = await findUserByEmail(email);
    if (!user) {
        // If no user is found with this email, throw an invalid credentials error
        throw new Error("Invalid credentials");
    }

    // [NEW] Compare the raw input password directly with the plain-text password stored in the password_hash column
    if (password !== user.password_hash) {
        // If password does not match, throw an invalid credentials error
        throw new Error("Invalid credentials");
    }

    // 3. Generate a JWT token containing user details (user_id and email) as payload
    // Uses the secret key defined in environment variables (process.env.JWT_SECRET) with 1 day expiry
    const token = jwt.sign(
        { user_id: user.user_id, email: user.email }, 
        process.env.JWT_SECRET || "fallback_secret_key", 
        { expiresIn: "1d" }
    );

    // 4. Return the retrieved user object and the generated token
    return { user, token };
}