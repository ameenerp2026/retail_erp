// Generic shape any import type's preview/commit response can be treated as,
// so ImportPreviewScreen doesn't need to know about ledgers vs subledgers vs
// whatever import type comes next. Backend responses (LedgerRowPreview,
// SubLedgerRowPreview, ...) already satisfy this structurally — no mapping
// needed, just pass them straight through.

export type ImportRowStatus = 'valid' | 'warning' | 'error'

export type ImportRow = {
  row: number
  status: ImportRowStatus
  fieldIssues: Record<string, string | undefined>
} & Record<string, unknown>

export type ImportPreview = {
  rows: ImportRow[]
  summary: {
    valid: number
    warning: number
    error: number
  }
}

export type ImportColumn = {
  key: string
  label: string
  align?: 'left' | 'right'
  format?: (value: unknown) => string
}

export type SkippedImportRow = {
  row: number | null
  errors: string[]
} & Record<string, unknown>

export type ImportResult = {
  totalRows: number
  importedCount: number
  skippedCount: number
  skipped: SkippedImportRow[]
}