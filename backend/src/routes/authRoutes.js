import { Router } from "express";
import { registerUser } from "../controllers/authController.js";

const authRouter = Router();

// All the routes
authRouter.post("/register", registerUser);

export default authRouter;