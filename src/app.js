import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Body parser & cookies
app.use(express.json());
app.use(cookieParser());

// ✅ Rate limiting for /auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // max 50 requests per window per IP
  message: {
    error: "Too many login attempts. Please try again later.",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable the old X-RateLimit headers
});

app.use("/auth", authLimiter, authRoutes);

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
