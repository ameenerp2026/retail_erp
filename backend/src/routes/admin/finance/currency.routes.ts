// routes/admin/finance/currency.routes.ts
import { Router } from 'express'
import {
  getCurrenciesHandler,
  createCurrencyHandler,
  updateCurrencyHandler,
  deleteCurrencyHandler,
  refreshCurrencyRateHandler,
} from '../../../controllers/admin/finance/currency.controller.js'

const router = Router()

router.get('/', getCurrenciesHandler)
router.post('/', createCurrencyHandler)
router.put('/:id', updateCurrencyHandler)
router.delete('/:id', deleteCurrencyHandler)
router.post('/:id/refresh', refreshCurrencyRateHandler)

export default router