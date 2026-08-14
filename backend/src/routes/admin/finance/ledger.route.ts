import { Router } from "express";
import * as ledgerController from "../../../controllers/admin/finance/ledger.controller.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";        

const router = Router();
router.use(authMiddleware);

router.post("/", ledgerController.createLedgerHandler);
router.get("/", ledgerController.getLedgersHandler);
router.get("/:id", ledgerController.getLedgerByIdHandler);
router.put("/:id", ledgerController.updateLedgerHandler);
router.delete("/:id", ledgerController.deleteLedgerHandler);
export default router;