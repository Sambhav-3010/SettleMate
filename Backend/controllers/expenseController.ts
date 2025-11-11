import { Request, Response } from "express";
import prisma from "../utils/prisma.js";

function getUserId(req: Request) {
  return (req.user as any).id as string;
}

const toCents = (amt: number) => Math.round(amt * 100);
const fromCents = (cents: number) => cents / 100;
export async function createExpense(req: Request, res: Response) {
  try {
    const payerId = getUserId(req);
    const { roomId } = req.params;
    const { amount, description, splits } = req.body;

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ message: "amount must be a positive number" });
    }

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) return res.status(404).json({ message: "Room not found" });

    const member = await prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId: payerId } },
    });
    if (!member) return res.status(403).json({ message: "You are not a member of this room" });
    const members = await prisma.roomMember.findMany({ where: { roomId }, include: { user: true } });
    const memberIds = members.map((m: any) => m.userId);

    const totalCents = toCents(amount);
    let splitsToCreate: { userId: string; amountCents: number }[] = [];
    if (Array.isArray(splits) && splits.length > 0) {
      let sumCents = 0;
      for (const s of splits) {
        if (!s.userId || typeof s.amount !== "number" || s.amount < 0) {
          return res.status(400).json({ message: "invalid splits format" });
        }
        if (!memberIds.includes(s.userId)) {
          return res.status(400).json({ message: `user ${s.userId} not in room` });
        }
        const cents = toCents(s.amount);
        splitsToCreate.push({ userId: s.userId, amountCents: cents });
        sumCents += cents;
      }
      if (sumCents !== totalCents) {
        return res.status(400).json({ message: "splits do not sum to total amount" });
      }
    } else {
      const n = memberIds.length;
      if (n === 0) return res.status(400).json({ message: "no members in room" });

      const base = Math.floor(totalCents / n);
      const remainder = totalCents - base * n;
      for (let i = 0; i < n; i++) {
        const extra = i < remainder ? 1 : 0;
        splitsToCreate.push({ userId: memberIds[i], amountCents: base + extra });
      }
    }

    const result = await prisma.$transaction(async (tx: any) => {
      const exp = await tx.expense.create({
        data: {
          roomId,
          payerId,
          amount: amount,
          description: description ?? null,
        },
      });

      const splitCreates = splitsToCreate.map((s) => ({
        expenseId: exp.id,
        userId: s.userId,
        amount: fromCents(s.amountCents),
      }));

      if (splitCreates.length > 0) {
        await tx.split.createMany({ data: splitCreates });
      }

      const full = await tx.expense.findUnique({
        where: { id: exp.id },
        include: { payer: { select: { id: true, username: true, name: true } }, splits: { include: { user: { select: { id: true, username: true, name: true } } } } },
      });

      return full;
    });

    return res.status(201).json({ message: "Expense created", expense: result });
  } catch (err) {
    console.error("createExpense error:", err);
    res.status(500).json({ message: "Failed to create expense" });
  }
}

export async function listExpenses(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const { roomId } = req.params;

    const member = await prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    if (!member) return res.status(403).json({ message: "Not a member" });

    const expenses = await prisma.expense.findMany({
      where: { roomId },
      orderBy: { createdAt: "desc" },
      include: {
        payer: { select: { id: true, username: true, name: true } },
        splits: { include: { user: { select: { id: true, username: true, name: true } } } },
      },
    });

    res.json({ expenses });
  } catch (err) {
    console.error("listExpenses error:", err);
    res.status(500).json({ message: "Failed to list expenses" });
  }
}

export async function getBalances(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const { roomId } = req.params;

    const member = await prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    if (!member) return res.status(403).json({ message: "Not a member" });

    const expenses = await prisma.expense.findMany({
      where: { roomId },
      include: { splits: true, payer: true },
    });

    const netCents: Record<string, number> = {};
    const members = await prisma.roomMember.findMany({ where: { roomId } });
    members.forEach((m: any) => (netCents[m.userId] = 0));

    for (const exp of expenses) {
      const payer = exp.payerId;
      const paidCents = toCents(exp.amount);
      netCents[payer] = (netCents[payer] ?? 0) + paidCents;

      for (const s of exp.splits) {
        const owedCents = toCents(s.amount);
        netCents[s.userId] = (netCents[s.userId] ?? 0) - owedCents;
      }
    }

    const userIds = Object.keys(netCents);
    const users = await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, username: true, name: true } });
    const balances = users.map((u: any) => ({
      userId: u.id,
      username: u.username,
      name: u.name,
      net: fromCents(netCents[u.id] ?? 0),
    }));

    res.json({ balances });
  } catch (err) {
    console.error("getBalances error:", err);
    res.status(500).json({ message: "Failed to compute balances" });
  }
}
