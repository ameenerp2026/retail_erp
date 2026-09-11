export type SubLedgerSkippedRow = {
  row: number | null
  subLedgerName: string
  errors: string[]
} & Record<string, unknown>

export type SubLedgerImportResult = {
  totalRows: number
  importedCount: number
  skippedCount: number
  skipped: SubLedgerSkippedRow[]
}

export type SubLedgerRowStatus = 'valid' | 'warning' | 'error'

export type SubLedgerFieldIssues = Partial<
  Record<
    | 'subLedgerName'
    | 'linkedLedger'
    | 'type'
    | 'balanceType'
    | 'openingBalance'
    | 'creditLimit'
    | 'status',
    string
  >
> &
  Record<string, string | undefined>

// Intersected with Record<string, unknown> so this structurally satisfies
// ImportRow (from '@/types/Importpreview') — same pattern as
// LedgerRowPreview, so it can be passed to ImportPreviewScreen directly
// once a /subledgers/import/preview route exists.
export type SubLedgerRowPreview = {
  row: number
  subLedgerName: string
  linkedLedger: string
  type: string
  balanceType: string
  openingBalance: number
  creditLimit: number | null
  status: SubLedgerRowStatus
  fieldIssues: SubLedgerFieldIssues
} & Record<string, unknown>

export type SubLedgerImportPreview = {
  rows: SubLedgerRowPreview[]
  summary: {
    valid: number
    warning: number
    error: number
  }
}