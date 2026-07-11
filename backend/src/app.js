import cors from "cors";
import express from "express";

import authRouter from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import directoryRouter from "./routes/directoryRoutes.js";
import pitchRouter from "./routes/pitchRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/profiles", profileRouter);
app.use("/api/v1/directory", directoryRouter);
app.use("/api/v1/pitches", pitchRouter);

// Error handling middleware



export default app;
