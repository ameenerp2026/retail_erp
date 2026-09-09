import { Router } from 'express'
import { authMiddleware } from '../../../middleware/auth.middleware.js'
import { getFormOptionsHandler, createEInvoiceHandler } from '../../../controllers/admin/utilities/eInvoice.controller.js'

const router = Router()
router.use(authMiddleware)

router.get('/form-options', getFormOptionsHandler)
router.post('/', createEInvoiceHandler)

export default router