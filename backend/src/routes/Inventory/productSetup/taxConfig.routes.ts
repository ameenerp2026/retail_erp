import express from "express";
import {
  getTaxConfigs,
  createTaxConfig,
  updateTaxConfig,
  updateTaxConfigStatus,
} from "../../../controllers/inventory/productSetup/taxConfig.controller.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.js";
import { uploadExcel } from "../../../middleware/uploadExcel.middleware.js";
import { createImportHandler, createTemplateHandler } from "../../../utils/imports/importHandlers.js";
import { taxConfigImport } from "../../../services/inventory/productSetup/taxConfig.import.js";
const router = express.Router();

router.use(authMiddleware);

// Import (before the /:id routes)
router.get(
  "/import-template",
  authorize("TAX_CREATE"),
  createTemplateHandler(taxConfigImport, "tax-config-import-template.xlsx"),
);

router.post(
  "/import",
  authorize("TAX_CREATE"),
  uploadExcel,
  createImportHandler(taxConfigImport, {
    module: "PRODUCT_SETUP",
    successAction: "TAX_IMPORTED",
    failureAction: "TAX_IMPORT_FAILED",
  }),
);

router.get("/", authorize("TAX_VIEW"), getTaxConfigs);
router.post("/", authorize("TAX_CREATE"), createTaxConfig);
router.put("/:id", authorize("TAX_EDIT"), updateTaxConfig);
router.patch("/:id/status", authorize("TAX_EDIT"), updateTaxConfigStatus);

export default router;