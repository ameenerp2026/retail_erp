import { useState } from 'react'
import { Download, FileSpreadsheet, Search, Upload } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { utilitiesService } from '@/services/utilitiesService'

export default function DataImportPage() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['data-import'],
    queryFn: utilitiesService.getDataImport,
  })

  if (isLoading || !data) {
    return <div className="page-shell text-sm text-slate-500">Loading...</div>
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Data Import</h1>
          <p className="page-subtitle">
            Import master data via CSV with validation and error reporting
          </p>
        </div>
      </div>

      <div className="mb-5">
        <div className="relative max-w-xl">
          <Search
            size={14}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={data.searchPlaceholder}
            className="h-9 w-full rounded-xl border border-slate-200 bg-white pr-3 pl-9 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
          />
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-blue-50 text-[#043793]">
            <FileSpreadsheet size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#043793]">{data.templateTitle}</p>
            <p className="mt-0.5 text-xs text-slate-400">{data.templateDescription}</p>
          </div>
        </div>
        <button
          type="button"
          className="flex h-9 shrink-0 items-center gap-2 rounded-[14px] bg-[linear-gradient(#093055,#043793)] px-4 text-xs font-semibold text-white"
        >
          <Download size={13} />
          Download Template
        </button>
      </div>

      <div className="mb-5">
        <h2 className="section-title mb-1">{data.howToTitle}</h2>
        <p className="mb-4 text-xs text-slate-400">{data.howToSubtitle}</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {data.steps.map((step) => (
            <div
              key={step.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
            >
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
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                {step.description}
              </p>
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
          <input type="file" accept=".csv,.xlsx" className="hidden" />
        </label>
      </div>
    </div>
  )
}
