// # Import jsonwebtoken to verify access tokens
import jwt from "jsonwebtoken";
// # Import standard JSON response helper
import handleResponse from "../util/handleResponse.js";

// # Middleware to verify JWT and authenticate users.
export const authenticateJWT = (req, res, next) => {
    // # 1. Extract Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        // # Return 401 if token is missing or formatted incorrectly
        return handleResponse(res, 401, "Access denied. No token provided.");
    }

    // # 2. Extract raw token string
    const token = authHeader.split(" ")[1];

    try {
        // # 3. Verify signature and validity of the token
        const jwtSecret = process.env.JWT_SECRET || "fallback_secure_secret_key_123";
        const decoded = jwt.verify(token, jwtSecret);

        // # 4. Store user data from token into request object for route access
        req.user = decoded;

        // # 5. Pass control to the next middleware or controller function
        next();
    } catch (error) {
        // # Return 403 Forbidden if token verification fails (expired or tempered)
        return handleResponse(res, 403, "Invalid or expired token.");
    }
};

// # Optional: Role-based authorization middleware
// # Restricts route access to specific roles (e.g. 'admin')
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // # Check if user is authenticated and has permission
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return handleResponse(res, 403, "Access denied. Insufficient permissions.");
        }
        next();
    };
};
