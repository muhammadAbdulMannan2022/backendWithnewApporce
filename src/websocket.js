import { WebSocketServer } from "ws";
import { prisma } from "./lib/prisma.js";

export function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", async (ws) => {
    console.log("🟢 WebSocket connected");

    try {
      // 1. Fetch all users from the database
      // Be careful not to send sensitive data like passwords!
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          isVerified: true,
          createdAt: true,
          // Do NOT include password or refresh tokens here
        },
      });

      // 2. Send the users to the newly connected client
      ws.send(JSON.stringify({ type: "ALL_USERS", data: users }));

    } catch (error) {
      console.error("Error fetching users for WS:", error);
      ws.send(JSON.stringify({ type: "ERROR", message: "Failed to fetch users" }));
    }

    // Handle incoming messages
    ws.on("message", (message) => {
      console.log("📩 Received:", message.toString());
      
      // Example: simple echo
      // ws.send(`Server received: ${message}`);
    });

    ws.on("close", () => {
      console.log("🔴 WebSocket disconnected");
    });
    
    ws.on("error", (err) => {
        console.error("WS Error:", err);
    });
  });

  return wss;
}
