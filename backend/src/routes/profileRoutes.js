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
    deleteProject,
    uploadAvatar
} from "../controllers/profileController.js";
import { uploadResumeMiddleware, uploadAvatarMiddleware } from "../middlewares/uploadMiddleware.js";
import { uploadResume, downloadResume, trackOutboundClick } from "../controllers/resumeController.js";

const profileRouter = Router();

// ── Static / Specific Routes ─────────────────────────────────────────────
// Skills catalog
profileRouter.get("/skills", optionalAuthJWT, getPredefinedSkills);

// Outbound click logging
profileRouter.post("/track-click", optionalAuthJWT, trackOutboundClick);

// ── Protected Routes (Logged-in Member / Admin Only) ──────────────────────────
profileRouter.get("/me", authenticateJWT, getOwnProfile);
profileRouter.put("/me", authenticateJWT, updateOwnProfile);

// Skills mutations
profileRouter.post("/me/skills", authenticateJWT, addSkill);
profileRouter.delete("/me/skills/:skillId", authenticateJWT, removeSkill);

// Projects mutations
profileRouter.post("/me/projects", authenticateJWT, addProject);
profileRouter.put("/me/projects/:projectId", authenticateJWT, updateProject);
profileRouter.delete("/me/projects/:projectId", authenticateJWT, deleteProject);

// Avatar & Resume uploads
profileRouter.post("/me/avatar", authenticateJWT, uploadAvatarMiddleware.single("avatar"), uploadAvatar);
profileRouter.post("/me/resume", authenticateJWT, uploadResumeMiddleware.single("resume"), uploadResume);

// ── Parameterized Routes (Must be registered last to prevent shadowing) ───────
// Resume download (direct browser navigation from showcase / portfolio)
profileRouter.get("/:profileId/resume", optionalAuthJWT, downloadResume);

// Public / Detailed profile view
profileRouter.get("/:profileId", optionalAuthJWT, getProfileDetails);

export default profileRouter;




