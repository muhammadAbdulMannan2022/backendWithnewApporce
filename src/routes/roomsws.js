import { prisma } from "../lib/prisma.js";
import { WebSocket } from "ws";

export async function handleMyRoomsRoute(ws, wss, user) {
  // Tag this connection so we can identify it later as a "Lobby/List" connection
  ws.isLobby = true;

  console.log(`[WS] User ${user.id} subscribed to ROOMS LIST updates`);

  // 1. Send initial list of rooms (Replacing the need for GET /msg/room)
  try {
    const rooms = await prisma.room.findMany({
      where: {
        OR: [{ user1Id: user.id }, { user2Id: user.id }],
      },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    ws.send(JSON.stringify({ 
      type: "ROOMS_LIST", 
      data: rooms 
    }));
    
  } catch (err) {
    console.error("[WS] Error fetching rooms list:", err);
    ws.send(JSON.stringify({ type: "ERROR", message: "Failed to fetch rooms" }));
  }

  // Handle keep-alive or other commands if necessary
  ws.on("close", () => {
    console.log(`[WS] User ${user.id} disconnected from ROOMS LIST`);
  });
}
