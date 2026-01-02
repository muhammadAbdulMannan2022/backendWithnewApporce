import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import { RedisStore } from "rate-limit-redis";
import Redis from "ioredis";
import messageRoutes from "./routes/message.js";
import { admin, adminRouter } from "./admin-setup.js";

const app = express();
const redisClient = new Redis({
  host: "127.0.0.1",
  port: 6379,
});
// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://10.10.13.30:3000",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser tools like Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Body parser & cookies
app.use(express.json());
app.use(cookieParser());
redisClient.on("error", (err) => console.error("Redis error:", err));

// AdminJS
app.use(admin.options.rootPath, adminRouter);

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
app.use("/msg", messageRoutes);

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
