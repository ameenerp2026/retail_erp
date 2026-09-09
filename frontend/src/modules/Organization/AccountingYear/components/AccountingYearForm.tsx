import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { accountingYearSchema, AccountingYearFormData } from '@/components/forms/validate.schema'
import z from 'zod'
import { X, AlertCircle } from 'lucide-react'

type Props = {
  onClose: () => void
  onSubmit?: (data: AccountingYearFormData) => void
}

type Errors = Partial<Record<keyof AccountingYearFormData, string>>

export default function AccountingYearForm({ onClose, onSubmit }: Props) {
  const [formData, setFormData] = useState<AccountingYearFormData>({
    fromDate: '',
    toDate: '',
    yearName: '',
  })
  const [errors, setErrors] = useState<Errors>({})

  const handleChange = (field: keyof AccountingYearFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    try {
      const validatedData = accountingYearSchema.parse(formData)
      const _data = { id: Date.now().toString(), ...validatedData }

      toast.success('Accounting year added successfully')
      onSubmit?.(_data)
      onClose()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Errors = {}
        error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof AccountingYearFormData
          fieldErrors[field] = issue.message
        })
        setErrors(fieldErrors)
        return
      }

      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Something went wrong. Try again.')
      }
    }
  }

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-lg font-bold text-[#043793]">
            Add Accounting Year
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Create and configure a new fiscal accounting year.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Form */}
      <form
        id="accounting-year-form"
        onSubmit={handleSubmit}
        className="px-6 py-5 space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              From Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={formData.fromDate}
              onChange={(e) => handleChange('fromDate', e.target.value)}
              className={`w-full border rounded-xl px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#043793]/15 transition-all ${
                errors.fromDate
                  ? 'border-rose-400 bg-rose-50/20'
                  : 'border-slate-300 focus:border-[#043793]'
              }`}
            />
            {errors.fromDate && (
              <p className="text-xs font-medium text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.fromDate}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              To Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={formData.toDate}
              onChange={(e) => handleChange('toDate', e.target.value)}
              className={`w-full border rounded-xl px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#043793]/15 transition-all ${
                errors.toDate
                  ? 'border-rose-400 bg-rose-50/20'
                  : 'border-slate-300 focus:border-[#043793]'
              }`}
            />
            {errors.toDate && (
              <p className="text-xs font-medium text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.toDate}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Year Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.yearName}
            onChange={(e) => handleChange('yearName', e.target.value)}
            placeholder="e.g. FY 2027-28"
            className={`w-full border rounded-xl px-3.5 py-2 text-sm text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#043793]/15 transition-all ${
              errors.yearName
                ? 'border-rose-400 bg-rose-50/20'
                : 'border-slate-300 focus:border-[#043793]'
            }`}
          />
          {errors.yearName && (
            <p className="text-xs font-medium text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.yearName}
            </p>
          )}
        </div>
      </form>

      {/* Footer */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5 shrink-0 rounded-b-2xl">
        <button
          type="button"
          onClick={onClose}
          className="h-9.5 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 active:scale-95 transition-all cursor-pointer shadow-2xs"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="accounting-year-form"
          className="h-9.5 px-4.5 rounded-xl bg-gradient-to-r from-[#093055] to-[#043793] text-white text-xs font-semibold hover:opacity-95 active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          Add Year
        </button>
      </div>
    </div>
  )
}
