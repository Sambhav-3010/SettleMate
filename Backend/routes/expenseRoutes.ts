import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { createExpense, listExpenses, getBalances } from "../controllers/expenseController.js";

const router = express.Router({ mergeParams: true });

router.use(isAuthenticated);

router.post("/", createExpense);       // POST /rooms/:roomId/expenses
router.get("/", listExpenses);         // GET  /rooms/:roomId/expenses
router.get("/balances", getBalances);  // GET  /rooms/:roomId/balances

export default router;