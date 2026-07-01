import handleResponse from "../util/handleResponse.js";
import { registerUserService, loginUserService } from "../services/authService.js"; // Import service functions for register and login

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
        // 6. Handle errors: return 401 Unauthorized for incorrect credentials, 500 for server errors
        const statusCode = error.message === "Invalid credentials" ? 401 : 500;
        return handleResponse(res, statusCode, error.message);
    }
}