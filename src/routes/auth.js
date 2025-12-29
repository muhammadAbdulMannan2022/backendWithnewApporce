import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { generateOTP, sendOTPEmail, sendWelcomeEmail } from "../lib/email.js";

const router = express.Router();

// Token generation helpers
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15m", // Short-lived access token
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d", // Long-lived refresh token
  });
};

// Cookie options
const accessTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 15 * 60 * 1000,
};

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Step 1: Register - Send OTP
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password strength
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    // Check if user already exists and is verified
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create or update user with OTP
    if (existingUser) {
      // Update existing unverified user
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          otp,
          otpExpiry,
        },
      });
    } else {
      // Create new user
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          otp,
          otpExpiry,
          isVerified: false,
        },
      });
    }

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      return res.status(500).json({
        message: "Failed to send verification email. Please try again.",
      });
    }

    res.status(200).json({
      message:
        "OTP sent to your email. Please verify to complete registration.",
      email,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Step 2: Verify OTP and complete registration
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP is expired
    if (!user.otpExpiry || new Date() > user.otpExpiry) {
      return res.status(400).json({
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Mark user as verified and clear OTP
    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        otp: null,
        otpExpiry: null,
      },
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, email.split("@")[0]).catch((err) =>
      console.error("Failed to send welcome email:", err)
    );

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token in database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Set cookies
    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    res.status(201).json({
      message: "Registration successful! Welcome aboard!",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Resend OTP
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new OTP
    await prisma.user.update({
      where: { email },
      data: {
        otp,
        otpExpiry,
      },
    });

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      return res.status(500).json({
        message: "Failed to send verification email. Please try again.",
      });
    }

    res.status(200).json({
      message: "New OTP sent to your email",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
        code: "EMAIL_NOT_VERIFIED",
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token in database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Set cookies
    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Refresh token endpoint
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    // Verify refresh token
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Check if refresh token exists in database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    // Update refresh token in database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    // Set new cookies
    res.cookie("accessToken", newAccessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions);

    res.json({ message: "Tokens refreshed successfully" });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Logout endpoint
router.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      // Verify and get user ID from refresh token
      try {
        const payload = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET
        );

        // Remove refresh token from database
        await prisma.user.update({
          where: { id: payload.userId },
          data: { refreshToken: null },
        });
      } catch (error) {
        // Token invalid, but we still clear cookies
        console.error("Logout token verification error:", error);
      }
    }

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// reset password
// reset password
router.post("/reset-password", async (req, res) => {
  try {
    // Safeguard: ensure req.body exists and is an object
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const { email } = req.body;

    // Now safely check for email
    if (!email || typeof email !== "string" || email.trim() === "") {
      return res.status(400).json({ message: "Email is required" });
    }

    const trimmedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (!user) {
      // Security best practice: don't reveal if email exists or not
      // Always return same success message to prevent user enumeration
      return res
        .status(200)
        .json({ message: "OTP sent to your email if account exists" });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { email: trimmedEmail },
      data: {
        otp,
        otpExpiry,
      },
    });

    try {
      await sendOTPEmail(trimmedEmail, otp);
      res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
      console.error("Failed to send OTP email:", error);
      // Don't reveal email failure — still say "sent" for security
      res.status(200).json({ message: "OTP sent to your email" });
      // Or if you prefer honesty in dev only:
      // res.status(500).json({ message: "Failed to send email. Please try again." });
    }
  } catch (error) {
    console.error("Reset password error:", error);
    // Never expose raw error in production
    res.status(500).json({ message: "Internal server error" });
  }
});
// set new password
router.post("/set-new-password", async (req, res) => {
  try {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const { email, newPassword, accessToken } = req.body;

    if (!accessToken) {
      return res.status(401).json({ message: "Access token is required" });
    }

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    let payload;
    try {
      payload = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Invalid or expired reset token" });
    }

    // Optional: verify email matches token
    if (payload.email !== email.trim().toLowerCase()) {
      return res.status(401).json({ message: "Token does not match email" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: payload.userId },
      data: {
        password: hashedPassword,
        // otp: null, otpExpiry: null  // remove if no longer using OTP
      },
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Set new password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get current user endpoint (protected route example)
router.get("/profile", async (req, res) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Verify access token
    let payload;
    try {
      payload = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Invalid or expired access token" });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
