import dotenv from 'dotenv';
import { Router } from "express";
import passport from "../utils/passport.js";
import { googleAuth } from "../controllers/authController";
dotenv.config();

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], accessType: "offline" })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: process.env.FRONTEND_URL as string, session: false }),
  googleAuth
);

export default router;