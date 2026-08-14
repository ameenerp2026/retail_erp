// routes/admin/finance/subLedger.routes.ts
import { Router } from 'express'
import * as subLedgerController from '../../../controllers/admin/finance/subLedger.controller.js'
import { authMiddleware } from '../../../middleware/auth.middleware.js'

const router = Router()

router.get('/', authMiddleware, subLedgerController.getSubLedgersHandler)
router.post('/', authMiddleware, subLedgerController.createSubLedgerHandler)
router.put('/:id', authMiddleware, subLedgerController.updateSubLedgerHandler)
router.delete('/:id', authMiddleware, subLedgerController.deleteSubLedgerHandler)

export default router