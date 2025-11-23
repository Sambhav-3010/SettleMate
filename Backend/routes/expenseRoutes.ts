import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { createExpense, listExpenses, getBalances, confirmSettlement, rejectSettlement } from "../controllers/expenseController.js";

const router = express.Router({ mergeParams: true });

router.use(isAuthenticated);

router.post("/", createExpense);
router.get("/", listExpenses);
router.get("/balances", getBalances);
router.patch("/:expenseId/confirm", confirmSettlement);
router.delete("/:expenseId/reject", rejectSettlement);

export default router;