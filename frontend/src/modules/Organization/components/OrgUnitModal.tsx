import { useEffect } from "react"
import { X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import FormInput from "@/components/forms/FormInput"
import { orgUnitSchema, type OrgUnitFormData } from "@/components/forms/validate.schema"

interface OrgUnit extends OrgUnitFormData {
  id?: string
}

interface OrgUnitModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (unit: OrgUnit) => void
  editData?: OrgUnit | null
  loading?: boolean
}

const unitTypes = [
  { label: 'Head Office', value: 'Head Office' },
  { label: 'Regional Office', value: 'Regional Office' },
  { label: 'Branch', value: 'Branch' },
  { label: 'Warehouse', value: 'Warehouse' }
]

const states = [
  { label: 'Maharashtra', value: 'MH' },
  { label: 'Karnataka', value: 'KA' },
  { label: 'Delhi', value: 'DL' }
  // TODO: Add full state list or fetch from API
]

export default function OrgUnitModal({ isOpen, onClose, onSave, editData,loading }: OrgUnitModalProps) {
  // TODO: Replace with actual org groups from API
  const orgGroups = [
    { label: 'RetailShop India', value: 'retailshop-india' },
    { label: 'RetailShop Global', value: 'retailshop-global' }
  ]

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<OrgUnitFormData>({
    resolver: zodResolver(orgUnitSchema),
    defaultValues: {
      name: '',
      type: undefined,
      group: '',
      gstin: '',
      manager: '',
      state: '',
      address: ''
    }
  })

  useEffect(() => {
    if (isOpen) {
      reset(editData || {
        name: '',
        type: undefined,
        group: '',
        gstin: '',
        manager: '',
        state: '',
        address: ''
      })
    }
  }, [isOpen, editData, reset])

  if (!isOpen) return null

  const onSubmit = (data: OrgUnitFormData) => {
    onSave(editData?.id ? { ...data, id: editData.id } : data)
    onClose()
  }

  const isEdit = !!editData

  return (
    // <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
    //   <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
    //     {/* Header */}
    //     <div className="flex items-start justify-between p-6 border-b border-gray-200 overflow-y-auto">
    //       <div>
    //         <h3 className="text-lg font-bold text-[#043793]">
    //           {isEdit ? 'Edit Org Unit' : 'Create Org Unit'}
    //         </h3>
    //         <p className="text-sm text-gray-500 mt-1">
    //           Add a new branch, regional office, or HQ
    //         </p>
    //       </div>
    //       <button
    //         onClick={onClose}
    //         className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
    //       >
    //         <X size={20} />
    //       </button>
    //     </div>

    //     {/* Form */}
    //     <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
    //       <div className="grid grid-cols-2 gap-4">
    //         <FormInput
    //           label="Unit Name"
    //           required
    //           placeholder="e.g. Mumbai South"
    //           {...register('name')}
    //           error={errors.name?.message}
    //         />

    //         <FormInput
    //           label="Unit Type"
    //           type="select"
    //           required
    //           options={unitTypes}
    //           placeholder="Head Office / Branch..."
    //           {...register('type')}
    //           error={errors.type?.message}
    //         />

    //         <FormInput
    //           label="Org Group"
    //           type="select"
    //           required
    //           options={orgGroups}
    //           placeholder="Select group"
    //           {...register('group')}
    //           error={errors.group?.message}
    //         />

    //         <FormInput
    //           label="GSTIN"
    //           required
    //           placeholder="27AABCS1429B1ZB"
    //           maxLength={15}
    //           {...register('gstin', {
    //             onChange: (e) => e.target.value = e.target.value.toUpperCase()
    //           })}
    //           error={errors.gstin?.message}
    //         />

    //         <FormInput
    //           label="Branch Manager"
    //           placeholder="Search by name"
    //           {...register('manager')}
    //           error={errors.manager?.message}
    //         />

    //         <FormInput
    //           label="State"
    //           type="select"
    //           options={states}
    //           {...register('state')}
    //           error={errors.state?.message}
    //         />
    //       </div>

    //       <FormInput
    //         label="Address"
    //         type="textarea"
    //         placeholder="Full address..."
    //         {...register('address')}
    //         error={errors.address?.message}
    //       />

    //       {/* Actions */}
    //       <div className="flex justify-end gap-3 pt-4">
    //         <button
    //           type="button"
    //           onClick={onClose}
    //           className="px-6 h-10 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
    //         >
    //           Cancel
    //         </button>
    //         <button
    //           type="submit"
    //           disabled={loading}
    //           className="px-6 h-10 rounded-lg bg-[#043793] text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
    //         >
    //           {loading ? 'Saving...' : isEdit ? 'Update Unit' : 'Create Unit'}
    //         </button>
    //       </div>
    //     </form>
    //   </div>
    // </div>
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
  <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
    {/* Scrollable body */}
    <div className="p-6 overflow-y-auto">
    <div className="flex items-start justify-between p-6 border-b border-gray-200">
       <div>
          <h3 className="text-lg font-bold text-[#043793]">
           {isEdit ? 'Edit Org Unit' : 'Create Org Unit'}
             </h3>
             <p className="text-sm text-gray-500 mt-1">
               Add a new branch, regional office, or HQ
             </p>
           </div>
           <button
             onClick={onClose}
             className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
           >
             <X size={20} />
           </button>
         </div>
    
        {/* Your form fields here */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <FormInput
               label="Unit Name"
               required
               placeholder="e.g. Mumbai South"
               {...register('name')}
               error={errors.name?.message}
             />
             <FormInput
               label="Unit Type"
               type="select"
               required
               options={unitTypes}
               placeholder="Head Office / Branch..."
               {...register('type')}
               error={errors.type?.message}
             />
            <FormInput
             label="Org Group"
             type="select"
             required
             options={orgGroups}
             placeholder="Select group"
             {...register('group')}
             error={errors.group?.message}
           />
           <FormInput
             label="GSTIN"
             required
             placeholder="27AABCS1429B1ZB"
             maxLength={15}
             {...register('gstin', {
               onChange: (e) => e.target.value = e.target.value.toUpperCase()
             })}
             error={errors.gstin?.message}
           />
            <FormInput
             label="Branch Manager"
             placeholder="Search by name"
             {...register('manager')}
             error={errors.manager?.message}
             />
            <FormInput
            label="State"
            type="select"
            options={states}
            {...register('state')}
            error={errors.state?.message}
            />
          </div>
          <FormInput
           label="Address"
           type="textarea"
           placeholder="Full address..."
           {...register('address')}
           error={errors.address?.message}
         />
          {/* Actions */}
            <div className="px-6 py-4 bg-slate-50 border-white flex justify-end gap-2 shrink-0">
      <button
               type="button"
               onClick={onClose}
               className="px-6 h-10 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
             >
               Cancel
             </button>
      <button
               type="submit"
               disabled={loading}
               className="px-6 h-10 rounded-lg bg-[#043793] text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
             >
               {loading ? 'Saving...' : isEdit ? 'Update Unit' : 'Create Unit'}
             </button>
    </div>
        </form>
    </div>

    {/* Sticky footer */}
   
  </div>
</div>  
  )
}