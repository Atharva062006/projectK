import jwt from "jsonwebtoken";
import handleResponse from "../util/handleResponse.js";

export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return handleResponse(res, 401, "Access denied. No token provided.");
    }

    const token = authHeader.split(" ")[1];

    try {
        const jwtSecret = process.env.JWT_SECRET || "fallback_secure_secret_key_123";
        const decoded = jwt.verify(token, jwtSecret);

        req.user = decoded;

        next();
    } catch (error) {
        return handleResponse(res, 403, "Invalid or expired token.");
    }
};


export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return handleResponse(res, 403, "Access denied. Insufficient permissions.");
        }
        next();
    };
};
