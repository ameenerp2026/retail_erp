import { useState} from 'react'
import { toast } from 'react-hot-toast'
import { accountingYearSchema, AccountingYearFormData } from '@/components/forms/validate.schema'
import z from 'zod'
import { X } from 'lucide-react'
import apiClient from '../../../../services/apiClient'
import { formatFinancialYearName } from '@/utils/dateFormat'
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
    yearName: formatFinancialYearName(validatedData.fromDate, validatedData.toDate),
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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

      <div className="w-full max-w-[512px] bg-white rounded-lg shadow-2xl flex flex-col max-h- overflow-hidden">
             {/* Header */}
        <div className="px-6 pt-4 pb-4 border-b border-gray-200 shrink-0">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-xl font-bold text-[#043793]">
                        Add Accounting year
                    </h2>
                    <p className="text-[#94A3B8] text-sm mt-1">
                    create a new accounting year.
                    </p>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
                    <X size={20} />
                </button>
            </div>
        </div>
        {/*form*/}
        <form id="accounting-year-form" onSubmit={handleSubmit} className="px-6 py-5 space-y-5 overflow-y-auto">
            
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">From</label>
                        <input
                        type="date"
                        value={formData.fromDate}
                        onChange={(e) => handleChange('fromDate', e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#043793] ${
                            errors.fromDate? 'border-red-500' : 'border-slate-300'
                        }`}
                        />
                        {errors.fromDate && <p className="text-xs text-red-500 mt-1">{errors.fromDate}</p>}
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">To</label>
                        <input
                        type="date"
                        value={formData.toDate}
                        onChange={(e) => handleChange('toDate', e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#043793] ${
                            errors.toDate? 'border-red-500' : 'border-slate-300'
                        }`}
                        />
                        {errors.toDate && <p className="text-xs text-red-500 mt-1">{errors.toDate}</p>}
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
                </div>
             */}
        </form>
        {/*footer*/}
        <div className="px-6 py-4 bg-slate-50 border-t border-gray-200 flex justify-end gap-3 shrink-0">
            <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
             Cancel
            </button>
            <button
            type="submit"
            form="accounting-year-form"
            className="h-10 px-4 rounded-lg bg-[linear-gradient(#093055,#043793)] text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
            >
                Add Year
            </button>
        </div>
    </div>
    </div>
    </>
  )
}