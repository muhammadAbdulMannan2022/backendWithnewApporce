import { prisma } from "../lib/prisma.js";

/**
 * Error logging middleware
 * Logs errors to the database and sends response to client
 */
const errorMiddleware = async (err, req, res, next) => {
  // 1. Log to console for immediate visibility
  console.error("Critical Error Logged:", {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  // 2. Prepare data for database logging
  const message = err.message || "Unknown error";
  const endpoint = `${req.method} ${req.originalUrl}`;
  
  // Clean payload (don't log passwords or sensitive data if possible)
  const safeBody = { ...req.body };
  if (safeBody.password) safeBody.password = "********";
  
  const payload = JSON.stringify({
    body: safeBody,
    params: req.params,
    query: req.query
  });

  // These fields can be manually attached to Error objects in routes
  // e.g., const err = new Error("msg"); err.functionName = "login"; throw err;
  const function_name = err.functionName || "Not captured";
  const flow_that_does_the_error = err.flow || "Not captured";
  const stack = err.stack || null;

  // 3. Persist error to Prisma
  try {
    await prisma.errors.create({
      data: {
        message,
        endpoint,
        function_name,
        flow_that_does_the_error,
        payload,
        stack
      }
    });
  } catch (dbError) {
    console.error("ERROR LOGGING FAILURE:", dbError);
  }

  // 4. Send response to client
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: status === 500 ? "An internal server error occurred" : message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};

export default errorMiddleware;
