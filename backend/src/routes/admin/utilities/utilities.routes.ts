import express, { Request, Response } from 'express'
import ExcelJS from 'exceljs'
import { authMiddleware } from '../../../middleware/auth.middleware.js'

const router = express.Router()
router.use(authMiddleware)

// Map import type -> actual filename on disk (don't trust the URL param directly)
const TEMPLATE_FILES = {
  ledgers: 'ledgers-template.xlsx',
  subledgers: 'subledgers-template.xlsx',
  vendors: 'vendors-template.xlsx',
  customers: 'customers-template.xlsx',
} as const

type ImportType = keyof typeof TEMPLATE_FILES

const IMPORT_TYPES = Object.entries(TEMPLATE_FILES)
  .filter(([value]) => value === 'ledgers' || value === 'subledgers')
  .map(([value, fileName]) => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1),
    templateTitle: `${value.charAt(0).toUpperCase() + value.slice(1)} Sample Template`,
    templateDescription: `Download the pre-formatted template to import ${value} data`,
    templateUrl: `/api/utilities/templates/${value}`,
    templateFileName: fileName,
    importUrl: `/api/utilities/${value}/import`,
    // Read-only validation pass on the same router (see ledger import router's
    // POST /import/preview, mounted alongside POST /import at this base).
    previewUrl: `/api/utilities/${value}/import/preview`,
  }))

function isImportType(value: unknown): value is ImportType {
  return typeof value === 'string' && value in TEMPLATE_FILES
}

router.get('/data-import', (_req: Request, res: Response) => {
  return res.json({ importTypes: IMPORT_TYPES })
})

router.get('/templates/:type', async (req: Request, res: Response) => {
  const { type } = req.params

  if (!isImportType(type)) {
    return res.status(404).json({
      message: 'Unknown template type',
    })
  }

  if (type === 'ledgers') {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Ledgers')

    worksheet.mergeCells('A1:G1')
    worksheet.getCell('A1').value =
      'Instructions: Fields marked with * are required. Balance Type must be Debit or Credit. GST Applicable must be Yes or No.'
    worksheet.getCell('A1').alignment = { vertical: 'middle', wrapText: true }
    worksheet.getRow(1).height = 40

    worksheet.addRow([
      'Ledger Name *',
      'Account Group *',
      'Account Class *',
      'Balance Type *',
      'Opening Balance',
      'Org Unit',
      'GST Applicable',
    ])

    worksheet.addRow(['Cash Account', 'Current Assets', 'Cash', 'Debit', 10000, 'Main Unit', 'No'])

    worksheet.getRow(2).font = { bold: true }
    worksheet.columns = [
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 20 },
      { width: 20 },
      { width: 25 },
      { width: 20 },
    ]

    const buffer = await workbook.xlsx.writeBuffer()
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader('Content-Disposition', `attachment; filename="${TEMPLATE_FILES[type]}"`)
    return res.send(buffer)
  }

  if (type === 'subledgers') {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Sub Ledgers')

    worksheet.mergeCells('A1:G1')
    worksheet.getCell('A1').value =
      'Instructions: Fields marked with * are required. Linked Ledger and Type must match existing records exactly. Balance Type must be Debit or Credit. Status must be Active or Inactive.'
    worksheet.getCell('A1').alignment = { vertical: 'middle', wrapText: true }
    worksheet.getRow(1).height = 40

    worksheet.addRow([
      'Sub Ledger Name *',
      'Linked Ledger *',
      'Type *',
      'Opening Balance',
      'Balance Type',
      'Credit Limit',
      'Status',
    ])

    worksheet.addRow([
      'Reliance Retail Ltd',
      'Sundry Debtors',
      'Customer',
      5000,
      'Debit',
      50000,
      'Active',
    ])

    worksheet.getRow(2).font = { bold: true }
    worksheet.columns = [
      { width: 28 },
      { width: 22 },
      { width: 18 },
      { width: 18 },
      { width: 16 },
      { width: 18 },
      { width: 14 },
    ]

    const buffer = await workbook.xlsx.writeBuffer()
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader('Content-Disposition', `attachment; filename="${TEMPLATE_FILES[type]}"`)
    return res.send(buffer)
  }

  return res.status(501).json({
    message: `${type} template generation is not implemented yet`,
  })
})

export default router