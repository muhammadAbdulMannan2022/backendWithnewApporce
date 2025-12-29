import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import RedisStore from "rate-limit-redis";
import Redis from "ioredis";

const app = express();
const redisClient = new Redis();
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
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many login attempts, try again later",
});

app.use("/auth", authLimiter, authRoutes);

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
