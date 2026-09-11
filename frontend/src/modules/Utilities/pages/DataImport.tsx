import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Download, FileSpreadsheet, Loader2, Search, Upload } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { utilitiesService } from '@/services/utilitiesService'
import type { ImportTypeOption } from '@/types/utilities'
import type { ImportColumn } from '@/types/Importpreview'
import ImportPreviewScreen from '../components/DataImport/ImportPreviewScreen'
import type { LedgerImportPreview, LedgerImportResult } from '@/types/Ledgerimport'

type Stage = 'idle' | 'validating' | 'preview' | 'importing' | 'result'

function currency(value: unknown) {
  const n = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(n)) return ''
  return `₹${n.toLocaleString('en-IN')}`
}

// Column layout + confirm-button wording per import type. Add an entry here
// whenever a new import type (vendors, customers, ...) gets a preview screen —
// ImportPreviewScreen itself doesn't need to change.
const IMPORT_COLUMNS: Record<string, { columns: ImportColumn[]; recordLabel: string }> = {
  ledgers: {
    recordLabel: 'ledgers',
    columns: [
      { key: 'ledgerName', label: 'Name' },
      { key: 'accountGroup', label: 'Account Group' },
      { key: 'accountClass', label: 'Class' },
      { key: 'openingBalance', label: 'Balance', align: 'right', format: currency },
    ],
  },
  subledgers: {
    recordLabel: 'sub ledgers',
    columns: [
      { key: 'subLedgerName', label: 'Name' },
      { key: 'linkedLedger', label: 'Linked Ledger' },
      { key: 'type', label: 'Type' },
      { key: 'openingBalance', label: 'Balance', align: 'right', format: currency },
    ],
  },
}

const DEFAULT_COLUMNS = { columns: [] as ImportColumn[], recordLabel: 'records' }

export default function DataImportPage() {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<ImportTypeOption | null>(null)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Two-step preview/commit state
  const [stage, setStage] = useState<Stage>('idle')
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<LedgerImportPreview | null>(null)
  const [result, setResult] = useState<LedgerImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['data-import'],
    queryFn: utilitiesService.getDataImport,
  })

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filteredTypes = useMemo(() => {
    if (!data?.importTypes) return []
    const q = search.trim().toLowerCase()
    if (!q) return data.importTypes
    return data.importTypes.filter((t) => t.label.toLowerCase().includes(q))
  }, [data, search])

  const activeType = selectedType ?? data?.importTypes?.[0] ?? null
  const activeColumns = activeType ? (IMPORT_COLUMNS[activeType.value] ?? DEFAULT_COLUMNS) : DEFAULT_COLUMNS

  function handleSelectType(type: ImportTypeOption) {
    setSelectedType(type)
    setOpen(false)
    setSearch('')
    setDownloadError(null)
  }

  async function handleDownload() {
    if (!activeType) return
    setDownloading(true)
    setDownloadError(null)
    try {
      await utilitiesService.downloadTemplate(activeType.templateUrl, activeType.templateFileName)
    } catch {
      setDownloadError('Could not download the template. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  // Step 1: file picked -> validate against /import/preview, no DB writes yet
  async function handleFileSelected(file: File | undefined) {
    if (!file || !activeType) return
    setPendingFile(file)
    setStage('validating')
    setError(null)
    try {
      if (!activeType.previewUrl) {
        setError(`No preview endpoint configured for "${activeType.label}".`)
        setStage('idle')
        setPendingFile(null)
        return
      }
      const previewResult = await utilitiesService.previewData(file, activeType.previewUrl)
      setPreview(previewResult)
      setStage('preview')
    } catch {
      setError('Could not validate the file. Check the format and try again.')
      setStage('idle')
      setPendingFile(null)
    } finally {
      // Allow re-selecting the same filename later (e.g. after Re-upload)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Step 2: user reviewed the table and confirms -> actually commit the import
  async function handleConfirmImport() {
    if (!pendingFile || !activeType) return
    setStage('importing')
    setError(null)
    try {
      const importResult = await utilitiesService.importData(pendingFile, activeType.importUrl)
      setResult(importResult)
      setStage('result')
    } catch {
      setError('Import failed partway through. Please try again.')
      setStage('preview')
    }
  }

  function handleReupload() {
    setStage('idle')
    setPendingFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  if (isLoading || !data) {
    return <div className="page-shell text-sm text-slate-500">Loading...</div>
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Data Import</h1>
          <p className="page-subtitle">Import master data via CSV with validation and error reporting</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs text-red-600">
          {error}
        </div>
      )}

      {stage === 'validating' && (
        <div className="flex min-h-[280px] flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <Loader2 size={22} className="animate-spin text-[#0aa6a6]" />
          <p className="text-sm font-semibold text-[#043793]">Validating {pendingFile?.name}...</p>
          <p className="text-xs text-slate-400">Checking column structure, data types, and business rules</p>
        </div>
      )}

      {stage === 'preview' && preview && activeType && (
        <ImportPreviewScreen
          fileName={pendingFile?.name ?? ''}
          preview={preview}
          columns={activeColumns.columns}
          recordLabel={activeColumns.recordLabel}
          templates={[
            { label: activeType.templateTitle, fileName: activeType.templateFileName, downloadUrl: activeType.templateUrl },
          ]}
          onDownloadTemplate={() => handleDownload()}
          onReupload={handleReupload}
          onConfirm={handleConfirmImport}
          isConfirming={stage === ('importing' as Stage)}
        />
      )}

      {stage === 'importing' && (
        <div className="flex min-h-[280px] flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <Loader2 size={22} className="animate-spin text-[#0aa6a6]" />
          <p className="text-sm font-semibold text-[#043793]">Importing records...</p>
        </div>
      )}

      {stage === 'result' && result && (
        <div className="section-card">
          <h2 className="section-title mb-3">Import complete</h2>
          <p className="mb-4 text-sm text-slate-600">
            {result.importedCount} of {result.totalRows} records imported. {result.skippedCount} skipped.
          </p>
          {result.skipped.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-[10px] font-semibold text-slate-400">
                    <th className="px-4 py-2">Row</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {result.skipped.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-2 text-slate-400">{row.row ?? '—'}</td>
                      <td className="px-4 py-2 text-slate-700">{row.ledgerName}</td>
                      <td className="px-4 py-2 text-red-600">{row.errors.join('; ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <button
            type="button"
            onClick={handleReupload}
            className="mt-4 h-9 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Import another file
          </button>
        </div>
      )}

      {stage === 'idle' && (
        <>
          <div className="mb-5" ref={containerRef}>
            <div className="relative max-w-xl">
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex h-9 w-full items-center justify-between rounded-xl border border-slate-200 bg-white pr-3 pl-9 text-xs text-slate-700 outline-none focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
              >
                <Search size={14} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
                <span className="truncate text-left">{activeType ? activeType.label : 'Select import type'}</span>
                <ChevronDown size={14} className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
              </button>

              {open && (
                <div className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  <div className="relative border-b border-slate-100 p-2">
                    <Search size={13} className="pointer-events-none absolute top-1/2 left-4.5 -translate-y-1/2 text-slate-400" />
                    <input
                      autoFocus
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={data.searchPlaceholder}
                      className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 pr-3 pl-8 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#043793]/40"
                    />
                  </div>
                  <ul className="max-h-56 overflow-y-auto py-1">
                    {filteredTypes.length === 0 && <li className="px-3 py-2 text-xs text-slate-400">No import types found.</li>}
                    {filteredTypes.map((type) => {
                      const isSelected = type.value === selectedType?.value
                      return (
                        <li key={type.value}>
                          <button
                            type="button"
                            onClick={() => handleSelectType(type)}
                            className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs hover:bg-slate-50 ${
                              isSelected ? 'bg-blue-50/60 text-[#043793]' : 'text-slate-700'
                            }`}
                          >
                            <span className="truncate">{type.label}</span>
                            {isSelected && <Check size={13} className="shrink-0 text-[#043793]" />}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {activeType && (
            <div className="mb-5 flex flex-col gap-2">
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-blue-50 text-[#043793]">
                    <FileSpreadsheet size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#043793]">{activeType.templateTitle}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{activeType.templateDescription}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex h-9 shrink-0 items-center gap-2 rounded-[14px] bg-[linear-gradient(#093055,#043793)] px-4 text-xs font-semibold text-white disabled:opacity-60"
                >
                  <Download size={13} />
                  {downloading ? 'Downloading...' : 'Download Template'}
                </button>
              </div>
              {downloadError && <p className="px-1 text-xs text-red-600">{downloadError}</p>}
            </div>
          )}

          <div className="mb-5">
            <h2 className="section-title mb-1">{data.howToTitle}</h2>
            <p className="mb-4 text-xs text-slate-400">{data.howToSubtitle}</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {data.steps.map((step) => (
                <div key={step.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <span className="mb-3 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-[#043793]">
                    {step.step}
                  </span>
                  <div className="mb-3 flex h-16 items-center justify-center rounded-xl bg-slate-50">
                    {step.id === '1' && <FileSpreadsheet size={28} className="text-[#043793]" />}
                    {step.id === '2' && (
                      <div className="w-24 rounded border border-slate-200 bg-white p-1.5 text-[8px] text-slate-400">
                        <div className="mb-1 grid grid-cols-3 gap-0.5 font-semibold text-[#043793]">
                          <span>Name</span>
                          <span>Mobile</span>
                          <span>Email</span>
                        </div>
                        <div className="grid grid-cols-3 gap-0.5">
                          <span>—</span>
                          <span>—</span>
                          <span>—</span>
                        </div>
                      </div>
                    )}
                    {step.id === '3' && <Upload size={28} className="text-[#043793]" />}
                  </div>
                  <p className="text-sm font-semibold text-[#043793]">{step.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card">
            <h2 className="section-title mb-4">Upload Your File</h2>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#043793]/25 bg-[rgba(4,55,147,0.03)] px-4 py-12 text-center transition hover:bg-[rgba(4,55,147,0.05)]">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#043793]">
                <Upload size={22} />
              </div>
              <p className="text-sm font-semibold text-[#043793]">{data.uploadTitle}</p>
              <p className="mt-1 text-xs text-slate-400">{data.uploadHint}</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx"
                className="hidden"
                onChange={(event) => handleFileSelected(event.target.files?.[0])}
              />
            </label>
          </div>
        </>
      )}
    </div>
  )
}