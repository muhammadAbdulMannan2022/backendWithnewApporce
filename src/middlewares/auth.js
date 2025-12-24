import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  try {
    // Get access token from cookie
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return res.status(401).json({ 
        message: "Access token not found",
        code: "NO_TOKEN"
      });
    }

    // Verify access token
    try {
      const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
      req.userId = payload.userId;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ 
          message: "Access token expired",
          code: "TOKEN_EXPIRED"
        });
      }
      return res.status(401).json({ 
        message: "Invalid access token",
        code: "INVALID_TOKEN"
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
