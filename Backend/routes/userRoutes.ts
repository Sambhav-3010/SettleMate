import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { getProfile, getUserRooms, getUserExpenses } from "../controllers/userController";

const router = express.Router();

router.use(isAuthenticated);

router.get("/me", getProfile);
router.get("/me/rooms", getUserRooms);
router.get("/me/expenses", getUserExpenses);

export default router;
