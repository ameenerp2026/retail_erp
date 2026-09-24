import express from "express";
import {
  getFinanceMonthsController,
  getFinanceMonthByIdController
} from "../../../controllers/admin/organization/FinanceMonth.controller.js";
import { authMiddleware } from '../../../middleware/auth.middleware.js'

const router = express.Router();
router.use(authMiddleware);

router.get("/finance-month", getFinanceMonthsController);
router.get("/finance-month/:id", getFinanceMonthByIdController);

export default router;