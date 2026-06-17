import express from "express";
import {
  createOrgGroupController,
  getOrgGroupByIdController,
  updateOrgGroupController
} from "../../controllers/organization/organization.controller.js";

const router = express.Router();

router.post("/org-group", createOrgGroupController);
router.get("/org-group/:id", getOrgGroupByIdController);
router.patch("/org-group/:id", updateOrgGroupController);

export default router;