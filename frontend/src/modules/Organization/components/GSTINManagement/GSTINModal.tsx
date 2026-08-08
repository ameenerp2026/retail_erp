import { X } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/shared/Modal'
import FormInput from '@/components/forms/FormInput'
import { gstinSchema, type GstinFormData } from '@/components/forms/validate.schema'
import { getStates } from '@/services/location.service'
import { useOrganizationUnits } from '@/hooks/useOrganizationUnits'

type GSTINModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (data: GstinFormData) => void
  loading?: boolean
}

const TYPE_OPTIONS = [
  { label: 'Regular', value: 'Regular' },
  { label: 'Composition', value: 'Composition' },
]

export default function GSTINModal({ isOpen, onClose, onSave, loading }: GSTINModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GstinFormData>({
    resolver: zodResolver(gstinSchema),
    defaultValues: {
      gstin: '',
      state: '',
      orgUnit: '',
      type: undefined,
    },
  })

  useEffect(() => {
    if (isOpen) {
      reset({ gstin: '', state: '', orgUnit: '', type: undefined })
    }
  }, [isOpen, reset])

  // GST is India-specific — load Indian states
  const stateOptions = getStates('IN').map((s) => ({ label: s.name, value: s.name }))

  const { data: organizationUnits = [] } = useOrganizationUnits()
  const orgUnitOptions = organizationUnits.map(
    (unit: { id: number; organizationUnit: string }) => ({
      label: unit.organizationUnit,
      value: unit.organizationUnit,
    })
  )

  const onSubmit = (data: GstinFormData) => {
    onSave(data)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      {/* Header */}
      <div className="flex items-start justify-between px-6 pt-6 pb-4">
        <h3 className="text-lg font-semibold text-[#0F172A]">Add GSTIN</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 transition hover:bg-gray-100 hover:text-slate-600"
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6">
        <FormInput
          label="GSTIN"
          placeholder="enter GSTIN number"
          maxLength={15}
          {...register('gstin', {
            onChange: (e) => (e.target.value = e.target.value.toUpperCase()),
          })}
          error={errors.gstin?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="State"
            type="select"
            options={stateOptions}
            {...register('state')}
            error={errors.state?.message}
          />
          <FormInput
            label="Org Unit"
            type="select"
            options={orgUnitOptions}
            {...register('orgUnit')}
            error={errors.orgUnit?.message}
          />
        </div>

        <FormInput
          label="Type"
          type="select"
          options={TYPE_OPTIONS}
          {...register('type')}
          error={errors.type?.message}
        />

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 flex-1 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="h-11 flex-1 rounded-xl bg-[#2563EB] text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Add GSTIN'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
