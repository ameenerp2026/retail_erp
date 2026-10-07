import { Router } from "express";
import { authMiddleware } from "../../../middleware/auth.middleware.js";

import {

  getOrgUnitController,
  getOrgUnitByIdController,
  updateOrgUnitController,
  deleteOrgUnitController,
} from "../../../controllers/admin/organization/organizationUnit.controller.js";

import { authorize } from "../../../middleware/authorize.js";

import { requireScope } from "../../../middleware/scope.middleware.js";

const router = Router();

router.use(authMiddleware);
router.get(
  "/org-unit",
  authorize("ORG_UNIT_VIEW"),
  getOrgUnitController
);
router.get(
  "/org-unit/:id",
  authorize("ORG_UNIT_VIEW"),
  requireScope({
    resource: "organizationUnit",
    source: "params",
    field: "id",
  }),
  getOrgUnitByIdController
);
router.delete(
  "/org-unit/:id",
  authorize("ORG_UNIT_DELETE"),
  requireScope({
    resource: "organizationUnit",
    source: "params",
    field: "id",
  }),
  deleteOrgUnitController
);

export default router;