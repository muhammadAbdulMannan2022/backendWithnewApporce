import "dotenv/config";
import http from "http";
import { WebSocketServer } from "ws";
import app from "./app.js";

const PORT = process.env.PORT || 4001;

// create server from express
const server = http.createServer(app);

// attach ws
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("🟢 WebSocket connected");
  ws.on("message", (message) => {
    console.log("📩", message.toString());
    ws.send("pong");
  });

  ws.on("close", () => {
    console.log("🔴 WebSocket disconnected");
  });
});

// START THE SERVER (important part)
server.listen(PORT, () => {
  console.log(`🚀 API + WS running on http://localhost:${PORT}`);
});
