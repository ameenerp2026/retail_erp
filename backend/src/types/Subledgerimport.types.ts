export type SkippedRow = {
  row: number | null
  subLedgerName: string
  errors: string[]
}

export type SubLedgerImportResult = {
  totalRows: number
  importedCount: number
  skippedCount: number
  skipped: SkippedRow[]
}

export type SubLedgerRowStatus = 'valid' | 'warning' | 'error'

export type SubLedgerFieldIssues = Partial<
  Record<'subLedgerName' | 'linkedLedger' | 'type' | 'balanceType' | 'openingBalance' | 'creditLimit' | 'recordStatus', string>
>

export type SubLedgerRowPreview = {
  row: number
  subLedgerName: string
  linkedLedger: string
  type: string
  balanceType: string
  openingBalance: number
  creditLimit: number | null
  recordStatus: string // the subledger's own Active/Inactive value from the template, not the row's validation status
  status: SubLedgerRowStatus // this row's validation outcome: valid | warning | error
  fieldIssues: SubLedgerFieldIssues
}

export type SubLedgerImportPreview = {
  rows: SubLedgerRowPreview[]
  summary: {
    valid: number
    warning: number
    error: number
  }
}