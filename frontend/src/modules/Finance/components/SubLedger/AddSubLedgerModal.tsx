import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Modal } from '@/components/shared/Modal'
import type { SubLedgerStatus, SubLedgerType } from '@/types/subLedger'

export type CreateSubLedgerFormValues = {
  name: string
  linkedLedger: string
  type: SubLedgerType | ''
  openingBalance: string
  balanceType: 'Debit' | 'Credit'
  creditLimit: string
  status: SubLedgerStatus
}

type Props = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: CreateSubLedgerFormValues) => void
  linkedLedgerOptions?: string[]
}

const TYPES: SubLedgerType[] = ['Customer', 'Vendor', 'Employee']

const EMPTY: CreateSubLedgerFormValues = {
  name: '',
  linkedLedger: '',
  type: '',
  openingBalance: '',
  balanceType: 'Debit',
  creditLimit: '',
  status: 'Active',
}

const fieldClass =
  'h-10 w-full rounded-[10px] border border-slate-200 bg-[#F5F7FB] px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400/70 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10'
const labelClass = 'mb-1.5 block text-xs font-semibold text-slate-400'

export default function AddSubLedgerModal({
  isOpen,
  onClose,
  onSubmit,
  linkedLedgerOptions = [
    'Trade Receivables',
    'Trade Payables',
    'Employee Advances',
  ],
}: Props) {
  const [form, setForm] = useState<CreateSubLedgerFormValues>(EMPTY)

  useEffect(() => {
    if (isOpen) setForm(EMPTY)
  }, [isOpen])

  const canSubmit =
    Boolean(form.name.trim()) && Boolean(form.linkedLedger) && Boolean(form.type)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit(form)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <form onSubmit={handleSubmit} className="flex max-h-[90vh] flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="text-base font-bold text-[#043793] sm:text-lg">Add Sub Ledger</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-[14px] text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
          <label className="block">
            <span className={labelClass}>
              Sub Ledger Name <span className="text-rose-500">*</span>
            </span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Reliance Retail Ltd"
              className={fieldClass}
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>
                Linked Ledger <span className="text-rose-500">*</span>
              </span>
              <select
                value={form.linkedLedger}
                onChange={(e) => setForm((f) => ({ ...f, linkedLedger: e.target.value }))}
                className={fieldClass}
              >
                <option value="">Select ledger</option>
                {linkedLedgerOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelClass}>
                Type <span className="text-rose-500">*</span>
              </span>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value as SubLedgerType | '' }))
                }
                className={fieldClass}
              >
                <option value="">Select type</option>
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelClass}>Opening Balance (₹)</span>
              <input
                type="text"
                value={form.openingBalance}
                onChange={(e) => setForm((f) => ({ ...f, openingBalance: e.target.value }))}
                placeholder="0.00"
                className={fieldClass}
              />
            </label>

            <div>
              <span className={labelClass}>Balance Type</span>
              <div className="grid grid-cols-2 gap-2">
                {(['Debit', 'Credit'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, balanceType: type }))}
                    className={`h-9 rounded-[14px] text-xs font-semibold transition ${
                      form.balanceType === type
                        ? 'bg-[linear-gradient(#093055,#043793)] text-white'
                        : 'border border-slate-200 bg-[#F5F7FB] text-slate-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <label className="block">
            <span className={labelClass}>Credit Limit (₹)</span>
            <input
              type="text"
              value={form.creditLimit}
              onChange={(e) => setForm((f) => ({ ...f, creditLimit: e.target.value }))}
              placeholder="Leave blank if no credit limit"
              className={fieldClass}
            />
          </label>

          <div>
            <span className={labelClass}>Status</span>
            <div className="grid max-w-xs grid-cols-2 gap-2">
              {(['Active', 'Inactive'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, status }))}
                  className={`h-9 rounded-[14px] text-xs font-semibold transition ${
                    form.status === status
                      ? status === 'Active'
                        ? 'border border-emerald-300/60 bg-emerald-50 text-emerald-600'
                        : 'border border-rose-200 bg-rose-50 text-rose-600'
                      : 'border border-slate-200 bg-[#F5F7FB] text-slate-400'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 px-5 pb-5 sm:grid-cols-2 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-[14px] bg-[#F5F7FB] text-sm font-semibold text-slate-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className={`h-10 rounded-[14px] text-sm font-semibold transition ${
              canSubmit
                ? 'bg-[linear-gradient(#093055,#043793)] text-white'
                : 'cursor-not-allowed bg-slate-200 text-slate-400'
            }`}
          >
            Add Sub Ledger
          </button>
        </div>
      </form>
    </Modal>
  )
}
