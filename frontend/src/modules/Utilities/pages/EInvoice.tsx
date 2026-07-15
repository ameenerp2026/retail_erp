import { useState } from 'react'
import { Receipt } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { utilitiesService } from '@/services/utilitiesService'

export default function EInvoicePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['e-invoice'],
    queryFn: utilitiesService.getEInvoice,
  })

  const [form, setForm] = useState<Record<string, string>>({})

  if (isLoading || !data) {
    return <div className="page-shell text-sm text-slate-500">Loading...</div>
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">E-Invoice Generator</h1>
          <p className="page-subtitle">Generate IRN and QR code via GST e-invoicing API</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_340px]">
        <div className="section-card">
          <h2 className="section-title mb-4">Invoice Details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data.fields.map((field) => (
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
          <button
            type="button"
            className="mt-6 flex h-10 w-full items-center justify-center rounded-[14px] bg-[linear-gradient(#093055,#043793)] text-sm font-semibold text-white"
          >
            Generate E-Invoice
          </button>
        </div>

        <div className="rounded-2xl border border-[rgba(11,77,140,0.12)] bg-[rgba(11,77,140,0.03)] p-5 shadow-sm">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(11,77,140,0.1)] text-[#043793]">
            <Receipt size={26} />
          </div>
          <h3 className="mb-2 text-sm font-bold text-[#043793]">{data.title}</h3>
          <p className="mb-4 text-xs leading-relaxed text-slate-400">{data.description}</p>
          <ul className="space-y-2">
            {data.bullets.map((bullet) => (
              <li key={bullet} className="text-xs text-slate-400">
                • {bullet}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
