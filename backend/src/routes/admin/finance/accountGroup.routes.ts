import { Router } from "express";
import * as accountGroupController from "../../../controllers/admin/finance/accountGroup.controller.js";
import {authMiddleware }from '../../../middleware/auth.middleware.js'

const router = Router();
router.use(authMiddleware);
// Groups
router.get("/groups", accountGroupController.getGroups);

// Sub Groups
router.get("/sub-groups/:groupId", accountGroupController.getSubGroups);

// Account Groups
router.get("/", accountGroupController.getAccountGroups);
router.get("/active", accountGroupController.getActiveAccountGroups);
router.get("/:id", accountGroupController.getAccountGroupById);
router.post("/", accountGroupController.createAccountGroup);
router.put("/:id", accountGroupController.updateAccountGroup);
router.delete("/:id", accountGroupController.deleteAccountGroup);

export default router;