import handleResponse from "../util/handleResponse.js";
import { 
    registerUserService, 
    loginUserService,
    requestPasswordResetService,
    resetPasswordService
} from "../services/authService.js"; // Import service functions
import { googleAuthService } from "../services/googleAuthService.js";

// Register user
export const registerUser = async (req, res) => {
    if(!req.body.name || !req.body.email || !req.body.password) {
        return handleResponse(res, 400, "Name, email and password are required");
    }

    try {
        const user = await registerUserService(req.body);

        delete user.password_hash; 
        
        handleResponse(res, 201, "User registered successfully", user);
    } catch (error) {
        const statusCode = error.message === "Email already in use" ? 409 : 500;
        return handleResponse(res, statusCode, error.message);
    }
    
};

// Login user controller
// Extracts credentials, triggers validation and auth service, and returns credentials-free response.
export const loginUser = async (req, res) => {
    // 1. Destructure email and password from the HTTP request body
    const { email, password } = req.body;

    // 2. Validate that both email and password are provided in the request
    if (!email || !password) {
        // Return 400 Bad Request if email or password is missing
        return handleResponse(res, 400, "Email and password are required");
    }

    try {
        // 3. Invoke the login service to verify credentials and generate a JWT token
        const { user, token } = await loginUserService({ email, password });

        // 4. Remove the sensitive password_hash from the user object before sending it to the client
        delete user.password_hash;

        // 5. Send a success 200 response back with user details and the token
        handleResponse(res, 200, "Login successful", { user, token });
    } catch (error) {
        // 6. Handle errors: return 401 Unauthorized for incorrect credentials, 403 for pending approval, 500 for server errors
        let statusCode = 500;
        if (error.message === "Invalid credentials") {
            statusCode = 401;
        } else if (error.message === "Account pending admin approval") {
            statusCode = 403;
        }
        return handleResponse(res, statusCode, error.message);
    }
};

// Request password reset controller
export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return handleResponse(res, 400, "Email is required");
    }

    try {
        const result = await requestPasswordResetService(email);
        return handleResponse(res, 200, result.message, { token: result.token });
    } catch (error) {
        const statusCode = error.message === "User not found" ? 404 : 500;
        return handleResponse(res, statusCode, error.message);
    }
};

// Execute password reset controller
export const resetPassword = async (req, res) => {
    const token = req.query.token || req.body.token;
    const { newPassword } = req.body;

    if (!token || !newPassword) {
        return handleResponse(res, 400, "Token and newPassword are required");
    }

    try {
        const result = await resetPasswordService(token, newPassword);
        return handleResponse(res, 200, result.message);
    } catch (error) {
        const statusCode = error.message.includes("token") ? 400 : 500;
        return handleResponse(res, statusCode, error.message);
    }
};

// Google Login Controller
export const googleLogin = async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) {
        return handleResponse(res, 400, "Google ID token is required");
    }

    try {
        const { user, token } = await googleAuthService(idToken);
        delete user.password_hash;
        return handleResponse(res, 200, "Google login successful", { user, token });
    } catch (error) {
        let statusCode = 500;
        if (error.message.includes("Google token") || error.message.includes("required")) {
            statusCode = 400;
        } else if (error.message.includes("pending admin approval")) {
            statusCode = 403;
        }
        return handleResponse(res, statusCode, error.message);
    }
};