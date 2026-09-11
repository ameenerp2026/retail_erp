// Frontend copy of the shapes returned by POST /import/preview and POST /import.
// Kept in sync with the backend's src/.../types/Ledgerimport.types.ts by hand —
// frontend and backend are separate builds, so this isn't a shared import.

export type LedgerRowStatus = 'valid' | 'warning' | 'error'

export type LedgerFieldIssues = Partial<
  Record<
    'ledgerName' | 'accountGroup' | 'accountClass' | 'balanceType' | 'openingBalance' | 'orgUnit' | 'gstApplicable',
    string
  >
>

export type LedgerRowPreview = {
  row: number
  ledgerName: string
  accountGroup: string
  accountClass: string
  balanceType: string
  openingBalance: number
  status: LedgerRowStatus
  fieldIssues: LedgerFieldIssues
}

export type LedgerImportPreview = {
  rows: LedgerRowPreview[]
  summary: {
    valid: number
    warning: number
    error: number
  }
}

export type SkippedRow = {
  row: number | null
  ledgerName: string
  errors: string[]
}

export type LedgerImportResult = {
  totalRows: number
  importedCount: number
  skippedCount: number
  skipped: SkippedRow[]
}