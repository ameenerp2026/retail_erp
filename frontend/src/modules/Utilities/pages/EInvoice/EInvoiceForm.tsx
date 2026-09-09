import type { EInvoiceFormField, EInvoiceFormState } from './EInvoiceGeneration.types'

interface EInvoiceFormOption {
  value: string
  label: string
}

interface SellerGstProfileOption {
  id: number | string
  label: string
}

interface HsnCodeOption {
  id: number | string
  code: string
  label: string
}

interface EInvoiceFormData {
  transactionTypes: EInvoiceFormOption[]
  supplyTypes: EInvoiceFormOption[]
  sellerGstProfiles: SellerGstProfileOption[]
  hsnCodes: HsnCodeOption[]
}

interface EInvoiceFormProps {
  data: EInvoiceFormData
  form: EInvoiceFormState
  today: string
  error: string | null
  onChange: (field: EInvoiceFormField, value: string) => void
  onSubmit: () => void
}

export default function EInvoiceForm({ data, form, today, error, onChange, onSubmit }: EInvoiceFormProps) {
  return (
    <>
      <h2 className="section-title mb-4">Invoice Details</h2>

      {error && (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-400">Transaction Type *</span>
          <select
            value={form.transactionType}
            onChange={(e) => onChange('transactionType', e.target.value)}
            className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
          >
            <option value="">Select type</option>
            {data.transactionTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-400">Supply Type *</span>
          <select
            value={form.supplyType}
            onChange={(e) => onChange('supplyType', e.target.value)}
            className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
          >
            <option value="">Select type</option>
            {data.supplyTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-400">Document Number</span>
          <input
            type="text"
            disabled
            value="Auto-generated on save"
            className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-100 px-3 text-sm text-slate-400 outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-400">Document Date *</span>
          <input
            type="date"
            value={form.documentDate}
            max={today}
            onChange={(e) => onChange('documentDate', e.target.value)}
            className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-400">From GSTIN *</span>
          <select
            value={form.sellerGstProfileId}
            onChange={(e) => onChange('sellerGstProfileId', e.target.value)}
            className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
          >
            <option value="">Select GSTIN</option>
            {data.sellerGstProfiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-400">To GSTIN *</span>
          <input
            type="text"
            value={form.toGstin}
            onChange={(e) => onChange('toGstin', e.target.value.toUpperCase())}
            placeholder="07AABCS1429B1ZC"
            className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none placeholder:text-slate-400/70 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-400">From PIN</span>
          <input
            type="text"
            value={form.fromPin}
            onChange={(e) => onChange('fromPin', e.target.value)}
            placeholder="400051"
            className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none placeholder:text-slate-400/70 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-400">To PIN</span>
          <input
            type="text"
            value={form.toPin}
            onChange={(e) => onChange('toPin', e.target.value)}
            placeholder="110001"
            className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none placeholder:text-slate-400/70 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-400">From City</span>
          <input
            type="text"
            value={form.fromCity}
            onChange={(e) => onChange('fromCity', e.target.value)}
            placeholder="Chennai"
            className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none placeholder:text-slate-400/70 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-400">To City</span>
          <input
            type="text"
            value={form.toCity}
            onChange={(e) => onChange('toCity', e.target.value)}
            placeholder="Bangalore"
            className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none placeholder:text-slate-400/70 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-400">Item HSN Code *</span>
          <select
            value={form.hsnCode}
            onChange={(e) => onChange('hsnCode', e.target.value)}
            className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
          >
            <option value="">Select HSN code</option>
            {data.hsnCodes.map((h) => (
              <option key={h.id} value={h.code}>
                {h.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-400">Taxable Value (₹) *</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.taxableValue}
            onChange={(e) => onChange('taxableValue', e.target.value)}
            placeholder="105932.20"
            className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none placeholder:text-slate-400/70 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        className="mt-6 flex h-10 w-full items-center justify-center rounded-[14px] bg-[linear-gradient(#093055,#043793)] text-sm font-semibold text-white"
      >
        Generate E-Invoice
      </button>
    </>
  )
}