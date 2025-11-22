import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { getProfile, getUserRooms, getUserExpenses, searchUsers } from "../controllers/userController.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/me", getProfile);
router.get("/me/rooms", getUserRooms);
router.get("/me/expenses", getUserExpenses);
router.get("/search", searchUsers);

export default router;
