import { Request, Response } from "express";
import dotenv from "dotenv";
import { setAuthCookie } from "../utils/authCookie.js";
import { signAuthToken } from "../utils/jwt.js";

dotenv.config();

export async function googleAuth(req: Request, res: Response) {
  try {
    const user = req.user as { id: string; email: string; name: string };
    if (!user) {
      return res.status(401).json({ message: "User not found after Google authentication" });
    }

    const token = signAuthToken(user.id);
    setAuthCookie(res, token);

    res.redirect(`${process.env.FRONTEND_URL as string}/onboarding`);
  } catch (err) {
    console.error("Google authentication failed:", err);
    res.status(500).json({ message: "Google authentication failed" });
  }
}
