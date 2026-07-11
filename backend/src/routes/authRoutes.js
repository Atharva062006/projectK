import { Router } from "express";
import { registerUser, loginUser, requestPasswordReset, resetPassword } from "../controllers/authController.js"; // Import auth controllers

const authRouter = Router();

// Auth routes registration
authRouter.post("/register", registerUser); // Route for new user registration

// POST /login route
// Binds the loginUser controller to handle user credential validation and session token generation.
authRouter.post("/login", loginUser);

// Password reset routes
authRouter.post("/request-reset", requestPasswordReset);
authRouter.post("/reset-password", resetPassword);

export default authRouter;