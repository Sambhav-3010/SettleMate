import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  createRoom,
  addMemberByUsername,
  sendJoinRequest,
  listPendingInvites,
  respondToInvite,
  postMessage,
  getMessages,
  getRoomDetails,
  listRoomsForUser
} from "../controllers/roomController.js";
import expenseRoutes from "./expenseRoutes.js";

const router = express.Router();

router.use(isAuthenticated);

// Room lifecycle
router.post("/", createRoom);
router.get("/", listRoomsForUser);
router.get("/:roomId", getRoomDetails);

// Members & invites
router.post("/:roomId/add-by-username", addMemberByUsername);
router.post("/:roomId/request-join", sendJoinRequest);
router.get("/:roomId/invites", listPendingInvites);
router.post("/:roomId/invites/:inviteId/respond", respondToInvite);

// Messages
router.post("/:roomId/messages", postMessage);
router.get("/:roomId/messages", getMessages);

// Expense
router.use("/:roomId/expenses", expenseRoutes);

export default router;