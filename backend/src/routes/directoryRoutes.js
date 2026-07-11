import { Router } from "express";
import { getDirectory } from "../controllers/directoryController.js";

const directoryRouter = Router();

// Public endpoint - no authenticateJWT middleware here
directoryRouter.get("/", getDirectory);

export default directoryRouter;
