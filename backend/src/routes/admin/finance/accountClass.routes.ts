import { Router } from "express";
import * as accountClassController  from "../../../controllers/admin/finance/accountClass.controller.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/", accountClassController.getAccountClassesHandler);
router.get("/:id", accountClassController.getAccountClassByIdHandler);
router.post("/", accountClassController.createAccountClassHandler);
router.get("/account-groups/active", accountClassController.getActiveAccountGroupsHandler);
router.put("/:id", accountClassController.updateAccountClassHandler);
router.delete("/:id", accountClassController.deleteAccountClassHandler);
router.get("/by-group/:accountGroupId", accountClassController.getAccountClassesByGroupHandler);

export default router;