import bcrypt from "bcrypt";
import { Request, Response } from "express";
import dotenv from "dotenv";
import prisma from "../utils/prisma";
dotenv.config();

export async function googleAuth(req: Request, res: Response) {
  try {
    const { email, name } = req.user as { email: string; name: string };

    if (!email) {
      return res.status(400).json({ message: "No email provided from Google." });
    }

    let user = await prisma.user.findUnique({ where: { email } });
    const randomPassword = Math.floor(10000000 + Math.random() * 90000000).toString();
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          username: email.split("@")[0],
          password: hashedPassword,
          upiId: "not_set",
        },
      });
    } else {
      user = await prisma.user.update({
        where: { email },
        data: { name },
      });
    }
    
    const redirectUrl = process.env.FRONTEND_URL as string;
    const userWithTokens = req.user as { email: string; name: string; accessToken?: string; refreshToken?: string };

    const finalRedirectUrl = new URL(redirectUrl);
    if (userWithTokens.accessToken) {
      finalRedirectUrl.searchParams.append("accessToken", userWithTokens.accessToken);
    }
    if (userWithTokens.refreshToken) {
      finalRedirectUrl.searchParams.append("refreshToken", userWithTokens.refreshToken);
    }

    res.redirect(finalRedirectUrl.toString());

  } catch (err) {
    console.error("Google authentication failed:", err);
    res.status(500).json({ message: "Google authentication failed" });
  }
}
