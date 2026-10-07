import express from "express";
import {
  createBusinessLocationController,
  getBusinessLocationController,
  getBusinessLocationByIdController,
  deleteBusinessLocationController,
  updateBusinessLocationController,
} from "../../../controllers/admin/organization/BusinessLocation.controller.js";
import {authMiddleware }from '../../../middleware/auth.middleware.js'
import { authorize } from "../../../middleware/authorize.js";

import { requireScope } from "../../../middleware/scope.middleware.js";

const router = express.Router();

router.use(authMiddleware);

// CREATE
router.post(
  "/businessLocation",
  authorize("BUSINESS_LOCATION_CREATE"),
  createBusinessLocationController
);

// GET ALL
router.get(
  "/businessLocation",
  authorize("BUSINESS_LOCATION_VIEW"),
  getBusinessLocationController
);

router.get(
  "/businessLocation/:id",
  authorize("BUSINESS_LOCATION_VIEW"),
  requireScope({
    resource: "businessLocation",
    source: "params",
    field: "id",
  }),
  getBusinessLocationByIdController
);

// UPDATE
router.put(
  "/businessLocation/:id",
  authorize("BUSINESS_LOCATION_EDIT"),
  requireScope({
    resource: "businessLocation",
    source: "params",
    field: "id",
  }),
  updateBusinessLocationController
);

// DELETE
router.delete(
  "/businessLocation/:id",
  authorize("BUSINESS_LOCATION_DELETE"),
  requireScope({
    resource: "businessLocation",
    source: "params",
    field: "id",
  }),
  deleteBusinessLocationController
);

export default router;
