import { Receipt } from 'lucide-react'

const BULLETS = [
  'Mandatory for registered taxpayers above the turnover threshold',
  'Real-time registration with the NIC portal',
  'Auto-populated in GSTR-1',
  'Prevents fake billing',
]

export default function EInvoiceAbout() {
  return (
    <div className="rounded-2xl border border-[rgba(11,77,140,0.12)] bg-[rgba(11,77,140,0.03)] p-5 shadow-sm">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(11,77,140,0.1)] text-[#043793]">
        <Receipt size={26} />
      </div>
      <h3 className="mb-2 text-sm font-bold text-[#043793]">About E-Invoicing</h3>
      <p className="mb-4 text-xs leading-relaxed text-slate-400">
        Generate Invoice Reference Numbers (IRN) and QR codes compliant with the GST e-invoicing mandate for B2B
        transactions above ₹5 crore turnover.
      </p>
      <ul className="space-y-2">
        {BULLETS.map((bullet) => (
          <li key={bullet} className="text-xs text-slate-400">
            • {bullet}
          </li>
        ))}
      </ul>
    </div>
  )
}