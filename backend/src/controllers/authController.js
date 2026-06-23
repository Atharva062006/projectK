import handleResponse from "../util/handleResponse.js";
import { registerUserService } from "../services/authService.js";

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

// Login user
export const loginUser = async (req, res) => {
    // TODO
}