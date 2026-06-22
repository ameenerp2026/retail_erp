import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { OrgUnitFormData, orgUnitSchema } from '@/components/forms/validate.schema'

type Props = {
  editData: OrgUnitFormData | null
  loading: boolean
  onClose: () => void
  onSave: (data: OrgUnitFormData) => void
}

export function OrgUnitForm({ editData, loading, onClose, onSave }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<OrgUnitFormData>({
    resolver: zodResolver(orgUnitSchema),
    defaultValues: editData || {
      name: '',
      type: undefined,
      gstin: '',
      manager: '',
      group: '',
      state: '',
      address: ''
    }
  })

  const onSubmit = (data: OrgUnitFormData) => {
    onSave({...editData,...data })
  }

  const inputClass = "mt-1.5 w-full h-10 px-3 rounded-lg border text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#043793] transition"
  const labelClass = "text-sm font-medium text-gray-700"
  const errorClass = "text-xs text-red-600 mt-1"

  return (
    <>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-200 shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#043793]">
              {editData? 'Edit Org Unit' : 'Create Org Unit'}
            </h2>
            <p className="text-[#94A3B8] text-sm mt-1">
              Add a new branch, regional office, or HQ
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="px-6 py-5 overflow-y-auto">
        <form id="org-unit-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>
                Unit Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name')}
                className={`${inputClass} ${errors.name? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#043793]'}`}
                placeholder="e.g. Mumbai South"
              />
              {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            </div>
            
            <div>
              <label className={labelClass}>
                Unit Type <span className="text-red-500">*</span>
              </label>
              <select 
                {...register('type')}
                className={`${inputClass} ${errors.type? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#043793]'}`}
              >
                <option value="" disabled>Select type</option>
                <option value="Head Office">Head Office</option>
                <option value="Branch">Branch</option>
                <option value="Regional Office">Regional Office</option>
              </select>
              {errors.type && <p className={errorClass}>{errors.type.message}</p>}
            </div>

            <div>
              <label className={labelClass}>
                GSTIN <span className="text-red-500">*</span>
              </label>
              <input
                {...register('gstin')}
                className={`${inputClass} ${errors.gstin? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#043793]'}`}
                placeholder="27AABCS1429B1ZB"
              />
              {errors.gstin && <p className={errorClass}>{errors.gstin.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Manager</label>
              <input
                {...register('manager')}
                className={`${inputClass} ${errors.manager? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#043793]'}`}
                placeholder="Raj Kumar"
              />
              {errors.manager && <p className={errorClass}>{errors.manager.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Group</label>
              <input
                {...register('group')}
                className={`${inputClass} border-gray-300 focus:border-[#043793]`}
                placeholder="retailshop-india"
              />
            </div>

            <div>
              <label className={labelClass}>State</label>
              <input
                {...register('state')}
                className={`${inputClass} border-gray-300 focus:border-[#043793]`}
                placeholder="KA"
              />
            </div>

            <div className="col-span-2">
              <label className={labelClass}>Address</label>
              <input
                {...register('address')}
                className={`${inputClass} border-gray-300 focus:border-[#043793]`}
                placeholder="Bangalore"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-slate-50 border-t border-gray-200 flex justify-end gap-3 shrink-0">
        <button 
          onClick={onClose} 
          className="h-10 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="org-unit-form"
          disabled={loading}
          className="h-10 px-4 rounded-lg bg-[linear-gradient(#093055,#043793)] text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading? 'Saving...' : editData? 'Update Unit' : 'Create Unit'}
        </button>
      </div>
    </>
  )
}