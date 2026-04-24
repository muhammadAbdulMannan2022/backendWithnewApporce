import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import { RedisStore } from "rate-limit-redis";
import Redis from "ioredis";
import messageRoutes from "./routes/message.js";
import { admin, adminRouter } from "./admin-setup.js";
import compression from "compression";
import errorMiddleware from "./middlewares/error.js";

const app = express();
const redisClient = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

// 1. Mount AdminJS BEFORE CORS
// This ensures AdminJS requests aren't subjected to the API CORS policy
app.use(admin.options.rootPath, adminRouter);

// 2. CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://10.10.13.30:3000",
  "http://localhost:4000", // Allow self-origin just in case
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser tools like Postman or same-origin direct navigation
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
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
app.use(compression());

app.use("/auth", authLimiter, authRoutes);
app.use("/msg", messageRoutes);

// TEMPORARY: Debug route to test error logging
app.get("/debug/error", (req, res) => {
  const err = new Error("This is a deliberate test error!");
  err.status = 500;
  err.functionName = "testErrorTrigger";
  err.flow = "Debug/Testing";
  throw err; 
});

app.get("/", (req, res) => {
  // for test
  const longData = "a".repeat(20 * 1024 * 1024);
  res.json({ status: "ok", longData });
});

// Handle 404 - Not Found
app.use((req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.status = 404;
  err.functionName = "unknownRoute";
  err.flow = "Routing";
  next(err);
});

// Error handling middleware should be last
app.use(errorMiddleware);

export default app;
