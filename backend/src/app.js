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
    process.env.FRONTEND_URL
].filter(Boolean).map(url => url.replace(/\/+$/, "")); // strip trailing slashes

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (curl, health checks, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin.replace(/\/+$/, ""))) {
            return callback(null, true);
        }
        console.log(`CORS blocked origin: ${origin}. Allowed: ${allowedOrigins}`);
        return callback(new Error("Not allowed by CORS"));
    },
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
