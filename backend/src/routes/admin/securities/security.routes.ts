import { Router } from "express";
import { authMiddleware, AuthRequest } from "../../../middleware/auth.middleware.js";
import { getUserScopes } from "../../../utils/admin/securities/scope.helper.js";
import {
  requireOrganizationGroupUpdateScope,
} from "../../../middleware/organization-group-update-scope.middleware.js";
import { authorize } from "../../../middleware/authorize.js";
import { requireOrganizationUnitScope } from "../../../middleware/organization-unit-scope.middleware.js";
import { updateOrgUnitController } from "../../../controllers/admin/organization/organizationUnit.controller.js";

const router = Router();
router.put(
  "/org-unit/:id",
  authorize("ORG_UNIT_EDIT"),
  requireOrganizationUnitScope(),
  requireOrganizationGroupUpdateScope(),
  updateOrgUnitController
);
export default router;