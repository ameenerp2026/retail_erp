import express from "express";
import {
  createOrgGroupController,
  getOrgGroupByIdController,
  updateOrgGroupController
} from "../../controllers/organization/organizationGroup.controller.js";
import {authMiddleware }from '../../middleware/auth.middleware.js'
const router = express.Router();
router.use(authMiddleware);

router.post("/org-group", createOrgGroupController);
router.get("/org-group/:id", getOrgGroupByIdController);
router.patch("/org-group/:id", updateOrgGroupController);

export default router;