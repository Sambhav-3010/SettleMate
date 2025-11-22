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
