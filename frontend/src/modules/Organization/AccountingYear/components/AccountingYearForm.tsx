import { useState} from 'react'
import { toast } from 'react-hot-toast'
import { accountingYearSchema, AccountingYearFormData } from '@/components/forms/validate.schema'
import z from 'zod'
import { X } from 'lucide-react'
import apiClient from '../../../../services/apiClient'
type Props = {
  onClose: () => void
  onSubmit?: (data: AccountingYearFormData) => void
}

type Errors = Partial<Record<keyof AccountingYearFormData, string>>

export default function AccountingYearForm({ onClose, onSubmit }: Props) {
  const [formData, setFormData] = useState<AccountingYearFormData>({
    fromDate: '',
    toDate: '',
  })
  const [errors, setErrors] = useState<Errors>({})

  const getYearName = (fromDate: string, toDate: string) => {
  const fromYear = new Date(fromDate).getFullYear();
  const toYear = new Date(toDate).getFullYear().toString().slice(-2);
  console.log('toDate',new Date(fromDate).getFullYear().toString())

  return `FY ${fromYear}-${toYear}`;
};

  const handleChange = (field: keyof AccountingYearFormData, value: string) => {
    setFormData(prev => ({...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({...prev, [field]: undefined }))
  }

 const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
  e.preventDefault()
  setErrors({}) // Clear old errors

  try {
    // Validate with Zod
   const validatedData = accountingYearSchema.parse(formData)
console.log('validatedData',validatedData);
const payload = {
    fromDate: formData.fromDate,
    toDate: formData.toDate,
    yearName: getYearName(validatedData.fromDate, validatedData.toDate),
  };
console.log('payload',payload)
  const res =  await apiClient.post('/api/accountingYear/accounting-Year',payload) 
       

      if (res.status !== 201) {
  throw new Error("Save failed");
}


      const result = await res.data;
      console.log('API Response:', result)

    // Call API
    // const res = await fetch('/api/accounting-years', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(validatedData)
    // })

    // if (!res.ok) {
    //   const error = await res.json()
    //   throw new Error(error.message || 'Failed to create accounting year')
    // }
 // MOCK for frontend dev - remove when API ready and replace { id: Date.now().toString(),...validatedData } with await res.json()
    const _data = { id: Date.now().toString(),...validatedData }

    // 3. Success toast + callback
    toast.success('Accounting year added successfully')
     onSubmit?.(_data)
    onClose()

  } catch (error) {
    // 4. Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const fieldErrors: Errors = {}
      error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof AccountingYearFormData
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    // 5. Handle API/server errors
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('Something went wrong. Try again.')
    }
  }
}

  return (
    <>
      {/* Header */}
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-200 px-6 pt-6 pb-4">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-[#043793]">Add Accounting Year</h2>
          <p className="mt-1 text-sm text-slate-400">Create a new accounting year.</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <form
        id="accounting-year-form"
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto px-6 py-5"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="min-w-0">
            <label htmlFor="fromDate" className="my-1 block text-[12px] font-semibold text-[#94A3B8]">
              From
            </label>
            <input
              id="fromDate"
              type="date"
              value={formData.fromDate}
              onChange={(e) => handleChange('fromDate', e.target.value)}
              className={`w-full rounded-xl border px-4 py-2 text-sm focus:outline-none ${
                errors.fromDate ? 'border-red-500' : 'border-slate-300 focus:border-[#043793]'
              }`}
            />
            {errors.fromDate && <p className="mt-1 text-xs text-red-500">{errors.fromDate}</p>}
          </div>
          <div className="min-w-0">
            <label htmlFor="toDate" className="my-1 block text-[12px] font-semibold text-[#94A3B8]">
              To
            </label>
            <input
              id="toDate"
              type="date"
              value={formData.toDate}
              onChange={(e) => handleChange('toDate', e.target.value)}
              className={`w-full rounded-xl border px-4 py-2 text-sm focus:outline-none ${
                errors.toDate ? 'border-red-500' : 'border-slate-300 focus:border-[#043793]'
              }`}
            />
            {errors.toDate && <p className="mt-1 text-xs text-red-500">{errors.toDate}</p>}
          </div>
        </div>

        {/* <div>
            <label className="block text-sm text-slate-400 mb-1">Year Name</label>
            <input
                type="text"
                value={formData.yearName}
                onChange={(e) => handleChange('yearName', e.target.value)}
                placeholder="Enter year name"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#94A3B8] ${
                errors.yearName? 'border-red-500' : 'border-slate-300'
                }`}
            />
            {errors.yearName && <p className="text-xs text-red-500 mt-1">{errors.yearName}</p>}
        </div> */}
      </form>

      {/* Footer */}
      <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
        <button
          type="button"
          onClick={onClose}
          className="h-10 rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="accounting-year-form"
          className="h-10 rounded-lg bg-[linear-gradient(#093055,#043793)] px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          Add Year
        </button>
      </div>
    </>
  )
}
