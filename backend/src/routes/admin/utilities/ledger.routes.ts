import { Router, Request, Response } from 'express'
import multer from 'multer'
import ExcelJS from 'exceljs'
import type {
  LedgerImportResult,
  LedgerImportPreview,
  LedgerRowPreview,
  LedgerFieldIssues,
  SkippedRow,
} from '../../../types/Ledgerimport.types.js'
import prisma from '../../../config/prisma.js'
import { authMiddleware } from '../../../middleware/auth.middleware.js'
// NOTE: adjust this path to wherever ledgerService actually lives in your
// project (the same module createLedgerHandler imports from).
import { ledgerService } from '../../../services/admin/finance/Ledger.service.js'

const router = Router()
router.use(authMiddleware)

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
})

// Must match the template's header row exactly (row 2 — see FIRST_POSSIBLE_DATA_ROW below for how row 3 is handled)
const EXPECTED_HEADERS = [
  'Ledger Name *',
  'Account Group *',
  'Account Class *',
  'Balance Type *',
  'Opening Balance',
  'Org Unit',
  'GST Applicable',
] as const

// Row 1 is the instructions legend, row 2 is headers, row 3 is a filled-in
// EXAMPLE row baked into the generated template (see the /templates/ledgers
// route: 'Cash Account', 'Current Assets', 'Cash', 'Debit', 10000, 'Main Unit', 'No').
// Users are meant to add their own rows below it — but nothing stops someone
// from just overwriting that row with real data instead, and if we blindly
// always skip row 3 their only row silently vanishes. So we only treat row 3
// as "the sample" if it still matches those exact original values.
const SAMPLE_ROW_VALUES = ['Cash Account', 'Current Assets', 'Cash', 'Debit', 10000, 'Main Unit', 'No']
const HEADER_ROW = 2
const FIRST_POSSIBLE_DATA_ROW = 3

function isUntouchedSampleRow(sheet: ExcelJS.Worksheet, colIndex: Record<string, number>): boolean {
  const row = sheet.getRow(FIRST_POSSIBLE_DATA_ROW)
  return EXPECTED_HEADERS.every((header, i) => {
    const cellValue = norm(row.getCell(colIndex[header]).value)
    return cellValue === SAMPLE_ROW_VALUES[i]
  })
}

type AccountGroupLookup = { id: number; rootGroupName: string }
type AccountClassLookup = { id: number; className: string; accountGroupId: number }
type OrganizationUnitLookup = { id: number; organizationUnit: string }
type LedgerLookup = { ledgerName: string; accountClassId: number }

function norm(value: ExcelJS.CellValue): string | number | null {
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number') return value
  return null
}

type Lookups = {
  groupByName: Map<string, AccountGroupLookup>
  classByName: Map<string, AccountClassLookup>
  orgUnitByName: Map<string, OrganizationUnitLookup>
  existingKeys: Set<string>
}

type RowPlan = {
  row: number
  ledgerName: string
  accountGroupDisplay: string
  accountClassDisplay: string
  balanceTypeDisplay: string
  openingBalance: number
  status: 'valid' | 'warning' | 'error'
  fieldIssues: LedgerFieldIssues
  resolved: {
    accountClassId: number
    accountGroupId: number
    balanceType: 'debit' | 'credit'
    organizationUnitId: number | null
    gstApplicable: boolean
  } | null
}

async function loadLookups(): Promise<Lookups> {
  const [accountGroups, accountClasses, orgUnits, existingLedgers] = await Promise.all([
    prisma.accountGroup.findMany({ select: { id: true, rootGroupName: true } }),
    prisma.accountClass.findMany({ select: { id: true, className: true, accountGroupId: true } }),
    prisma.organizationUnit.findMany({ select: { id: true, organizationUnit: true } }),
    prisma.ledger.findMany({ select: { ledgerName: true, accountClassId: true } }),
  ])

  const groupByName = new Map<string, AccountGroupLookup>(
    (accountGroups as AccountGroupLookup[]).map((g) => [g.rootGroupName.toLowerCase(), g])
  )
  const classByName = new Map<string, AccountClassLookup>(
    (accountClasses as AccountClassLookup[]).map((c) => [c.className.toLowerCase(), c])
  )
  const orgUnitByName = new Map<string, OrganizationUnitLookup>(
    (orgUnits as OrganizationUnitLookup[]).map((o) => [o.organizationUnit.toLowerCase(), o])
  )
  const existingKeys = new Set(
    (existingLedgers as LedgerLookup[]).map((l) => `${l.ledgerName.toLowerCase()}::${l.accountClassId}`)
  )

  return { groupByName, classByName, orgUnitByName, existingKeys }
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
  const ledgerName = get('Ledger Name *')
  const groupName = get('Account Group *')
  const className = get('Account Class *')
  const balanceRaw = get('Balance Type *')
  const openingRaw = get('Opening Balance')
  const orgUnitName = get('Org Unit')
  const gstRaw = get('GST Applicable')

  if (!ledgerName && !groupName && !className) return null // blank row, not shown at all

  const fieldIssues: LedgerFieldIssues = {}
  let hasError = false
  let hasWarning = false

  // Ledger Name
  if (!ledgerName) {
    fieldIssues.ledgerName = 'Ledger Name is required'
    hasError = true
  } else if (String(ledgerName).length > 150) {
    fieldIssues.ledgerName = 'Ledger Name exceeds 150 characters'
    hasError = true
  }

  // Account Group
  const group = groupName ? lookups.groupByName.get(String(groupName).toLowerCase()) : undefined
  if (!groupName) {
    fieldIssues.accountGroup = 'Account Group is required'
    hasError = true
  } else if (!group) {
    fieldIssues.accountGroup = `Account Group "${groupName}" does not exist`
    hasError = true
  }

  // Account Class
  const cls = className ? lookups.classByName.get(String(className).toLowerCase()) : undefined
  if (!className) {
    fieldIssues.accountClass = 'Account Class is required'
    hasError = true
  } else if (!cls) {
    fieldIssues.accountClass = `Account Class "${className}" does not exist`
    hasError = true
  }

  // Group/Class relationship — demoted to a warning, auto-resolved using the class's real group.
  // This resolution is what keeps ledgerService.createLedger's own mismatch
  // check from firing later: we always pass it a (accountClassId, accountGroupId)
  // pair that's already consistent.
  let resolvedAccountGroupId: number | null = group ? group.id : null
  if (cls && group && cls.accountGroupId !== group.id) {
    fieldIssues.accountClass = `Account Class "${className}" actually belongs to a different Account Group than "${groupName}" — imported under its real group`
    resolvedAccountGroupId = cls.accountGroupId
    hasWarning = true
  } else if (cls && !group) {
    resolvedAccountGroupId = cls.accountGroupId
  }

  // Balance Type — required, no sensible default
  let balanceType: 'debit' | 'credit' | null = null
  if (!balanceRaw) {
    fieldIssues.balanceType = 'Balance Type is required'
    hasError = true
  } else {
    const bt = String(balanceRaw).trim().toLowerCase()
    if (bt === 'debit' || bt === 'credit') balanceType = bt
    else {
      fieldIssues.balanceType = 'Balance Type must be "Debit" or "Credit"'
      hasError = true
    }
  }

  // Opening Balance — non-numeric demoted to a warning, defaults to 0
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

  // Org Unit — not found demoted to a warning, ledger created without one
  let organizationUnitId: number | null = null
  if (orgUnitName) {
    const unit = lookups.orgUnitByName.get(String(orgUnitName).toLowerCase())
    if (!unit) {
      fieldIssues.orgUnit = `Org Unit "${orgUnitName}" does not exist — ledger will have no Org Unit`
      hasWarning = true
    } else {
      organizationUnitId = unit.id
    }
  }

  // GST Applicable — invalid value demoted to a warning, defaults to No
  let gstApplicable = false
  if (gstRaw) {
    const g = String(gstRaw).trim().toLowerCase()
    if (g === 'yes') gstApplicable = true
    else if (g === 'no') gstApplicable = false
    else {
      fieldIssues.gstApplicable = 'GST Applicable must be "Yes" or "No" — defaulted to No'
      hasWarning = true
    }
  }

  // Duplicate check — only meaningful once we know the class
  if (cls && ledgerName) {
    const key = `${String(ledgerName).toLowerCase()}::${cls.id}`
    if (lookups.existingKeys.has(key)) {
      fieldIssues.ledgerName = `Ledger "${ledgerName}" already exists under "${className}"`
      hasError = true
    } else if (seenInFile.has(key)) {
      fieldIssues.ledgerName = `Duplicate row: "${ledgerName}" under "${className}" repeated in this file`
      hasError = true
    } else {
      seenInFile.add(key)
    }
  }

  const status: 'valid' | 'warning' | 'error' = hasError ? 'error' : hasWarning ? 'warning' : 'valid'

  const resolved =
    status !== 'error' && cls && resolvedAccountGroupId && balanceType
      ? {
          accountClassId: cls.id,
          accountGroupId: resolvedAccountGroupId,
          balanceType,
          organizationUnitId,
          gstApplicable,
        }
      : null

  return {
    row: rowNum,
    ledgerName: (ledgerName as string) ?? '',
    accountGroupDisplay: groupName ? String(groupName) : '',
    accountClassDisplay: className ? String(className) : '',
    balanceTypeDisplay: balanceRaw ? String(balanceRaw) : '',
    openingBalance,
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

// Turns a plan's resolved fields into the exact input shape ledgerService.createLedger expects.
function toCreateLedgerInput(plan: RowPlan) {
  return {
    ledgerName: plan.ledgerName,
    accountClassId: plan.resolved!.accountClassId,
    accountGroupId: plan.resolved!.accountGroupId,
    balanceType: plan.resolved!.balanceType,
    openingBalance: plan.openingBalance,
    organizationUnitId: plan.resolved!.organizationUnitId,
    gstApplicable: plan.resolved!.gstApplicable,
    status: 'active',
  }
}

// Maps errors thrown by ledgerService.createLedger to a human-readable skip reason.
// Mirrors the same codes createLedgerHandler branches on, so a row skipped
// during import reads the same way a rejected manual create would.
function describeCreateError(err: unknown): string {
  const code = typeof err === 'object' && err !== null && 'code' in err ? (err as { code?: string }).code : undefined
  if (code === 'P2002') return 'Duplicate ledger name within this account class'
  if (code === 'P2003') return 'One of the referenced records (Account Group, Account Class, Org Unit) does not exist'
  if (code === 'MISMATCHED_GROUP_CLASS') {
    return 'Selected Account Class does not belong to the selected Account Group'
  }
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

  const rows: LedgerRowPreview[] = plans.map((p) => ({
    row: p.row,
    ledgerName: p.ledgerName,
    accountGroup: p.accountGroupDisplay,
    accountClass: p.accountClassDisplay,
    balanceType: p.balanceTypeDisplay,
    openingBalance: p.openingBalance,
    status: p.status,
    fieldIssues: p.fieldIssues,
  }))

  const summary = {
    valid: rows.filter((r) => r.status === 'valid').length,
    warning: rows.filter((r) => r.status === 'warning').length,
    error: rows.filter((r) => r.status === 'error').length,
  }

  const result: LedgerImportPreview = { rows, summary }
  return res.json(result)
})

// Commit: re-validates the same file, then creates every row that isn't 'error'
// through the same ledgerService.createLedger used by the manual create-ledger
// flow — so imported rows get a real generated ledgerCode, the same
// account-class/group consistency check, and the same createdBy/updatedBy
// audit trail as a row typed in by hand.
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
      ledgerName: p.ledgerName || '(blank)',
      errors: Object.values(p.fieldIssues).filter((v): v is string => Boolean(v)),
    }))

  const toCreate = plans.filter((p) => p.status !== 'error' && p.resolved)
  const userId = (req as any).user?.id

  let importedCount = 0
  for (const plan of toCreate) {
    try {
      await ledgerService.createLedger(toCreateLedgerInput(plan), userId)
      importedCount++
    } catch (err) {
      skipped.push({ row: plan.row, ledgerName: plan.ledgerName, errors: [describeCreateError(err)] })
    }
  }

  const result: LedgerImportResult = {
    totalRows: plans.length,
    importedCount,
    skippedCount: skipped.length,
    skipped,
  }

  return res.json(result)
})

export default router