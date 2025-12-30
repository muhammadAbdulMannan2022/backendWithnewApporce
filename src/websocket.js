import { WebSocketServer } from "ws";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { handleUsersRoute } from "./routes/usersws.js";
import { handleRoomRoute } from "./routes/messagews.js";

export function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    // parse cookies
    const cookies = cookie.parse(req.headers.cookie || "");
    let accessToken = cookies["accessToken"];

    // Fallback 1: check query string for token
    if (!accessToken) {
      const url = new URL(req.url, `http://${req.headers.host}`);
      accessToken = url.searchParams.get("token");
    }

    // Fallback 2: check Authorization header (Bearer <token>)
    if (!accessToken && req.headers['authorization']) {
      const parts = req.headers['authorization'].split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        accessToken = parts[1];
      }
    }

    console.log("WS Connection Attempt:", {
      url: req.url,
      headers: req.headers,
      foundToken: !!accessToken
    }); 

    if (!accessToken) {
      ws.close(4001, "Missing token");
      return;
    }

    // verify JWT
    let payload;
    try {
      payload = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (err) {
      ws.close(4002, "Invalid token");
      return;
    }

    const user = { id: payload.userId };
    ws.userId = user.id;

    // route logic
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    if (pathname === "/users") {
      handleUsersRoute(ws, wss, user);
    } else if (pathname.startsWith("/room")) {
      handleRoomRoute(ws, wss, pathname, user);
    } else {
      ws.close(4000, "Unknown route");
    }
  });

  return wss;
}
