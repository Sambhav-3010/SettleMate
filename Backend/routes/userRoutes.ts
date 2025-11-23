import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { getProfile, getUserRooms, getUserExpenses, searchUsers, getUserInvites, respondToUserInvite, updateProfile } from "../controllers/userController.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/me", getProfile);
router.put("/me", updateProfile);
router.get("/me/rooms", getUserRooms);
router.get("/me/expenses", getUserExpenses);
router.get("/search", searchUsers);
router.get("/me/invites", getUserInvites);
router.post("/me/invites/:inviteId/respond", respondToUserInvite);

export default router;
