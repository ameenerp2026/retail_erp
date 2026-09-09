import { AlertTriangle, ClipboardList } from 'lucide-react'

interface ValidityRule {
  id: string | number
  distance: string
  validity: string
}

interface EWayBillAboutProps {
  validityRules: ValidityRule[]
  complianceNotice: string
}

export default function EWayBillAbout({ validityRules, complianceNotice }: EWayBillAboutProps) {
  return (
    <div className="space-y-4">
      <div className="section-card">
        <div className="mb-3 flex items-center gap-2">
          <ClipboardList size={14} className="text-[#043793]" />
          <h3 className="text-xs font-bold text-[#043793]">Validity Rules</h3>
        </div>
        <div className="space-y-1">
          {validityRules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between py-1.5 text-xs">
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
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{complianceNotice}</p>
          </div>
        </div>
      </div>
    </div>
  )
}