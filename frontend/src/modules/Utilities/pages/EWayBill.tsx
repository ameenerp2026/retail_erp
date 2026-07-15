import { useState } from 'react'
import { AlertTriangle, ClipboardList } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { utilitiesService } from '@/services/utilitiesService'

export default function EWayBillPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['e-way-bill'],
    queryFn: utilitiesService.getEWayBill,
  })

  const [form, setForm] = useState<Record<string, string>>({})
  const [transportMode, setTransportMode] = useState('Road')

  if (isLoading || !data) {
    return <div className="page-shell text-sm text-slate-500">Loading...</div>
  }

  const gridFields = data.fields.filter((f) => !f.fullWidth)
  const fullWidthFields = data.fields.filter((f) => f.fullWidth)

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">E-Way Bill Generator</h1>
          <p className="page-subtitle">
            Generate e-way bills for goods transport compliance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
        <div className="section-card">
          <h2 className="section-title mb-4">Bill Details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {gridFields.map((field) => (
              <label key={field.key} className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-400">
                  {field.label}
                </span>
                <input
                  type="text"
                  value={form[field.key] ?? ''}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  placeholder={field.placeholder}
                  className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none placeholder:text-slate-400/70 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
                />
              </label>
            ))}
          </div>

          <div className="mt-4">
            <span className="mb-1.5 block text-xs font-semibold text-slate-400">
              Mode of Transport
            </span>
            <div className="flex flex-wrap gap-2">
              {data.transportModes.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTransportMode(mode)}
                  className={`h-10 rounded-[14px] px-4 text-xs font-semibold transition ${
                    transportMode === mode
                      ? 'bg-[linear-gradient(#093055,#043793)] text-white'
                      : 'border border-slate-200 bg-slate-50 text-slate-400'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {fullWidthFields.map((field) => (
            <label key={field.key} className="mt-4 block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-400">
                {field.label}
              </span>
              <input
                type="text"
                value={form[field.key] ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                placeholder={field.placeholder}
                className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none placeholder:text-slate-400/70 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
              />
            </label>
          ))}

          <button
            type="button"
            className="mt-6 flex h-10 w-full items-center justify-center rounded-[14px] bg-[linear-gradient(#093055,#043793)] text-sm font-semibold text-white"
          >
            Generate E-Way Bill
          </button>
        </div>

        <div className="space-y-4">
          <div className="section-card">
            <div className="mb-3 flex items-center gap-2">
              <ClipboardList size={14} className="text-[#043793]" />
              <h3 className="text-xs font-bold text-[#043793]">Validity Rules</h3>
            </div>
            <div className="space-y-1">
              {data.validityRules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between py-1.5 text-xs"
                >
                  <span className="text-slate-400">{rule.distance}</span>
                  <span className="font-semibold text-slate-700">{rule.validity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[rgba(245,158,11,0.15)] bg-[rgba(245,158,11,0.06)] p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-500" />
              <div>
                <p className="text-xs font-bold text-amber-500">Compliance Notice</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  {data.complianceNotice}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
