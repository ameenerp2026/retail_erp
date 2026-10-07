import express from "express";
import {
  createAccountingYearController,
  getAccountingYearController,
  getAccountingYearByIdController,
  
} from "../../../controllers/admin/organization/AccountingYear.controller.js";
import {authMiddleware }from '../../../middleware/auth.middleware.js'
import { authorize } from "../../../middleware/authorize.js";
const router = express.Router();
router.use(authMiddleware);

router.post(
  "/accounting-Year",
  authorize("ACCOUNT_GROUP_CREATE"),
  createAccountingYearController
);

router.get(
  "/accounting-Year",
  authorize("ACCOUNT_GROUP_VIEW"),
  getAccountingYearController
);

router.get(
  "/accounting-Year/:id",
  authorize("ACCOUNT_GROUP_VIEW"),
  getAccountingYearByIdController
);


export default router;