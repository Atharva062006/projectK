import { Router } from "express";
import { authenticateJWT, optionalAuthJWT } from "../middlewares/authMiddleware.js";
import {
    getOwnProfile,
    updateOwnProfile,
    getProfileDetails,
    getPredefinedSkills,
    addSkill,
    removeSkill,
    addProject,
    updateProject,
    deleteProject
} from "../controllers/profileController.js";
import { uploadResumeMiddleware } from "../middlewares/uploadMiddleware.js";
import { uploadResume, downloadResume, trackOutboundClick } from "../controllers/resumeController.js";

const profileRouter = Router();

// ── Public / Optional Auth Routes ─────────────────────────────────────────────
// Resume download (direct browser navigation from showcase / portfolio)
profileRouter.get("/:profileId/resume", optionalAuthJWT, downloadResume);

// Outbound click logging
profileRouter.post("/track-click", optionalAuthJWT, trackOutboundClick);

// Skills catalog
profileRouter.get("/skills", optionalAuthJWT, getPredefinedSkills);

// Public / Detailed profile view
profileRouter.get("/:profileId", optionalAuthJWT, getProfileDetails);

// ── Protected Routes (Logged-in Member / Admin Only) ──────────────────────────
profileRouter.use(authenticateJWT);

profileRouter.get("/me", getOwnProfile);
profileRouter.put("/me", updateOwnProfile);

// Skills mutations
profileRouter.post("/me/skills", addSkill);
profileRouter.delete("/me/skills/:skillId", removeSkill);

// Projects mutations
profileRouter.post("/me/projects", addProject);
profileRouter.put("/me/projects/:projectId", updateProject);
profileRouter.delete("/me/projects/:projectId", deleteProject);

// Resume upload
profileRouter.post("/me/resume", uploadResumeMiddleware.single("resume"), uploadResume);

export default profileRouter;
