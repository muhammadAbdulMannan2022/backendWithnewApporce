import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import { RedisStore } from "rate-limit-redis";
import Redis from "ioredis";
import messageRoutes from "./routes/message.js";

const app = express();
const redisClient = new Redis({
  host: "127.0.0.1",
  port: 6379,
});
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
redisClient.on("error", (err) => console.error("Redis error:", err));
// ✅ Rate limiting for /auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { message: "Too many login attempts, try again later" },
  standardHeaders: true,
  legacyHeaders: false,

  store: new RedisStore({
    sendCommand: (command, ...args) => redisClient.call(command, ...args),
  }),
});

app.use("/auth", authLimiter, authRoutes);
app.use("/msg",messageRoutes)

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
