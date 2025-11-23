import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { createExpense, listExpenses, getBalances, confirmSettlement } from "../controllers/expenseController.js";

const router = express.Router({ mergeParams: true });

router.use(isAuthenticated);

router.post("/", createExpense);
router.get("/", listExpenses);
router.get("/balances", getBalances);
router.patch("/:expenseId/confirm", confirmSettlement);

export default router;