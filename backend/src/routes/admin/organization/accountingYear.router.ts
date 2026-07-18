import express from "express";
import {
  createAccountingYearController,
  getAccountingYearController,
  
} from "../../../controllers/admin/organization/AccountingYear.controller.js";
import {authMiddleware }from '../../../middleware/auth.middleware.js'
const router = express.Router();
router.use(authMiddleware);

router.post("/accounting-Year", createAccountingYearController);
router.get("/accounting-Year/:id", getAccountingYearController);


export default router;