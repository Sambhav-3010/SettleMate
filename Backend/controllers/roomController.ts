import { Request, Response } from "express";
import prisma from "../utils/prisma";

function getUserId(req: Request) {
  return (req.user as any).id as string;
}

export async function createRoom(req: Request, res: Response) {
  try {
    const ownerId = getUserId(req);
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" });

    const room = await prisma.room.create({
      data: {
        name,
        ownerId,
        members: {
          create: [{ userId: ownerId, role: "owner" }],
        },
      },
      include: { members: true },
    });

    res.status(201).json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not create room" });
  }
}

/**
 * List rooms for a user (member of)
 */
export async function listRoomsForUser(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const rooms = await prisma.room.findMany({
      where: { members: { some: { userId } } },
      include: { members: { include: { user: { select: { id: true, username: true, name: true } } } } },
    });
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to list rooms" });
  }
}

/**
 * Get room details (only if member)
 */
export async function getRoomDetails(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const { roomId } = req.params;

    const isMember = await prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    if (!isMember) return res.status(403).json({ message: "Forbidden" });

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { members: { include: { user: true } }, messages: { take: 50, orderBy: { createdAt: "desc" } } },
    });
    res.json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get room" });
  }
}

/**
 * Owner can add a member directly by username
 */
export async function addMemberByUsername(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const { roomId } = req.params;
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: "username required" });

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (room.ownerId !== userId) return res.status(403).json({ message: "Only owner can add members" });

    const userToAdd = await prisma.user.findUnique({ where: { username } });
    if (!userToAdd) return res.status(404).json({ message: "User not found" });

    // check already member
    const exists = await prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId: userToAdd.id } },
    });
    if (exists) return res.status(400).json({ message: "User already a member" });

    const newMember = await prisma.roomMember.create({
      data: { roomId, userId: userToAdd.id, role: "member" },
    });

    res.status(201).json(newMember);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add member" });
  }
}

/**
 * A user can request to join a room (creates Invite)
 */
export async function sendJoinRequest(req: Request, res: Response) {
  try {
    const fromUserId = getUserId(req);
    const { roomId } = req.params;

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) return res.status(404).json({ message: "Room not found" });

    // if already member
    const already = await prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId: fromUserId } },
    });
    if (already) return res.status(400).json({ message: "Already a member" });

    // create invite from requester to room owner
    const invite = await prisma.invite.create({
      data: {
        roomId,
        fromUserId,
        toUserId: room.ownerId,
        status: "PENDING",
      },
    });

    res.status(201).json(invite);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not send join request" });
  }
}

/**
 * Owner lists pending invites for the room
 */
export async function listPendingInvites(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const { roomId } = req.params;

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (room.ownerId !== userId) return res.status(403).json({ message: "Only owner can view invites" });

    const invites = await prisma.invite.findMany({
      where: { roomId, status: "PENDING" },
      include: { fromUser: { select: { id: true, username: true, name: true } } },
    });

    res.json(invites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not list invites" });
  }
}

/**
 * Owner responds to invite: accept or reject
 */
export async function respondToInvite(req: Request, res: Response) {
  try {
    const ownerId = getUserId(req);
    const { roomId, inviteId } = req.params;
    const { action } = req.body; // "ACCEPT" or "REJECT"

    const invite = await prisma.invite.findUnique({ where: { id: inviteId } });
    if (!invite || invite.roomId !== roomId) return res.status(404).json({ message: "Invite not found" });

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (room.ownerId !== ownerId) return res.status(403).json({ message: "Only owner can respond" });

    if (action === "ACCEPT") {
      // add member and update invite
      await prisma.roomMember.create({
        data: { roomId, userId: invite.fromUserId, role: "member" },
      });
      const updated = await prisma.invite.update({
        where: { id: inviteId },
        data: { status: "ACCEPTED" },
      });
      return res.json(updated);
    } else {
      const updated = await prisma.invite.update({
        where: { id: inviteId },
        data: { status: "REJECTED" },
      });
      return res.json(updated);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not respond to invite" });
  }
}

/**
 * Post a message to room (user must be member)
 */
export async function postMessage(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const { roomId } = req.params;
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "content required" });

    const member = await prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    if (!member) return res.status(403).json({ message: "Not a member" });

    const message = await prisma.message.create({
      data: { roomId, senderId: userId, content },
    });

    // TODO: emit via socket.io here later
    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not post message" });
  }
}

/**
 * Get messages with pagination
 */
export async function getMessages(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const { roomId } = req.params;
    const take = Number(req.query.take) || 50;
    const skip = Number(req.query.skip) || 0;

    const member = await prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    if (!member) return res.status(403).json({ message: "Not a member" });

    const messages = await prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: "asc" },
      take,
      skip,
      include: { sender: { select: { id: true, username: true, name: true } } },
    });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not get messages" });
  }
}
