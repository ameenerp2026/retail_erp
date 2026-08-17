import express from "express";
import {
  createBusinessLocationController,getBusinessLocationController
} from "../../../controllers/admin/organization/BusinessLocation.controller.js";
import {authMiddleware }from '../../../middleware/auth.middleware.js'
const router = express.Router();
router.use(authMiddleware);
router.post(
  '/',
  createBusinessLocationController
);
router.get(
  '/',
  getBusinessLocationController
);

export default router