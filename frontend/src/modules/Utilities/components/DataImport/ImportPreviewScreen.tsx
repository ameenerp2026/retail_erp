import { CheckCircle2, AlertTriangle, XCircle, Download, FileSpreadsheet } from 'lucide-react'
import type { ImportColumn, ImportPreview, ImportRow, ImportRowStatus } from '@/types/Importpreview'

type TemplateRef = {
  label: string
  fileName: string
  downloadUrl: string
}

type ImportPreviewScreenProps = {
  fileName: string
  preview: ImportPreview
  columns: ImportColumn[]
  recordLabel?: string // e.g. "records", "ledgers", "sub ledgers" — shown in the confirm button
  templates: TemplateRef[]
  onDownloadTemplate: (template: TemplateRef) => void
  onReupload: () => void
  onConfirm: () => void
  isConfirming: boolean
}

const STATUS_STYLES: Record<ImportRowStatus, { label: string; badge: string; icon: typeof CheckCircle2 }> = {
  valid: { label: 'Valid', badge: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2 },
  warning: { label: 'Warning', badge: 'bg-amber-50 text-amber-600', icon: AlertTriangle },
  error: { label: 'Error', badge: 'bg-red-50 text-red-600', icon: XCircle },
}

const IMPORT_RULES = [
  'Max 5,000 records per import',
  'Required fields must not be empty',
  'Duplicate records will be skipped',
  'Use provided templates only',
]

function defaultFormat(value: unknown): string {
  if (value === null || value === undefined || value === '') return ''
  return String(value)
}

/**
 * Renders a single data cell, coloring the text when this column's field
 * carries an issue: red for a row-blocking error, amber for a warning that
 * was auto-resolved. Falls back to plain slate text when the field is clean.
 */
function Cell({
  value,
  issue,
  rowStatus,
  align = 'left',
}: {
  value: string
  issue?: string
  rowStatus: ImportRowStatus
  align?: 'left' | 'right'
}) {
  const hasIssue = Boolean(issue)
  const tone = hasIssue
    ? rowStatus === 'error'
      ? 'text-red-600 font-semibold'
      : 'text-amber-600 font-semibold'
    : 'text-slate-700'

  return (
    <td className={`px-4 py-3 text-xs ${tone} ${align === 'right' ? 'text-right' : 'text-left'}`} title={issue}>
      {value || <span className="text-slate-300">—</span>}
    </td>
  )
}

// All issue messages for a row, valid rows have none and render a dash.
function allIssues(fieldIssues: Record<string, string | undefined>): string[] {
  return Object.values(fieldIssues).filter((v): v is string => Boolean(v))
}

export default function ImportPreviewScreen({
  fileName,
  preview,
  columns,
  recordLabel = 'records',
  templates,
  onDownloadTemplate,
  onReupload,
  onConfirm,
  isConfirming,
}: ImportPreviewScreenProps) {
  const rows = preview?.rows ?? []
  const summary = preview?.summary ?? { valid: 0, warning: 0, error: 0 }
  const importableCount = rows.filter((r) => r.status !== 'error').length

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
      {/* Main panel: summary + row table */}
      <div className="section-card">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
            <CheckCircle2 size={13} />
            {summary.valid} Valid
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
            <AlertTriangle size={13} />
            {summary.warning} Warning
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
            <XCircle size={13} />
            {summary.error} Error
          </span>
          <span className="ml-auto truncate text-xs text-slate-400">{fileName}</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-[10px] font-semibold tracking-wide text-slate-400">
                <th className="px-4 py-2.5">Row</th>
                {columns.map((col) => (
                  <th key={col.key} className={`px-4 py-2.5 ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Issue</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row: ImportRow) => {
                const status = STATUS_STYLES[row.status]
                const StatusIcon = status.icon
                const issues = allIssues(row.fieldIssues)
                return (
                  <tr key={row.row} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                    <td className="px-4 py-3 text-xs text-slate-400">#{row.row}</td>
                    {columns.map((col) => {
                      const raw = row[col.key]
                      const value = col.format ? col.format(raw) : defaultFormat(raw)
                      return (
                        <Cell
                          key={col.key}
                          value={value}
                          issue={row.fieldIssues[col.key]}
                          rowStatus={row.status}
                          align={col.align}
                        />
                      )
                    })}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${status.badge}`}>
                        <StatusIcon size={11} />
                        {status.label}
                      </span>
                    </td>
                    <td className="max-w-[280px] px-4 py-3 text-xs">
                      {issues.length === 0 ? (
                        <span className="text-slate-300">—</span>
                      ) : (
                        <ul className={`flex flex-col gap-0.5 ${row.status === 'error' ? 'text-red-600' : 'text-amber-600'}`}>
                          {issues.map((msg, i) => (
                            <li key={i} className="leading-snug">
                              {msg}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                )
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 3} className="px-4 py-8 text-center text-xs text-slate-400">
                    No rows found in this file.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onReupload}
            className="h-9 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Re-upload
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming || importableCount === 0}
            className="h-9 rounded-xl bg-[linear-gradient(#093055,#043793)] px-4 text-xs font-semibold text-white disabled:opacity-60"
          >
            {isConfirming ? 'Importing...' : `Confirm Import (${importableCount} ${recordLabel})`}
          </button>
        </div>
      </div>

      {/* Sidebar: templates + rules */}
      <div className="flex flex-col gap-4">
        <div className="section-card">
          <h2 className="section-title mb-3">Download Templates</h2>
          <div className="flex flex-col gap-2">
            {templates.map((template) => (
              <button
                key={template.fileName}
                type="button"
                onClick={() => onDownloadTemplate(template)}
                className="flex items-center gap-2.5 rounded-xl border border-slate-100 p-2.5 text-left hover:bg-slate-50"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#043793]">
                  <FileSpreadsheet size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-[#043793]">{template.label}</p>
                  <p className="truncate text-[10px] text-slate-400">{template.fileName}</p>
                </div>
                <Download size={13} className="shrink-0 text-slate-300" />
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
          <h2 className="mb-2 text-xs font-semibold text-amber-700">Import Rules</h2>
          <ul className="flex flex-col gap-1.5 text-[11px] leading-relaxed text-amber-700/80">
            {IMPORT_RULES.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}