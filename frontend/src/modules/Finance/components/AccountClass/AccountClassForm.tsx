import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { X } from 'lucide-react'
import { accountClassSchema, type AccountClassFormData } from '@/components/forms/validate.schema'
import FormInput from '@/components/forms/FormInput'

type Props = {
  onClose: () => void
}

export default function AccountClassForm({ onClose }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AccountClassFormData>({
    resolver: zodResolver(accountClassSchema),
    defaultValues: {
      className:    '',
      accountGroup: '',
      description:  '',
      status:       'Active',
    },
  })

  const currentStatus = watch('status')

  function onSubmit(data: AccountClassFormData) {
    try {
      console.log('Form data:', data)
      // call your API here
      // await accountClassService.create(data)
      toast.success('Account class created successfully!')
      onClose()
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-[512px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-4 pb-4 border-b border-gray-200 shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#043793]">
                Create Account Class
              </h2>
              <p className="text-[#94A3B8] text-sm mt-1">
                Add a new account classification.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          id="account-class-form"
          onSubmit={handleSubmit(onSubmit)}
          className="px-6 py-5 space-y-5 overflow-y-auto"
        >
          {/* Class Name */}
          <FormInput
            label="Class Name"
            required
            placeholder="e.g. Cash & Bank"
            error={errors.className?.message}
            {...register('className')}
          />

          {/* Account Group */}
          <FormInput
            label="Account Group"
            required
            error={errors.accountGroup?.message}
            {...register('accountGroup')}
          />

          {/* Description */}
          <FormInput
            label="Description"
            type="textarea"
            placeholder="Brief description of this classification..."
            error={errors.description?.message}
            {...register('description')}
          />

          {/* Status */}
          <div>
            <label className="block text-sm text-[#9CA3AF] mb-2">Status</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue('status', 'Active', { shouldValidate: true })}
                className={`h-10 px-4 rounded-lg text-sm font-medium border transition ${
                  currentStatus === 'Active'
                    ? 'text-[#22C55E] bg-[#22C55E26] border-[#22C55E4D]'
                    : 'text-[#9CA3AF] bg-[#F5F7FB] border-[#E5E7EB] hover:bg-slate-100'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setValue('status', 'Inactive', { shouldValidate: true })}
                className={`h-10 px-4 rounded-lg text-sm font-medium border transition ${
                  currentStatus === 'Inactive'
                    ? 'text-[#EF4444] bg-[#EF444426] border-[#EF44444D]'
                    : 'text-[#9CA3AF] bg-[#F5F7FB] border-[#E5E7EB] hover:bg-slate-100'
                }`}
              >
                Inactive
              </button>
            </div>
            {errors.status && (
              <p className="text-xs text-red-500 mt-1">{errors.status.message}</p>
            )}
          </div>
        </form>

        {/* Footer */}
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
            form="account-class-form"
            disabled={isSubmitting}
            className="h-10 px-4 rounded-lg bg-[linear-gradient(#093055,#043793)] text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Class'}
          </button>
        </div>

      </div>
    </div>
  )
}