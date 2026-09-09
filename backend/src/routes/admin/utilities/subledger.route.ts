import { Router, Request, Response } from 'express'
import multer from 'multer'
import ExcelJS from 'exceljs'
import type {
  SubLedgerImportResult,
  SubLedgerImportPreview,
  SubLedgerRowPreview,
  SubLedgerFieldIssues,
  SkippedRow,
} from '../../../types/Subledgerimport.types.js'
import prisma from '../../../config/prisma.js'
import { authMiddleware } from '../../../middleware/auth.middleware.js'
// NOTE: adjust this path to wherever subLedgerService actually lives in your project.
import { subLedgerService } from '../../../services/admin/finance/SubLedger.service.js'

const router = Router()
router.use(authMiddleware)

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
})

// Must match the template's header row exactly (row 2 — see FIRST_POSSIBLE_DATA_ROW below for how row 3 is handled)
const EXPECTED_HEADERS = [
  'Sub Ledger Name *',
  'Linked Ledger *',
  'Type *',
  'Opening Balance',
  'Balance Type',
  'Credit Limit',
  'Status',
] as const

// Row 1 is the instructions legend, row 2 is headers, row 3 is a filled-in
// EXAMPLE row baked into the generated template (see the /templates/subledgers
// route: 'Reliance Retail Ltd', 'Sundry Debtors', 'Customer', 5000, 'Debit', 50000, 'Active').
// Same overwrite-the-sample-row problem as the ledger import: only treat row 3
// as "the sample" if it still matches those exact original values.
const SAMPLE_ROW_VALUES = ['Reliance Retail Ltd', 'Sundry Debtors', 'Customer', 5000, 'Debit', 50000, 'Active']
const FIRST_POSSIBLE_DATA_ROW = 3

const VALID_RECORD_STATUSES = ['active', 'inactive'] as const

type LedgerLookup = { id: number; ledgerName: string }
type SubLedgerTypeLookup = { id: number; typeName: string }
type ExistingSubLedgerLookup = { subLedgerName: string; ledgerId: number }

function norm(value: ExcelJS.CellValue): string | number | null {
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number') return value
  return null
}

type Lookups = {
  ledgerByName: Map<string, LedgerLookup>
  typeByName: Map<string, SubLedgerTypeLookup>
  existingKeys: Set<string>
}

type RowPlan = {
  row: number
  subLedgerName: string
  linkedLedgerDisplay: string
  typeDisplay: string
  balanceTypeDisplay: string
  openingBalance: number
  creditLimit: number | null
  recordStatusDisplay: string
  status: 'valid' | 'warning' | 'error'
  fieldIssues: SubLedgerFieldIssues
  resolved: {
    ledgerId: number
    subLedgerTypeId: number
    balanceType: 'debit' | 'credit'
    creditLimit: number | null
    recordStatus: 'active' | 'inactive'
  } | null
}

async function loadLookups(): Promise<Lookups> {
  const [ledgers, subLedgerTypes, existingSubLedgers] = await Promise.all([
    prisma.ledger.findMany({ select: { id: true, ledgerName: true } }),
    prisma.subLedgerType.findMany({ select: { id: true, typeName: true } }),
    prisma.subLedger.findMany({ select: { subLedgerName: true, ledgerId: true } }),
  ])

  const ledgerByName = new Map<string, LedgerLookup>(
    (ledgers as LedgerLookup[]).map((l) => [l.ledgerName.toLowerCase(), l])
  )
  const typeByName = new Map<string, SubLedgerTypeLookup>(
    (subLedgerTypes as SubLedgerTypeLookup[]).map((t) => [t.typeName.toLowerCase(), t])
  )
  const existingKeys = new Set(
    (existingSubLedgers as ExistingSubLedgerLookup[]).map(
      (s) => `${s.subLedgerName.toLowerCase()}::${s.ledgerId}`
    )
  )

  return { ledgerByName, typeByName, existingKeys }
}

async function parseWorkbook(buffer: Buffer): Promise<ExcelJS.Worksheet> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer as unknown as Parameters<typeof workbook.xlsx.load>[0])
  const sheet = workbook.worksheets[0]
  if (!sheet) throw new Error('NO_SHEETS')
  return sheet
}

function buildColIndex(sheet: ExcelJS.Worksheet): Record<string, number> {
  const headerRow = sheet.getRow(2)
  const headers = (headerRow.values as ExcelJS.CellValue[]).slice(1).map((v) => norm(v))
  const missing = EXPECTED_HEADERS.filter((h) => !headers.includes(h))
  if (missing.length > 0) {
    throw new Error(`MISSING_COLUMNS:${missing.join(', ')}`)
  }
  const colIndex: Record<string, number> = {}
  headers.forEach((h, idx) => {
    if (typeof h === 'string') colIndex[h] = idx + 1
  })
  return colIndex
}

function isUntouchedSampleRow(sheet: ExcelJS.Worksheet, colIndex: Record<string, number>): boolean {
  const row = sheet.getRow(FIRST_POSSIBLE_DATA_ROW)
  return EXPECTED_HEADERS.every((header, i) => {
    const cellValue = norm(row.getCell(colIndex[header]).value)
    return cellValue === SAMPLE_ROW_VALUES[i]
  })
}

/**
 * Builds a row plan: what to display in the preview, and (if not 'error')
 * what to actually insert on commit. Duplicate detection uses `seenInFile`,
 * which the caller must share across all rows in the same request.
 */
function buildRowPlan(
  rowNum: number,
  get: (header: string) => string | number | null,
  lookups: Lookups,
  seenInFile: Set<string>
): RowPlan | null {
  const subLedgerName = get('Sub Ledger Name *')
  const linkedLedgerName = get('Linked Ledger *')
  const typeName = get('Type *')
  const openingRaw = get('Opening Balance')
  const balanceRaw = get('Balance Type')
  const creditLimitRaw = get('Credit Limit')
  const recordStatusRaw = get('Status')

  if (!subLedgerName && !linkedLedgerName && !typeName) return null // blank row, not shown at all

  const fieldIssues: SubLedgerFieldIssues = {}
  let hasError = false
  let hasWarning = false

  // Sub Ledger Name
  if (!subLedgerName) {
    fieldIssues.subLedgerName = 'Sub Ledger Name is required'
    hasError = true
  } else if (String(subLedgerName).length > 150) {
    fieldIssues.subLedgerName = 'Sub Ledger Name exceeds 150 characters'
    hasError = true
  }

  // Linked Ledger — must match an existing Ledger by name
  const ledger = linkedLedgerName ? lookups.ledgerByName.get(String(linkedLedgerName).toLowerCase()) : undefined
  if (!linkedLedgerName) {
    fieldIssues.linkedLedger = 'Linked Ledger is required'
    hasError = true
  } else if (!ledger) {
    fieldIssues.linkedLedger = `Linked Ledger "${linkedLedgerName}" does not exist`
    hasError = true
  }

  // Type — must match an existing SubLedgerType by name
  const subLedgerType = typeName ? lookups.typeByName.get(String(typeName).toLowerCase()) : undefined
  if (!typeName) {
    fieldIssues.type = 'Type is required'
    hasError = true
  } else if (!subLedgerType) {
    fieldIssues.type = `Type "${typeName}" does not exist`
    hasError = true
  }

  // Balance Type — optional, defaults to 'debit' same as createSubLedger's own default
  let balanceType: 'debit' | 'credit' = 'debit'
  if (balanceRaw) {
    const bt = String(balanceRaw).trim().toLowerCase()
    if (bt === 'debit' || bt === 'credit') balanceType = bt as 'debit' | 'credit'
    else {
      fieldIssues.balanceType = 'Balance Type must be "Debit" or "Credit" — defaulted to Debit'
      hasWarning = true
    }
  }

  // Opening Balance — optional, non-numeric demoted to a warning, defaults to 0
  let openingBalance = 0
  if (openingRaw !== null && openingRaw !== undefined && openingRaw !== '') {
    const n = Number(openingRaw)
    if (Number.isNaN(n)) {
      fieldIssues.openingBalance = 'Opening Balance is not a number — defaulted to 0'
      hasWarning = true
    } else {
      openingBalance = n
    }
  }

  // Credit Limit — optional, non-numeric demoted to a warning, defaults to null (no limit)
  let creditLimit: number | null = null
  if (creditLimitRaw !== null && creditLimitRaw !== undefined && creditLimitRaw !== '') {
    const n = Number(creditLimitRaw)
    if (Number.isNaN(n)) {
      fieldIssues.creditLimit = 'Credit Limit is not a number — defaulted to no limit'
      hasWarning = true
    } else {
      creditLimit = n
    }
  }

  // Status — optional, invalid value demoted to a warning, defaults to 'active' same as createSubLedger
  let recordStatus: 'active' | 'inactive' = 'active'
  if (recordStatusRaw) {
    const s = String(recordStatusRaw).trim().toLowerCase()
    if ((VALID_RECORD_STATUSES as readonly string[]).includes(s)) {
      recordStatus = s as 'active' | 'inactive'
    } else {
      fieldIssues.recordStatus = 'Status must be "Active" or "Inactive" — defaulted to Active'
      hasWarning = true
    }
  }

  // Duplicate check — only meaningful once we know the linked ledger
  if (ledger && subLedgerName) {
    const key = `${String(subLedgerName).toLowerCase()}::${ledger.id}`
    if (lookups.existingKeys.has(key)) {
      fieldIssues.subLedgerName = `Sub Ledger "${subLedgerName}" already exists under "${linkedLedgerName}"`
      hasError = true
    } else if (seenInFile.has(key)) {
      fieldIssues.subLedgerName = `Duplicate row: "${subLedgerName}" under "${linkedLedgerName}" repeated in this file`
      hasError = true
    } else {
      seenInFile.add(key)
    }
  }

  const status: 'valid' | 'warning' | 'error' = hasError ? 'error' : hasWarning ? 'warning' : 'valid'

  const resolved =
    status !== 'error' && ledger && subLedgerType
      ? {
          ledgerId: ledger.id,
          subLedgerTypeId: subLedgerType.id,
          balanceType,
          creditLimit,
          recordStatus,
        }
      : null

  return {
    row: rowNum,
    subLedgerName: (subLedgerName as string) ?? '',
    linkedLedgerDisplay: linkedLedgerName ? String(linkedLedgerName) : '',
    typeDisplay: typeName ? String(typeName) : '',
    balanceTypeDisplay: balanceRaw ? String(balanceRaw) : 'Debit',
    openingBalance,
    creditLimit,
    recordStatusDisplay: recordStatusRaw ? String(recordStatusRaw) : 'Active',
    status,
    fieldIssues,
    resolved,
  }
}

function loadFileAndBuildPlans(buffer: Buffer, lookups: Lookups) {
  return parseWorkbook(buffer).then((sheet) => {
    const colIndex = buildColIndex(sheet)
    const dataStartRow = isUntouchedSampleRow(sheet, colIndex)
      ? FIRST_POSSIBLE_DATA_ROW + 1
      : FIRST_POSSIBLE_DATA_ROW
    const plans: RowPlan[] = []
    const seenInFile = new Set<string>()

    for (let rowNum = dataStartRow; rowNum <= sheet.rowCount; rowNum++) {
      const row = sheet.getRow(rowNum)
      const get = (header: string) => norm(row.getCell(colIndex[header]).value)
      const plan = buildRowPlan(rowNum, get, lookups, seenInFile)
      if (plan) plans.push(plan)
    }
    return plans
  })
}

function handleParseError(err: unknown, res: Response) {
  const message = err instanceof Error ? err.message : ''
  if (message === 'NO_SHEETS') {
    return res.status(400).json({ message: 'The uploaded file has no sheets.' })
  }
  if (message.startsWith('MISSING_COLUMNS:')) {
    return res.status(400).json({
      message: `File doesn't match the expected template. Missing columns: ${message.split(':')[1]}.`,
    })
  }
  return res.status(400).json({ message: 'Could not read the file. Please upload a valid .xlsx.' })
}

// Turns a plan's resolved fields into the input shape subLedgerService.createSubLedger expects.
// Note: createSubLedger takes `type` as a typeName string and re-resolves it itself
// (resolveSubLedgerTypeId), so we pass the display name through rather than the id
// we already resolved — keeps this call identical to what the manual create form sends.
function toCreateSubLedgerInput(plan: RowPlan) {
  return {
    subLedgerName: plan.subLedgerName,
    ledgerId: plan.resolved!.ledgerId,
    type: plan.typeDisplay,
    balanceType: plan.resolved!.balanceType,
    openingBalance: plan.openingBalance,
    creditLimit: plan.resolved!.creditLimit,
    status: plan.resolved!.recordStatus,
  }
}

// Maps errors thrown by subLedgerService.createSubLedger to a human-readable skip reason,
// mirroring the same codes createSubLedgerHandler branches on.
function describeCreateError(err: unknown): string {
  const code = typeof err === 'object' && err !== null && 'code' in err ? (err as { code?: string }).code : undefined
  if (code === 'P2002') return 'This name already exists under the selected ledger'
  if (code === 'P2003') return 'One of the referenced records does not exist'
  if (code === 'INVALID_LEDGER') return 'Selected Linked Ledger does not exist'
  if (code === 'INVALID_TYPE') return 'Selected Type does not exist'
  return 'Could not save this row'
}

// Read-only: validates the file and returns a per-row preview. No DB writes.
router.post('/import/preview', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' })
  }

  let plans: RowPlan[]
  try {
    const lookups = await loadLookups()
    plans = await loadFileAndBuildPlans(req.file.buffer, lookups)
  } catch (err) {
    return handleParseError(err, res)
  }

  const rows: SubLedgerRowPreview[] = plans.map((p) => ({
    row: p.row,
    subLedgerName: p.subLedgerName,
    linkedLedger: p.linkedLedgerDisplay,
    type: p.typeDisplay,
    balanceType: p.balanceTypeDisplay,
    openingBalance: p.openingBalance,
    creditLimit: p.creditLimit,
    recordStatus: p.recordStatusDisplay,
    status: p.status,
    fieldIssues: p.fieldIssues,
  }))

  const summary = {
    valid: rows.filter((r) => r.status === 'valid').length,
    warning: rows.filter((r) => r.status === 'warning').length,
    error: rows.filter((r) => r.status === 'error').length,
  }

  const result: SubLedgerImportPreview = { rows, summary }
  return res.json(result)
})

// Commit: re-validates the same file, then creates every row that isn't 'error'
// through the same subLedgerService.createSubLedger used by the manual create
// flow, so imports get identical validation and audit fields as a hand-typed row.
router.post('/import', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' })
  }

  let plans: RowPlan[]
  try {
    const lookups = await loadLookups()
    plans = await loadFileAndBuildPlans(req.file.buffer, lookups)
  } catch (err) {
    return handleParseError(err, res)
  }

  const skipped: SkippedRow[] = plans
    .filter((p) => p.status === 'error')
    .map((p) => ({
      row: p.row,
      subLedgerName: p.subLedgerName || '(blank)',
      errors: Object.values(p.fieldIssues).filter((v): v is string => Boolean(v)),
    }))

  const toCreate = plans.filter((p) => p.status !== 'error' && p.resolved)
  const userId = (req as any).user?.id

  let importedCount = 0
  for (const plan of toCreate) {
    try {
      await subLedgerService.createSubLedger(toCreateSubLedgerInput(plan), userId)
      importedCount++
    } catch (err) {
      skipped.push({ row: plan.row, subLedgerName: plan.subLedgerName, errors: [describeCreateError(err)] })
    }
  }

  const result: SubLedgerImportResult = {
    totalRows: plans.length,
    importedCount,
    skippedCount: skipped.length,
    skipped,
  }

  return res.json(result)
})

export default router