import express from "express";
import { authorize } from "../../../middleware/authorize.js";
import {
  getFinanceMonthsController,
  getFinanceMonthByIdController
} from "../../../controllers/admin/organization/FinanceMonth.controller.js";
import { authMiddleware } from '../../../middleware/auth.middleware.js'

const router = express.Router();
router.use(authMiddleware);

// router.post("/finance-month", createFinanceMonthController);
 router.get("/finance-month",
    authorize("ACCOUNT_GROUP_VIEW"),
  getFinanceMonthsController);
router.get("/finance-month/:id",
    authorize("ACCOUNT_GROUP_VIEW"),
  getFinanceMonthByIdController);
// router.patch("/finance-month/:id", updateFinanceMonthController);
// router.delete('/finance-month/:id',deleteFinanceMonthController)

export default router;