import { Request, Response } from 'express'
import { AuthRequest } from '../../../middleware/auth.middleware.js'
import { taxService } from '../../../services/inventory/productSetup/tax.services.js'
import { audit } from '../../../utils/admin/securities/audit.utils.js'
import { validatePercentageRate } from '../../../utils/inventory/gstCalculations.js'

const handleError = (error: unknown, res: Response) => {
  const err = error as { code?: string; status?: number; message?: string }
  if (err?.code === 'P2002') {
    return res.status(409).json({ success: false, message: 'Tax configuration already exists' })
  }
  if (err?.status) {
    return res.status(err.status).json({ success: false, message: err.message || 'Request error' })
  }
  console.error(error)
  return res.status(500).json({ success: false, message: 'Something went wrong' })
}

export const getHsnRatesHandler = async (_req: Request, res: Response) => {
  try {
    const data = await taxService.listHsnRates()
    return res.status(200).json({
      success: true,
      message: 'HSN GST rates fetched successfully',
      data,
    })
  } catch (error) {
    return handleError(error, res)
  }
}

export const lookupHsnRateHandler = async (req: Request, res: Response) => {
  try {
    const code = String(req.params.code ?? req.query.code ?? '').trim()
    if (!code) {
      return res.status(400).json({ success: false, message: 'HSN/SAC code is required' })
    }

    const match = await taxService.findHsnRateByCode(code)
    if (!match) {
      return res.status(404).json({
        success: false,
        message: `No HSN rate found for code "${code}"`,
        data: null,
      })
    }

    return res.status(200).json({
      success: true,
      message: 'HSN GST rate fetched successfully',
      data: match,
    })
  } catch (error) {
    return handleError(error, res)
  }
}

export const getTaxConfigsHandler = async (req: Request, res: Response) => {
  try {
    const search =
      typeof req.query.search === 'string' && req.query.search.trim()
        ? req.query.search.trim()
        : undefined
    const taxGroup =
      typeof req.query.taxGroup === 'string' && req.query.taxGroup.trim()
        ? req.query.taxGroup.trim()
        : undefined

    const data = await taxService.list({ search, taxGroup })
    return res.status(200).json({
      success: true,
      message: 'Tax configurations fetched successfully',
      data,
    })
  } catch (error) {
    return handleError(error, res)
  }
}

export const getTaxConfigByIdHandler = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid tax configuration id' })
    }

    const data = await taxService.getById(id)
    return res.status(200).json({
      success: true,
      message: 'Tax configuration fetched successfully',
      data,
    })
  } catch (error) {
    return handleError(error, res)
  }
}

export const createTaxConfigHandler = async (req: Request, res: Response) => {
  try {
    const productCode = String(req.body.productCode ?? '').trim()
    const productName = String(req.body.productName ?? '').trim()
    const taxGroup = String(req.body.taxGroup ?? '').trim()
    const hsnSac = typeof req.body.hsnSac === 'string' ? req.body.hsnSac.trim() : undefined

    if (!productCode) {
      return res.status(400).json({ success: false, message: 'Product Code is required' })
    }
    if (!productName) {
      return res.status(400).json({ success: false, message: 'Product Name is required' })
    }
    if (!taxGroup) {
      return res.status(400).json({ success: false, message: 'Tax Group is required' })
    }

    const hasExplicitGstRate =
      req.body.gstRate !== undefined &&
      req.body.gstRate !== null &&
      String(req.body.gstRate).trim() !== ''

    let validatedGstRate: number | undefined
    if (hasExplicitGstRate) {
      const gstCheck = validatePercentageRate(req.body.gstRate, 'GST %', { required: true })
      if (!gstCheck.valid) {
        return res.status(400).json({ success: false, message: gstCheck.error })
      }
      validatedGstRate = gstCheck.value
    } else if (!hsnSac) {
      return res.status(400).json({ success: false, message: 'GST % is required' })
    }

    const cessCheck = validatePercentageRate(req.body.cess, 'CESS %', {
      required: false,
      defaultValue: 0,
    })
    if (!cessCheck.valid) {
      return res.status(400).json({ success: false, message: cessCheck.error })
    }

    const userId = (req as AuthRequest).user?.id
    const data = await taxService.create(
      {
        productCode,
        productName,
        taxGroup,
        hsnSac,
        gstRate: validatedGstRate,
        cess: cessCheck.value,
        effectiveDate: req.body.effectiveDate,
        isDefault: Boolean(req.body.isDefault),
      },
      userId,
    )

    await audit(
      req as AuthRequest,
      'PRODUCT_SETUP',
      'TAX_CONFIG_CREATED',
      `Created Tax Configuration ${data.taxId} (${data.productCode}) with GST ${data.gstRate}%`,
    )

    return res.status(201).json({
      success: true,
      message: 'Tax configuration created successfully',
      data,
    })
  } catch (error) {
    await audit(
      req as AuthRequest,
      'PRODUCT_SETUP',
      'TAX_CONFIG_CREATE_FAILED',
      error instanceof Error ? error.message : 'Unknown error',
      'ERROR',
    )
    return handleError(error, res)
  }
}

export const updateTaxConfigHandler = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid tax configuration id' })
    }

    const updates: Record<string, unknown> = {}

    if (req.body.productCode !== undefined) {
      const productCode = String(req.body.productCode).trim()
      if (!productCode) {
        return res.status(400).json({ success: false, message: 'Product Code is required' })
      }
      updates.productCode = productCode
    }

    if (req.body.productName !== undefined) {
      const productName = String(req.body.productName).trim()
      if (!productName) {
        return res.status(400).json({ success: false, message: 'Product Name is required' })
      }
      updates.productName = productName
    }

    if (req.body.taxGroup !== undefined) {
      const taxGroup = String(req.body.taxGroup).trim()
      if (!taxGroup) {
        return res.status(400).json({ success: false, message: 'Tax Group is required' })
      }
      updates.taxGroup = taxGroup
    }

    if (req.body.hsnSac !== undefined) {
      updates.hsnSac = String(req.body.hsnSac).trim()
    }

    if (req.body.gstRate !== undefined) {
      const gstCheck = validatePercentageRate(req.body.gstRate, 'GST %', { required: true })
      if (!gstCheck.valid) {
        return res.status(400).json({ success: false, message: gstCheck.error })
      }
      updates.gstRate = gstCheck.value
    }

    if (req.body.cess !== undefined) {
      const cessCheck = validatePercentageRate(req.body.cess, 'CESS %', {
        required: false,
        defaultValue: 0,
      })
      if (!cessCheck.valid) {
        return res.status(400).json({ success: false, message: cessCheck.error })
      }
      updates.cess = cessCheck.value
    }

    if (req.body.effectiveDate !== undefined) {
      updates.effectiveDate = req.body.effectiveDate
    }

    if (req.body.isDefault !== undefined) {
      updates.isDefault = Boolean(req.body.isDefault)
    }

    const userId = (req as AuthRequest).user?.id
    const data = await taxService.update(id, updates, userId)

    await audit(
      req as AuthRequest,
      'PRODUCT_SETUP',
      'TAX_CONFIG_UPDATED',
      `Updated Tax Configuration ${data.taxId} (GST ${data.gstRate}%)`,
    )

    return res.status(200).json({
      success: true,
      message: 'Tax configuration updated successfully',
      data,
    })
  } catch (error) {
    await audit(
      req as AuthRequest,
      'PRODUCT_SETUP',
      'TAX_CONFIG_UPDATE_FAILED',
      error instanceof Error ? error.message : 'Unknown error',
      'ERROR',
    )
    return handleError(error, res)
  }
}

export const deleteTaxConfigHandler = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid tax configuration id' })
    }

    const deleted = await taxService.remove(id)
    await audit(
      req as AuthRequest,
      'PRODUCT_SETUP',
      'TAX_CONFIG_DELETED',
      `Deleted Tax Configuration ${deleted.taxId}`,
    )

    return res.status(200).json({
      success: true,
      message: 'Tax configuration deleted successfully',
      data: deleted,
    })
  } catch (error) {
    return handleError(error, res)
  }
}

export const calculateProductTaxHandler = async (req: Request, res: Response) => {
  try {
    const taxableAmount = Number(req.body.taxableAmount)
    const transactionType = req.body.transactionType

    if (!Number.isFinite(taxableAmount) || taxableAmount < 0) {
      return res.status(400).json({ success: false, message: 'Valid taxableAmount >= 0 is required' })
    }

    if (transactionType !== 'intra_state' && transactionType !== 'inter_state') {
      return res.status(400).json({
        success: false,
        message: 'transactionType must be "intra_state" or "inter_state"',
      })
    }

    let validatedGstRate: number | undefined
    if (req.body.gstRate !== undefined && req.body.gstRate !== null && String(req.body.gstRate).trim() !== '') {
      const check = validatePercentageRate(req.body.gstRate, 'GST %', { required: true })
      if (!check.valid) return res.status(400).json({ success: false, message: check.error })
      validatedGstRate = check.value
    }

    let validatedCess: number | undefined
    if (req.body.cessRate !== undefined && req.body.cessRate !== null && String(req.body.cessRate).trim() !== '') {
      const check = validatePercentageRate(req.body.cessRate, 'CESS %', {
        required: false,
        defaultValue: 0,
      })
      if (!check.valid) return res.status(400).json({ success: false, message: check.error })
      validatedCess = check.value
    }

    const data = await taxService.calculateTaxForProduct({
      taxConfigId: req.body.taxConfigId !== undefined ? Number(req.body.taxConfigId) : undefined,
      hsnCode: typeof req.body.hsnCode === 'string' ? req.body.hsnCode : undefined,
      gstRate: validatedGstRate,
      cessRate: validatedCess,
      taxableAmount,
      transactionType,
    })

    return res.status(200).json({
      success: true,
      message: 'Product tax calculated successfully',
      data,
    })
  } catch (error) {
    return handleError(error, res)
  }
}

