import express from "express";
import { prisma } from "../lib/prisma.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

// 1️⃣ Create a room
router.post("/room", auth, async (req, res) => {
  const userId = req.userId;
  const { otherUserId } = req.body;

  if (!otherUserId)
    return res.status(400).json({ message: "Other user required" });

  // sort ids so unique constraint works
  const [u1, u2] = [userId, otherUserId].sort();

  try {
    const room = await prisma.room.upsert({
      where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } },
      update: {},
      create: { user1Id: u1, user2Id: u2 },
    });
    const token = req.cookies.accessToken;
    res.json({ ...room, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create room" });
  }
});

// 2️⃣ Get all rooms for current user (with token for WS)
router.get(["/rooms", "/room"], auth, async (req, res) => {
  const userId = req.userId;

  try {
    const rooms = await prisma.room.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // We send the token back so the client can use it for WebSocket connection
    const token = req.cookies.accessToken;

    res.json({
      rooms,
      // Sending the token allows the frontend to grab it
      // and pass it to: new WebSocket(`ws://...?token=${token}`)
      token,
    });
  } catch (err) {
    console.error("Get rooms error:", err);
    res.status(500).json({ message: "Failed to fetch rooms" });
  }
});

// 3️⃣ Get chat history for a room
router.get("/room/:roomId/messages", auth, async (req, res) => {
  const userId = req.userId;
  const { roomId } = req.params;

  try {
    const messages = await prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: "asc" },
    });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

export default router;
