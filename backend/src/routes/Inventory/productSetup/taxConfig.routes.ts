import express from "express";
import {
  getTaxConfigs,
  createTaxConfig,
  updateTaxConfig,
  updateTaxConfigStatus,
} from "../../../controllers/inventory/productSetup/taxConfig.controller.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", authorize("TAX_VIEW"), getTaxConfigs);
router.post("/", authorize("TAX_CREATE"), createTaxConfig);
router.put("/:id", authorize("TAX_EDIT"), updateTaxConfig);
router.patch("/:id/status", authorize("TAX_EDIT"), updateTaxConfigStatus);

export default router;