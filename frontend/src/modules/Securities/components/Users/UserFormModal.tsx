import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, ChevronDown, RefreshCw } from 'lucide-react'
import { Modal } from '@/components/shared/Modal'
import { addUserSchema, type AddUserFormData } from '@/components/forms/validate.schema'

type UserFormModalProps = {
  isOpen: boolean
  mode: 'create' | 'edit'
  initialValues?: Partial<AddUserFormData>
  onClose: () => void
  onSubmit: (user: AddUserFormData) => void
  roles?: string[]
  orgUnits?: string[]
}

const DEFAULT_ROLES = [
  'Super Admin',
  'Finance Manager',
  'Branch Manager',
  'GST Operator',
  'Data Entry',
  'Auditor',
]

const DEFAULT_ORG_UNITS = [
  'HQ - Mumbai',
  'Delhi North',
  'Bangalore Central',
  'Hyderabad Central',
  'Pune West',
  'Kolkata East',
]

const EMPTY_VALUES: AddUserFormData = {
  fullName: '',
  email: '',
  role: '',
  orgUnit: '',
  reportingManager: '',
  password: '',
  sendOnboardingEmail: true,
}

const inputClasses =
  'w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A]/10'

const errorInputClasses = 'border-red-300 focus:border-red-400 focus:ring-red-100'

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$'
  let out = ''
  for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

export default function UserFormModal({
  isOpen,
  mode,
  initialValues,
  onClose,
  onSubmit,
  roles = DEFAULT_ROLES,
  orgUnits = DEFAULT_ORG_UNITS,
}: UserFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema),
    defaultValues: EMPTY_VALUES,
  })

  // Re-seed the form whenever the modal opens, with the record being edited (if any)
  useEffect(() => {
    if (isOpen) {
      reset({ ...EMPTY_VALUES, ...initialValues })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  function handleClose() {
    onClose()
  }

  function submit(data: AddUserFormData) {
    onSubmit(data)
  }

  const password = watch('password')
  const isEdit = mode === 'edit'

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="md">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <h2 className="text-[17px] font-semibold text-slate-900">{isEdit ? 'Edit User' : 'Add User'}</h2>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="rounded-md p-1 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit(submit)} className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              className={`${inputClasses} ${errors.fullName ? errorInputClasses : ''}`}
              placeholder="e.g. Priya Sharma"
              {...register('fullName')}
            />
            {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className={`${inputClasses} ${errors.email ? errorInputClasses : ''}`}
              placeholder="priya@retailshop.in"
              {...register('email')}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Role <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                className={`${inputClasses} appearance-none pr-9 ${errors.role ? errorInputClasses : ''}`}
                defaultValue=""
                {...register('role')}
              >
                <option value="" disabled>
                  Select role
                </option>
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Org Unit</label>
            <div className="relative">
              <select className={`${inputClasses} appearance-none pr-9`} defaultValue="" {...register('orgUnit')}>
                <option value="" disabled>
                  Select unit
                </option>
                {orgUnits.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Reporting Manager</label>
            <input className={inputClasses} placeholder="Search manager" {...register('reportingManager')} />
          </div>

          {/* Password + onboarding email only apply when creating a brand-new account */}
          {!isEdit && (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Generate Password</label>
                <div className="flex gap-2">
                  <input
                    className={`${inputClasses} ${errors.password ? errorInputClasses : ''}`}
                    placeholder="create password"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setValue('password', generatePassword(), { shouldValidate: true })}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    <RefreshCw size={14} />
                    Generate
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                {!errors.password && password && (
                  <p className="mt-1 text-xs text-slate-400">User can be asked to change this on first login.</p>
                )}
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#1B2A4A] focus:ring-[#1B2A4A]/30"
                  {...register('sendOnboardingEmail')}
                />
                <span>
                  <span className="block text-sm font-medium text-slate-800">Send Onboarding Email</span>
                  <span className="block text-xs text-slate-500">User will receive login credentials via email</span>
                </span>
              </label>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-[#1B2A4A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#152140]"
          >
            {isEdit ? 'Save Changes' : 'Create User'}
          </button>
        </div>
      </form>
    </Modal>
  )
}