import express from "express";
import {
  createFinanceMonthController,
  getFinanceMonthsController,
  getFinanceMonthByIdController,
  updateFinanceMonthController,
  deleteFinanceMonthController
} from "../../../controllers/admin/organization/FinanceMonth.controller.js";
import {authMiddleware }from '../../../middleware/auth.middleware.js'
const router = express.Router();
router.use(authMiddleware);

router.post("/finance-month", createFinanceMonthController);
router.get("/finance-month", getFinanceMonthsController);
router.get("/finance-month/:id", getFinanceMonthByIdController);
router.patch("/finance-month/:id", updateFinanceMonthController);
router.delete('finance-month/:id',deleteFinanceMonthController)

export default router;