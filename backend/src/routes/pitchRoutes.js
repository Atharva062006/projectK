import { Router } from "express";
import { authenticateJWT, authorizeRoles } from "../middlewares/authMiddleware.js";
import { 
    createPitch, 
    getPitchDetails, 
    deactivatePitch 
} from "../controllers/pitchController.js";

const pitchRouter = Router();

// Publicly accessible shareable pitch page
pitchRouter.get("/:pitchId", getPitchDetails);

// Admin-only endpoints
pitchRouter.post("/", authenticateJWT, authorizeRoles("admin"), createPitch);
pitchRouter.put("/:pitchId/deactivate", authenticateJWT, authorizeRoles("admin"), deactivatePitch);

export default pitchRouter;
