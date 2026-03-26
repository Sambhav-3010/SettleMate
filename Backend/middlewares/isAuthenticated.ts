import { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma.js";
import { readAuthCookie } from "../utils/authCookie.js";
import { verifyAuthToken } from "../utils/jwt.js";

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  try {
    const token = readAuthCookie(req);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { sub } = verifyAuthToken(token);
    const user = await prisma.user.findUnique({ where: { id: sub } });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    (req as any).user = user;
    return next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
