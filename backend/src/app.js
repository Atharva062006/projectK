import cors from "cors";
import express from "express";

import authRouter from "./routes/authRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRouter);

// Error handling middleware



export default app;
