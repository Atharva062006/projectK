import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
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

// Apply auth middleware to all profile routes
profileRouter.use(authenticateJWT);

profileRouter.get("/me", getOwnProfile);
profileRouter.put("/me", updateOwnProfile);

// Skills
profileRouter.get("/skills", getPredefinedSkills);
profileRouter.post("/me/skills", addSkill);
profileRouter.delete("/me/skills/:skillId", removeSkill);

// Projects
profileRouter.post("/me/projects", addProject);
profileRouter.put("/me/projects/:projectId", updateProject);
profileRouter.delete("/me/projects/:projectId", deleteProject);

// Resumes
profileRouter.post("/me/resume", uploadResumeMiddleware.single("resume"), uploadResume);
profileRouter.get("/:profileId/resume", downloadResume);

// Outbound click logging
profileRouter.post("/track-click", trackOutboundClick);

// Detailed profile view (logged-in only)
profileRouter.get("/:profileId", getProfileDetails);

export default profileRouter;
