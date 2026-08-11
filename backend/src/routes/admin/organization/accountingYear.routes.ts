import express from "express";
import {
  createAccountingYearController,
  getAccountingYearController,
  getAccountingYearByIdController,
  
} from "../../../controllers/admin/organization/AccountingYear.controller.js";
import {authMiddleware }from '../../../middleware/auth.middleware.js'
const router = express.Router();
router.use(authMiddleware);

router.post("/accounting-Year", createAccountingYearController);
router.get("/accounting-Year", getAccountingYearController);
router.get("/accounting-Year/:id", getAccountingYearByIdController);


export default router;