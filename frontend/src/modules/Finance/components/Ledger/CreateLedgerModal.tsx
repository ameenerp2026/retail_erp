import { useEffect, useState, type SubmitEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { Modal } from '@/components/shared/Modal'
import { ledgerService } from '@/services/admin/finance/ledgerService'
import type { LedgerBalanceType } from '@/types/ledger'

export type CreateLedgerFormValues = {
  name: string
  accountGroupId: number | ''
  accountClassId: number | ''
  balanceType: LedgerBalanceType | ''
  openingBalance: string
  organizationUnitId: number | ''
  gstEnabled: boolean
}

type Props = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: CreateLedgerFormValues) => void
  isSubmitting?: boolean
  mode?: 'create' | 'edit'
  // system-generated code, shown read-only in edit mode; ignored in create mode
  ledgerId?: string
  // pre-fills the form when opening in edit mode
  initialValues?: CreateLedgerFormValues
}

const EMPTY: CreateLedgerFormValues = {
  name: '',
  accountGroupId: '',
  accountClassId: '',
  balanceType: '',
  openingBalance: '',
  organizationUnitId: '',
  gstEnabled: false,
}

const fieldClass =
  'h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400/70 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10 disabled:opacity-60'
const labelClass = 'mb-1.5 block text-xs font-semibold text-slate-400'

export default function CreateLedgerModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  mode = 'create',
  ledgerId,
  initialValues,
}: Props) {
  const [form, setForm] = useState<CreateLedgerFormValues>(EMPTY)

  useEffect(() => {
    if (isOpen) {
      setForm(mode === 'edit' && initialValues ? initialValues : EMPTY)
    }
  }, [isOpen, mode, initialValues])

  const { data: accountGroups = [], isLoading: loadingGroups } = useQuery({
    queryKey: ['account-groups'],
    queryFn: ledgerService.getAccountGroups,
    enabled: isOpen,
  })

  const { data: accountClasses = [], isLoading: loadingClasses } = useQuery({
    queryKey: ['account-classes', 'by-group', form.accountGroupId],
    queryFn: () => ledgerService.getAccountClassesByGroup(form.accountGroupId as number),
    enabled: isOpen && form.accountGroupId !== '',
  })

  const { data: orgUnits = [], isLoading: loadingOrgUnits } = useQuery({
    queryKey: ['org-units'],
    queryFn: ledgerService.getOrgUnits,
    enabled: isOpen,
  })

  const canSubmit =
    Boolean(form.name.trim()) &&
    form.accountGroupId !== '' &&
    form.accountClassId !== '' &&
    Boolean(form.balanceType) &&
    !isSubmitting

  const handleGroupChange = (value: string) => {
    // changing group invalidates whatever class was picked, since classes are scoped to a group
    setForm((f) => ({
      ...f,
      accountGroupId: value ? Number(value) : '',
      accountClassId: '',
    }))
  }

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit(form)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <form onSubmit={handleSubmit} className="flex max-h-[90vh] flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="text-base font-bold text-[#043793] sm:text-lg">
            {mode === 'edit' ? 'Edit Ledger' : 'Create Ledger'}
          </h2>
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
            {mode === 'edit' && (
              <label className="block">
                <span className={labelClass}>Ledger ID</span>
                <input
                  type="text"
                  value={ledgerId ?? ''}
                  disabled
                  className={fieldClass}
                />
              </label>
            )}

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
                value={form.accountGroupId}
                onChange={(e) => handleGroupChange(e.target.value)}
                disabled={loadingGroups}
                className={fieldClass}
              >
                <option value="">{loadingGroups ? 'Loading…' : 'Select group'}</option>
                {accountGroups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.rootGroupName}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelClass}>
                Account Class <span className="text-rose-500">*</span>
              </span>
              <select
                value={form.accountClassId}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    accountClassId: e.target.value ? Number(e.target.value) : '',
                  }))
                }
                disabled={form.accountGroupId === '' || loadingClasses}
                className={fieldClass}
              >
                <option value="">
                  {form.accountGroupId === ''
                    ? 'Select account group first'
                    : loadingClasses
                    ? 'Loading…'
                    : 'Select account class'}
                </option>
                {accountClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.className}
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
                value={form.organizationUnitId}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    organizationUnitId: e.target.value ? Number(e.target.value) : '',
                  }))
                }
                disabled={loadingOrgUnits}
                className={fieldClass}
              >
                <option value="">All Units</option>
                {orgUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.organizationUnit}
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
            {isSubmitting
              ? mode === 'edit' ? 'Updating…' : 'Creating…'
              : mode === 'edit' ? 'Update Ledger' : 'Create Ledger'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
