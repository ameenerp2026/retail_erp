import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Modal } from '@/components/shared/Modal'
import type { LedgerAccountGroup, LedgerBalanceType } from '@/types/ledger'

export type CreateLedgerFormValues = {
  name: string
  accountGroup: LedgerAccountGroup | ''
  accountClass: string
  balanceType: LedgerBalanceType | ''
  openingBalance: string
  orgUnit: string
  gstEnabled: boolean
}

type Props = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: CreateLedgerFormValues) => void
}

const ACCOUNT_GROUPS: LedgerAccountGroup[] = [
  'Assets',
  'Liabilities',
  'Income',
  'Expenses',
]

const ACCOUNT_CLASSES = [
  'Current Assets',
  'Current Liabilities',
  'Revenue',
  'Direct Expenses',
  'Indirect Expenses',
]

const ORG_UNITS = ['All Units', 'HQ - Mumbai', 'Delhi North', 'Bengaluru South']

const EMPTY: CreateLedgerFormValues = {
  name: '',
  accountGroup: '',
  accountClass: '',
  balanceType: '',
  openingBalance: '',
  orgUnit: 'All Units',
  gstEnabled: false,
}

const fieldClass =
  'h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400/70 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10'
const labelClass = 'mb-1.5 block text-xs font-semibold text-slate-400'

export default function CreateLedgerModal({ isOpen, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<CreateLedgerFormValues>(EMPTY)

  useEffect(() => {
    if (isOpen) setForm(EMPTY)
  }, [isOpen])

  const canSubmit =
    Boolean(form.name.trim()) &&
    Boolean(form.accountGroup) &&
    Boolean(form.accountClass) &&
    Boolean(form.balanceType)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit(form)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <form onSubmit={handleSubmit} className="flex max-h-[90vh] flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="text-base font-bold text-[#043793] sm:text-lg">Create Ledger</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-[14px] text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>
                Ledger Name <span className="text-rose-500">*</span>
              </span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Cash in Hand"
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>
                Account Group <span className="text-rose-500">*</span>
              </span>
              <select
                value={form.accountGroup}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    accountGroup: e.target.value as LedgerAccountGroup | '',
                  }))
                }
                className={fieldClass}
              >
                <option value="">Select group</option>
                {ACCOUNT_GROUPS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelClass}>
                Account Class <span className="text-rose-500">*</span>
              </span>
              <select
                value={form.accountClass}
                onChange={(e) => setForm((f) => ({ ...f, accountClass: e.target.value }))}
                className={fieldClass}
              >
                <option value="">Assets / Liabilities...</option>
                {ACCOUNT_CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelClass}>
                Balance Type <span className="text-rose-500">*</span>
              </span>
              <select
                value={form.balanceType}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    balanceType: e.target.value as LedgerBalanceType | '',
                  }))
                }
                className={fieldClass}
              >
                <option value="">Debit / Credit</option>
                <option value="Debit">Debit</option>
                <option value="Credit">Credit</option>
              </select>
            </label>

            <label className="block">
              <span className={labelClass}>Opening Balance</span>
              <input
                type="text"
                value={form.openingBalance}
                onChange={(e) => setForm((f) => ({ ...f, openingBalance: e.target.value }))}
                placeholder="0.00"
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>Org Unit</span>
              <select
                value={form.orgUnit}
                onChange={(e) => setForm((f) => ({ ...f, orgUnit: e.target.value }))}
                className={fieldClass}
              >
                {ORG_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4">
            <span className={labelClass}>GST Applicable</span>
            <div className="flex items-center gap-4">
              {[true, false].map((value) => (
                <label key={String(value)} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="gst"
                    checked={form.gstEnabled === value}
                    onChange={() => setForm((f) => ({ ...f, gstEnabled: value }))}
                    className="accent-[#043793]"
                  />
                  {value ? 'Yes' : 'No'}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-[14px] bg-slate-100 px-5 text-sm font-semibold text-slate-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="h-10 rounded-[14px] bg-[linear-gradient(#093055,#043793)] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Create Ledger
          </button>
        </div>
      </form>
    </Modal>
  )
}
