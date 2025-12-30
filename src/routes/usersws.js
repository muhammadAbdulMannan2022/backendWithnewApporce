import { prisma } from "../lib/prisma.js";

export async function handleUsersRoute(ws, wss) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, isVerified: true, createdAt: true },
    });
    ws.send(JSON.stringify({ type: "ALL_USERS", data: users }));
  } catch (err) {
    ws.send(
      JSON.stringify({ type: "ERROR", message: "Failed to fetch users" })
    );
  }
}
