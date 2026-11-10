export type SupplyTransactionScope = 'intra_state' | 'inter_state'

export interface GstComponents {
  gstRate: number
  cgst: number
  sgst: number
  igst: number
}

export interface ProductTaxCalculationInput {
  taxableAmount: number
  gstRate: number
  cessRate?: number
  transactionType: SupplyTransactionScope
}

export interface ProductTaxCalculationResult {
  taxableAmount: number
  gstRate: number
  cessRate: number
  transactionType: SupplyTransactionScope
  cgstRate: number
  sgstRate: number
  igstRate: number
  cgstAmount: number
  sgstAmount: number
  igstAmount: number
  gstAmount: number
  cessAmount: number
  totalTaxAmount: number
  totalAmount: number
}

/** Round a finite number to `decimals` decimal places without floating-point artifacts. */
export function roundGstPrecision(value: number, decimals = 2): number {
  if (!Number.isFinite(value)) return 0
  const factor = 10 ** decimals
  return Math.round((value + Number.EPSILON) * factor) / factor
}

/** Validate a GST or CESS percentage (non-negative, finite, 0..100, up to 2 decimal places). */
export function validatePercentageRate(
  rawValue: unknown,
  fieldLabel: string,
  options: { required?: boolean; defaultValue?: number } = {},
): { valid: true; value: number } | { valid: false; error: string } {
  const { required = true, defaultValue = 0 } = options

  if (rawValue === undefined || rawValue === null || String(rawValue).trim() === '') {
    if (required) {
      return { valid: false, error: `${fieldLabel} is required` }
    }
    return { valid: true, value: defaultValue }
  }

  const str = String(rawValue).trim()

  if (str.startsWith('-')) {
    return { valid: false, error: `${fieldLabel} cannot be negative` }
  }

  if (!/^\d+(\.\d+)?$/.test(str)) {
    return { valid: false, error: `${fieldLabel} must be a valid number` }
  }

  const parts = str.split('.')
  if (parts[1] && parts[1].length > 2) {
    return { valid: false, error: `${fieldLabel} supports at most 2 decimal places` }
  }

  const parsed = Number(str)
  if (!Number.isFinite(parsed) || Number.isNaN(parsed)) {
    return { valid: false, error: `${fieldLabel} must be a valid number` }
  }

  if (parsed < 0) {
    return { valid: false, error: `${fieldLabel} cannot be negative` }
  }

  if (parsed > 100) {
    return { valid: false, error: `${fieldLabel} cannot exceed 100%` }
  }

  return { valid: true, value: roundGstPrecision(parsed, 2) }
}

/**
 * Derive CGST, SGST, and IGST purely from `gstRate`:
 * - CGST = GST / 2
 * - SGST = GST / 2
 * - IGST = GST
 */
export function deriveGstComponents(
  gstRateInput: number | string | null | undefined,
): GstComponents {
  if (gstRateInput === null || gstRateInput === undefined || gstRateInput === '') {
    return { gstRate: 0, cgst: 0, sgst: 0, igst: 0 }
  }

  const parsed = typeof gstRateInput === 'number' ? gstRateInput : Number(String(gstRateInput).trim())
  if (!Number.isFinite(parsed) || Number.isNaN(parsed) || parsed < 0) {
    return { gstRate: 0, cgst: 0, sgst: 0, igst: 0 }
  }

  const gstRate = roundGstPrecision(parsed, 2)
  const half = roundGstPrecision(gstRate / 2, 3)

  return {
    gstRate,
    cgst: half,
    sgst: half,
    igst: gstRate,
  }
}

/**
 * Calculate product tax amounts using GST rules:
 * - Intra-state: apply CGST + SGST (never IGST)
 * - Inter-state: apply IGST (never CGST/SGST)
 * - CESS: applied separately from GST components
 */
export function calculateProductTax(
  input: ProductTaxCalculationInput,
): ProductTaxCalculationResult {
  const taxableAmount = Number.isFinite(input.taxableAmount) && input.taxableAmount > 0
    ? roundGstPrecision(input.taxableAmount, 2)
    : 0
  const cessRate = Number.isFinite(input.cessRate) && (input.cessRate ?? 0) >= 0
    ? roundGstPrecision(input.cessRate ?? 0, 2)
    : 0
  const { gstRate, cgst, sgst, igst } = deriveGstComponents(input.gstRate)

  const isIntraState = input.transactionType === 'intra_state'

  const cgstRate = isIntraState ? cgst : 0
  const sgstRate = isIntraState ? sgst : 0
  const igstRate = isIntraState ? 0 : igst

  const cgstAmount = isIntraState ? roundGstPrecision((taxableAmount * cgstRate) / 100, 2) : 0
  const sgstAmount = isIntraState ? roundGstPrecision((taxableAmount * sgstRate) / 100, 2) : 0
  const igstAmount = isIntraState ? 0 : roundGstPrecision((taxableAmount * igstRate) / 100, 2)

  const gstAmount = roundGstPrecision(cgstAmount + sgstAmount + igstAmount, 2)
  const cessAmount = roundGstPrecision((taxableAmount * cessRate) / 100, 2)
  const totalTaxAmount = roundGstPrecision(gstAmount + cessAmount, 2)
  const totalAmount = roundGstPrecision(taxableAmount + totalTaxAmount, 2)

  return {
    taxableAmount,
    gstRate,
    cessRate,
    transactionType: input.transactionType,
    cgstRate,
    sgstRate,
    igstRate,
    cgstAmount,
    sgstAmount,
    igstAmount,
    gstAmount,
    cessAmount,
    totalTaxAmount,
    totalAmount,
  }
}

/** Normalize HSN/SAC strings (e.g. "8517 12 90" -> "85171290") for prefix/exact lookup. */
export function normalizeHsnCode(hsnSac: string): string {
  return hsnSac.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
}

