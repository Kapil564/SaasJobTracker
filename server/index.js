import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRoutes from "./src/routes/auth.js";
import applicationRoutes from "./src/routes/applications.js";
import aiRoutes from "./src/routes/ai.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOrigin = process.env.NODE_ENV === 'development' 
  ? /localhost/
  : process.env.CLIENT_URL;

app.use(cors({
  origin: corsOrigin,
  credentials: true,
}));

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests. Please try again later." },
});
const isDev = process.env.NODE_ENV !== "production";
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 100 : 20,
  message: { error: "Too many auth attempts. Please try again later." },
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/applications", generalLimiter, applicationRoutes);
app.use("/api/ai", generalLimiter, aiRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: process.env.NODE_ENV === "production"
      ? "Internal server error."
      : err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

export default app;
