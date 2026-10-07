import express from "express";

import {
  createOrgGroupController,
  getOrgGroupController,
  getOrgGroupByIdController,
  updateOrgGroupController,
} from "../../../controllers/admin/organization/organizationGroup.controller.js";

import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.js";
import { requireScope } from "../../../middleware/scope.middleware.js";

const router = express.Router();


router.use(authMiddleware);

// Create Organization Group
router.post(
  "/org-group",
  authorize("ORG_GROUP_CREATE"),
  createOrgGroupController
);

// Get all Organization Groups
router.get(
  "/org-group",
  authorize("ORG_GROUP_VIEW"),
  getOrgGroupController
);

// Get Organization Group by ID
router.get(
  "/org-group/:id",
  authorize("ORG_GROUP_VIEW"),
  requireScope({
    resource: "organizationGroup",
    source: "params",
    field: "id",
  }),
  getOrgGroupByIdController
);

// Update Organization Group
router.patch(
  "/org-group/:id",
  authorize("ORG_GROUP_EDIT"),
  requireScope({
    resource: "organizationGroup",
    source: "params",
    field: "id",
  }),
  updateOrgGroupController
);

export default router;