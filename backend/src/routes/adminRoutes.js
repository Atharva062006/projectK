import { Router } from "express";
import { getPendingUsers, approveUser, disableUser, getPitchesAdmin } from "../controllers/adminController.js";
import { getAdminAnalytics } from "../controllers/analyticsController.js";
import { authenticateJWT, authorizeRoles } from "../middlewares/authMiddleware.js";

const adminRouter = Router();

// Apply auth middleware to all admin routes
adminRouter.use(authenticateJWT);
adminRouter.use(authorizeRoles("admin"));

adminRouter.get("/pending-users", getPendingUsers);
adminRouter.post("/approve-user/:profileId", approveUser);
adminRouter.post("/disable-user/:userId", disableUser);
adminRouter.get("/analytics", getAdminAnalytics);
adminRouter.get("/pitches", getPitchesAdmin);

export default adminRouter;
