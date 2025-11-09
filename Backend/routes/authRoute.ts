import dotenv from 'dotenv';
import { Router } from "express";
import passport from "../utils/passport";
import { googleAuth } from "../controllers/authController.js";
dotenv.config();

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], accessType: "offline" })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  googleAuth
);

export default router;