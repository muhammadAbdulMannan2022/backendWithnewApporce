import "dotenv/config";
import http from "http";
import { setupWebSocket } from "./websocket.js";
import app from "./app.js";
import { initializeAdminUser } from "./admin-setup.js";

const PORT = process.env.PORT || 4001;

// create server from express
const server = http.createServer(app);

// attach ws
setupWebSocket(server);

// Initialize Admin User if not exists
initializeAdminUser();

// START THE SERVER (important part)
server.listen(PORT, () => {
  console.log(`🚀 API + WS running on http://localhost:${PORT}`);
});
