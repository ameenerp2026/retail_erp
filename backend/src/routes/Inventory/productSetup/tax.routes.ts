import express from 'express'
import { authMiddleware } from '../../../middleware/auth.middleware.js'
import {
  getHsnRatesHandler,
  lookupHsnRateHandler,
  getTaxConfigsHandler,
  getTaxConfigByIdHandler,
  createTaxConfigHandler,
  updateTaxConfigHandler,
  deleteTaxConfigHandler,
  calculateProductTaxHandler,
} from '../../../controllers/inventory/productSetup/tax.controller.js'

const router = express.Router()

router.use(authMiddleware)

// Specific lookup and calculation endpoints (must precede /:id)
router.get('/hsn-codes', getHsnRatesHandler)
router.get('/hsn-codes/:code', lookupHsnRateHandler)
router.get('/hsn-rate', lookupHsnRateHandler)
router.post('/calculate', calculateProductTaxHandler)

// Tax Configuration CRUD endpoints
router.get('/', getTaxConfigsHandler)
router.get('/:id', getTaxConfigByIdHandler)
router.post('/', createTaxConfigHandler)
router.put('/:id', updateTaxConfigHandler)
router.delete('/:id', deleteTaxConfigHandler)

export default router

