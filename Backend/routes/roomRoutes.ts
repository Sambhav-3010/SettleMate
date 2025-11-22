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

router.post("/", isAuthenticated, createRoom);
router.get("/", isAuthenticated, listRoomsForUser);
router.get("/:roomId", isAuthenticated, getRoomDetails);

router.post("/:roomId/add-by-username", isAuthenticated, addMemberByUsername);
router.post("/:roomId/request-join", isAuthenticated, sendJoinRequest);
router.get("/:roomId/invites", isAuthenticated, listPendingInvites);
router.post("/:roomId/invites/:inviteId/respond", isAuthenticated, respondToInvite);

router.post("/:roomId/messages", isAuthenticated, postMessage);
router.get("/:roomId/messages", isAuthenticated, getMessages);

router.use("/:roomId/expenses", isAuthenticated, expenseRoutes);

export default router;