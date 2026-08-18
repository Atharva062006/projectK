import cors from "cors";
import express from "express";

import authRouter from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import directoryRouter from "./routes/directoryRoutes.js";
import pitchRouter from "./routes/pitchRoutes.js";

const app = express();

// Middleware
const allowedOrigins = [
    "http://localhost:3000",
    process.env.FRONTEND_URL   // Set this to your Vercel URL in production
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());

// Health check endpoint for Render
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/profiles", profileRouter);
app.use("/api/v1/directory", directoryRouter);
app.use("/api/v1/pitches", pitchRouter);

// Error handling middleware



export default app;
