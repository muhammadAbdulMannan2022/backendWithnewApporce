import { prisma } from "../lib/prisma.js";
import { WebSocket } from "ws";

export async function handleRoomRoute(ws, wss, pathname, user) {
  // pathname format: /room/<roomId>
  const roomId = pathname.split("/")[2];

  if (!roomId) {
    ws.close(4003, "Room ID required");
    return;
  }

  // 1. Verify user is part of the room 
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  
  // Debug log to help verify access
  console.log(`[WS] Verifying access for User ${user.id} to Room ${roomId}`);
  
  if (!room) {
     console.log(`[WS] Room ${roomId} not found`);
     ws.close(4004, "Room not found");
     return;
  }
  
  if (room.user1Id !== user.id && room.user2Id !== user.id) {
     console.log(`[WS] Access denied: User ${user.id} is not in room members [${room.user1Id}, ${room.user2Id}]`);
     ws.close(4003, "Access denied");
     return;
  }

  // 2. Attach metadata to this ws client
  ws.roomId = roomId;

  console.log(`[WS] User ${user.id} JOINED room ${roomId}`);

  // 3. Handle incoming messages
  ws.on("message", async (data) => {
    try {
      const raw = data.toString();
      // console.log(`[WS] Received: ${raw}`); 

      let payload;
      try {
        payload = JSON.parse(raw);
      } catch (e) {
        console.error("[WS] JSON Parse Error");
        return;
      }

      if (!payload.content) {
        console.warn("[WS] Payload missing 'content' field");
        return;
      }

      // Save to DB
      const newMessage = await prisma.message.create({
        data: {
          roomId,
          senderId: user.id,
          content: payload.content,
        },
      });

      console.log(`[WS] Message SAVED (ID: ${newMessage.id})`);

      // Broadcast to OTHERS in the room
      const broadcastData = JSON.stringify({
        type: "NEW_MESSAGE",
        data: newMessage,
      });

      wss.clients.forEach((client) => {
        if (
          client !== ws && // ✅ Don't send back to self (sender)
          client.readyState === WebSocket.OPEN &&
          client.roomId === roomId
        ) {
          client.send(broadcastData);
        }
      });
      console.log(`[WS] Message BROADCASTED to others`);

      // 3. Broadcast to LOBBY/LIST listeners (for real-time preview updates)
      const participants = [room.user1Id, room.user2Id];
      
      wss.clients.forEach((client) => {
        if (
          client.readyState === WebSocket.OPEN &&
          client.isLobby && // Defined in roomsws.js
          participants.includes(client.userId) 
        ) {
          client.send(JSON.stringify({
            type: "ROOM_UPDATE",
            data: {
              roomId,
              lastMessage: newMessage
            }
          }));
        }
      });

    } catch (err) {
      console.error("[WS] Message Handler Error:", err);
      ws.send(JSON.stringify({ type: "ERROR", message: "Failed to process message" }));
    }
  });

  // 4. Handle disconnect
  ws.on("close", () => {
    console.log(`[WS] User ${user.id} LEFT room ${roomId}`);
  });
}
