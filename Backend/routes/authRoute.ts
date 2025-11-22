import dotenv from 'dotenv';
import { Router } from "express";
import passport from "../utils/passport.js";
import { googleAuth } from "../controllers/authController.js";
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import prisma from '../utils/prisma.js';
dotenv.config();

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], accessType: "offline" })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: process.env.FRONTEND_URL as string, session: true }),
  googleAuth
);

router.get("/me", isAuthenticated, (req, res) => {
  console.log(req.user)
  res.json({
    message: "true",
    user: {
      username : req.user?.username,
      name : req.user?.name,
      email : req.user?.email,
      id : req.user?.id,
    },
  });
});

router.put('/upi', isAuthenticated, async (req, res) => {
  const userId = (req.user as any)?.id;
  
  if(!userId){
    return res.status(401).json({message: "Unautorize to access the route", success : true})
  }

  const { upiId, username } = req.body;
  if (!upiId || !username) {
    return res.status(400).json({ message: "No upiId/username provided", success: false });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { upiId: upiId, username: username },
    });
    return res.status(201).json({ message: "UPI & username updated", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update UPI", success: false, error });
  }
});

router.get("/logout", isAuthenticated, (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed", error: err });
    }
    res.json({ message: "Logged out successfully" });
  });
});

export default router;