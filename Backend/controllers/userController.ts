import { Request, Response } from "express";
import prisma from "../utils/prisma.js";

function getUserId(req: Request) {
  return (req.user as any).id as string;
}

// 1. Get logged-in user profile
export async function getProfile(req: Request, res: Response) {
  try {
    const userId = getUserId(req);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        upiId: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("getProfile error:", err);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
}

// 2. Get all rooms user is part of
export async function getUserRooms(req: Request, res: Response) {
  try {
    const userId = getUserId(req);

    const rooms = await prisma.room.findMany({
      where: { members: { some: { userId } } },
      select: {
        id: true,
        name: true,
        ownerId: true,
        createdAt: true,
        members: { select: { user: { select: { id: true, username: true, name: true } }, role: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(rooms);
  } catch (err) {
    console.error("getUserRooms error:", err);
    res.status(500).json({ message: "Failed to fetch user rooms" });
  }
}

// 3. Get all expenses involving the user
export async function getUserExpenses(req: Request, res: Response) {
  try {
    const userId = getUserId(req);

    const expenses = await prisma.expense.findMany({
      where: {
        OR: [
          { payerId: userId },
          { splits: { some: { userId } } },
        ],
      },
      include: {
        room: { select: { id: true, name: true } },
        payer: { select: { id: true, username: true, name: true } },
        splits: { include: { user: { select: { id: true, username: true, name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(expenses);
  } catch (err) {
    console.error("getUserExpenses error:", err);
    res.status(500).json({ message: "Failed to fetch user expenses" });
  }
}

export async function searchUsers(req: Request, res: Response) {
  try {
    const { query } = req.query;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
      },
      take: 10,
    });

    res.json(users);
  } catch (err) {
    console.error("searchUsers error:", err);
    res.status(500).json({ message: "Failed to search users" });
  }
}

export async function getUserInvites(req: Request, res: Response) {
  try {
    const userId = getUserId(req);

    const invites = await prisma.invite.findMany({
      where: {
        toUserId: userId,
        status: "PENDING",
      },
      include: {
        room: { select: { id: true, name: true } },
        fromUser: { select: { id: true, username: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(invites);
  } catch (err) {
    console.error("getUserInvites error:", err);
    res.status(500).json({ message: "Failed to fetch user invites" });
  }
}

export async function respondToUserInvite(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const { inviteId } = req.params;
    const { action } = req.body;

    const invite = await prisma.invite.findUnique({
      where: { id: inviteId },
    });

    if (!invite) return res.status(404).json({ message: "Invite not found" });
    if (invite.toUserId !== userId) return res.status(403).json({ message: "Not your invite" });
    if (invite.status !== "PENDING") return res.status(400).json({ message: "Invite already responded to" });

    if (action === "ACCEPT") {
      // Add user to room
      await prisma.roomMember.create({
        data: {
          roomId: invite.roomId,
          userId: userId,
          role: "member",
        },
      });

      // Update invite status
      const updatedInvite = await prisma.invite.update({
        where: { id: inviteId },
        data: { status: "ACCEPTED" },
      });

      res.json(updatedInvite);
    } else if (action === "REJECT") {
      const updatedInvite = await prisma.invite.update({
        where: { id: inviteId },
        data: { status: "REJECTED" },
      });

      res.json(updatedInvite);
    } else {
      res.status(400).json({ message: "Invalid action" });
    }
  } catch (err) {
    console.error("respondToUserInvite error:", err);
    res.status(500).json({ message: "Failed to respond to invite" });
  }
}
