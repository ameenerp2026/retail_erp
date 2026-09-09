import { Router } from 'express'
import { authMiddleware } from '../../../middleware/auth.middleware.js'
import { getFormOptionsHandler, createEWayBillHandler } from '../../../controllers/admin/utilities/eWayBill.controller.js'

const router = Router()
router.use(authMiddleware)

router.get('/form-options', getFormOptionsHandler)
router.post('/', createEWayBillHandler)

export default router