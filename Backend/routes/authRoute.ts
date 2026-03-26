import dotenv from "dotenv";
import { Router } from "express";
import passport from "../utils/passport.js";
import { googleAuth } from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import prisma from "../utils/prisma.js";
import { clearAuthCookie, readAuthCookie } from "../utils/authCookie.js";
import { verifyAuthToken } from "../utils/jwt.js";

dotenv.config();

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], accessType: "offline", session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: process.env.FRONTEND_URL as string, session: false }),
  googleAuth
);

router.get("/me", isAuthenticated, (req, res) => {
  res.json({
    message: "true",
    user: {
      username: (req.user as any)?.username,
      name: (req.user as any)?.name,
      email: (req.user as any)?.email,
      id: (req.user as any)?.id,
    },
  });
});

router.put("/upi", isAuthenticated, async (req, res) => {
  const userId = (req.user as any)?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized to access the route", success: false });
  }

  const { upiId, username } = req.body;
  if (!upiId || !username) {
    return res.status(400).json({ message: "No upiId/username provided", success: false });
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { upiId: upiId, username: username },
    });
    return res.status(201).json({ message: "UPI & username updated", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update UPI", success: false, error });
  }
});

router.get("/logout", (_req, res) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out successfully" });
});

router.get("/debug", async (req, res) => {
  const token = readAuthCookie(req);

  if (!token) {
    return res.json({
      isAuthenticated: false,
      reason: "No auth cookie",
      user: null,
    });
  }

  try {
    const { sub } = verifyAuthToken(token);
    const user = await prisma.user.findUnique({
      where: { id: sub },
      select: { id: true, username: true, email: true },
    });

    return res.json({
      isAuthenticated: !!user,
      reason: user ? "Valid JWT cookie" : "User not found",
      user,
    });
  } catch (error) {
    return res.json({
      isAuthenticated: false,
      reason: "Invalid JWT",
      error: (error as Error).message,
      user: null,
    });
  }
});

export default router;
