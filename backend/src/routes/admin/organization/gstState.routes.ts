import { Router } from "express";
import { authMiddleware } from '../../../middleware/auth.middleware.js'
import {
  getGstStateTableHandler,
  getGstStateStatsHandler,
  getGstStateOptionsHandler,
  getGstStateByIdHandler,
  getLinkedStoresByState,
  updateGstStateHandler,
} from "../../../controllers/admin/organization/gstState.controller.js";

const router = Router();
router.use(authMiddleware);
// NOTE: order matters — /stats and /options must come before /:id,
// otherwise Express will match them as an :id param ("stats", "options").

router.get("/stats", getGstStateStatsHandler);
router.get("/options", getGstStateOptionsHandler);
router.get("/:id", getGstStateByIdHandler);
router.patch("/:id", updateGstStateHandler);
router.get("/", getGstStateTableHandler);
router.get("/:id/linked-stores",getLinkedStoresByState);

export default router;