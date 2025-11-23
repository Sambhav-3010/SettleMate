import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
    getProfile,
    getUserById,
    getUserRooms,
    getUserExpenses,
    getUserInvites,
    respondToUserInvite,
    searchUsers,
    updateProfile
} from "../controllers/userController.js";

const router = express.Router();

router.get("/me", isAuthenticated, getProfile);
router.put("/me", isAuthenticated, updateProfile);
router.get("/me/rooms", isAuthenticated, getUserRooms);
router.get("/me/expenses", isAuthenticated, getUserExpenses);
router.get("/me/invites", isAuthenticated, getUserInvites);
router.post("/me/invites/:inviteId/respond", isAuthenticated, respondToUserInvite);
router.get("/search", isAuthenticated, searchUsers);
router.get("/:userId", isAuthenticated, getUserById);

export default router;
