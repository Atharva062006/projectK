import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController.js"; // Import auth controllers

const authRouter = Router();

// Auth routes registration
authRouter.post("/register", registerUser); // Route for new user registration

// POST /login route
// Binds the loginUser controller to handle user credential validation and session token generation.
authRouter.post("/login", loginUser);

export default authRouter;