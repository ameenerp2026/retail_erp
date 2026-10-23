import { Router } from "express";
import { authMiddleware } from "../../../middleware/auth.middleware.js";

import {
createOrgUnitController,
  getOrgUnitController,
  getOrgUnitByIdController,
  updateOrgUnitController,
  deleteOrgUnitController,
} from "../../../controllers/admin/organization/organizationUnit.controller.js";

import { authorize } from "../../../middleware/authorize.js";

import { requireScope } from "../../../middleware/scope.middleware.js";


const router = Router();

router.use(authMiddleware);

router.post(
  "/org-unit",
  authorize("ORG_UNIT_CREATE"),
  createOrgUnitController
);
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
router.put(
  "/org-unit/:id",
  authorize("ORG_UNIT_EDIT"),
  requireScope({
    resource: "organizationUnit",
    source: "params",
    field: "id",
  }),
  updateOrgUnitController
);

export default router;