import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, ChevronDown, RefreshCw } from 'lucide-react'
import { Modal } from '@/components/shared/Modal'
import { addUserSchema, type AddUserFormData } from '@/components/forms/validate.schema'
import type { SecurityRole } from '@/services/admin/securities/role.service'
import type {
  SecurityOrganizationUnit,
  SecurityUserListItem,
} from '@/services/admin/securities/user.service'

type UserFormModalProps = {
  isOpen: boolean
  mode: 'create' | 'edit'
  initialValues?: Partial<AddUserFormData>
  editingUserId?: number
  onClose: () => void
  onSubmit: (user: AddUserFormData) => Promise<void>
  roles: SecurityRole[]
  orgUnits: SecurityOrganizationUnit[]
  managers: SecurityUserListItem[]
  lookupsLoading: boolean
  lookupsError?: string
  detailsError?: string
  submitting: boolean
}

const EMPTY_VALUES: AddUserFormData = {
  fullName: '',
  email: '',
  roleId: 0,
  organizationUnitId: undefined,
  reportingManagerId: undefined,
  password: '',
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
  editingUserId,
  onClose,
  onSubmit,
  roles,
  orgUnits,
  managers,
  lookupsLoading,
  lookupsError,
  detailsError,
  submitting,
}: UserFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    control,
    formState: { errors },
  } = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema),
    defaultValues: EMPTY_VALUES,
  })

  useEffect(() => {
    if (isOpen && (mode === 'create' || initialValues)) {
      reset({ ...EMPTY_VALUES, ...initialValues })
    }
  }, [initialValues, isOpen, mode, reset])

  const selectedRoleId = useWatch({ control, name: 'roleId' })
  const selectedUnitId = useWatch({ control, name: 'organizationUnitId' })
  const password = useWatch({ control, name: 'password' })
  const selectedRole = roles.find((role) => role.id === selectedRoleId)
  const availableUnits = selectedRole
    ? orgUnits.filter(
        (unit) => unit.organizationGroupId === selectedRole.organizationGroupId,
      )
    : []
  const isEdit = mode === 'edit'
  const roleRegistration = register('roleId', {
    setValueAs: (value: string) => value ? Number(value) : 0,
  })

  async function submit(data: AddUserFormData) {
    if (!isEdit && (data.password?.length ?? 0) < 8) {
      setError('password', {
        type: 'manual',
        message: 'Password must be at least 8 characters',
      })
      return
    }

    await onSubmit(data)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth='md'>
      <div className='flex items-center justify-between border-b border-slate-100 px-6 py-4'>
        <h2 className='text-[17px] font-semibold text-slate-900'>
          {isEdit ? 'Edit User' : 'Add User'}
        </h2>
        <button
          type='button'
          onClick={onClose}
          aria-label='Close'
          className='rounded-md p-1 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600'
        >
          <X size={18} />
        </button>
      </div>

      {isEdit && !initialValues ? (
        <div className='space-y-4 p-8 text-center'>
          <p className={detailsError ? 'text-sm text-red-600' : 'text-sm text-slate-500'}>
            {detailsError ? `Failed to load user details: ${detailsError}` : 'Loading user details...'}
          </p>
          {detailsError && (
            <button
              type='button'
              onClick={onClose}
              className='rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600'
            >
              Close
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit(submit)} className='flex flex-1 flex-col overflow-hidden'>
          <div className='flex-1 space-y-4 overflow-y-auto px-6 py-5'>
            {lookupsError && (
              <p role='alert' className='rounded-lg bg-red-50 p-3 text-sm text-red-600'>
                Failed to load form options: {lookupsError}
              </p>
            )}

            <div>
              <label className='mb-1.5 block text-sm font-medium text-slate-700'>
                Full Name <span className='text-red-500'>*</span>
              </label>
              <input
                className={`${inputClasses} ${errors.fullName ? errorInputClasses : ''}`}
                placeholder='e.g. Priya Sharma'
                disabled={submitting}
                {...register('fullName')}
              />
              {errors.fullName && (
                <p className='mt-1 text-xs text-red-500'>{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium text-slate-700'>
                Email Address <span className='text-red-500'>*</span>
              </label>
              <input
                type='email'
                className={`${inputClasses} ${errors.email ? errorInputClasses : ''}`}
                placeholder='priya@retailshop.in'
                disabled={submitting}
                {...register('email')}
              />
              {errors.email && (
                <p className='mt-1 text-xs text-red-500'>{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium text-slate-700'>
                Role <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <select
                  className={`${inputClasses} appearance-none pr-9 ${errors.roleId ? errorInputClasses : ''}`}
                  disabled={lookupsLoading || submitting}
                  {...roleRegistration}
                  onChange={(event) => {
                    void roleRegistration.onChange(event)
                    const nextRoleId = Number(event.target.value)
                    const nextRole = roles.find((role) => role.id === nextRoleId)
                    if (
                      selectedUnitId &&
                      !orgUnits.some(
                        (unit) =>
                          unit.id === selectedUnitId &&
                          unit.organizationGroupId === nextRole?.organizationGroupId,
                      )
                    ) {
                      setValue('organizationUnitId', undefined, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  }}
                >
                  <option value='0'>Select role</option>
                  {roles
                    .filter(
                      (role) =>
                        role.status === 'ACTIVE' || role.id === selectedRoleId,
                    )
                    .map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}{role.status === 'INACTIVE' ? ' (Inactive)' : ''}
                      </option>
                    ))}
                </select>
                <ChevronDown size={16} className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400' />
              </div>
              {errors.roleId && (
                <p className='mt-1 text-xs text-red-500'>{errors.roleId.message}</p>
              )}
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium text-slate-700'>Org Unit</label>
              <div className='relative'>
                <select
                  className={`${inputClasses} appearance-none pr-9`}
                  disabled={!selectedRole || lookupsLoading || submitting}
                  {...register('organizationUnitId', {
                    setValueAs: (value: string) => value ? Number(value) : undefined,
                  })}
                >
                  <option value=''>
                    {!selectedRole
                      ? 'Select a role first'
                      : availableUnits.length
                        ? 'No unit / select unit'
                        : 'No units available for this role'}
                  </option>
                  {availableUnits.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.organizationUnit} ({unit.organizationGroup.shortName})
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400' />
              </div>
              {selectedRole && availableUnits.length === 0 && !lookupsLoading && (
                <p className='mt-1 text-xs text-slate-500'>
                  No organization units are available in this role’s organization group.
                </p>
              )}
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium text-slate-700'>
                Reporting Manager
              </label>
              <div className='relative'>
                <select
                  className={`${inputClasses} appearance-none pr-9`}
                  disabled={lookupsLoading || submitting}
                  {...register('reportingManagerId', {
                    setValueAs: (value: string) => value ? Number(value) : undefined,
                  })}
                >
                  <option value=''>No reporting manager</option>
                  {managers
                    .filter((manager) => manager.id !== editingUserId && manager.isActive)
                    .map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.name} ({manager.email})
                      </option>
                    ))}
                </select>
                <ChevronDown size={16} className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400' />
              </div>
            </div>

            {!isEdit && (
              <>
                <div>
                  <label className='mb-1.5 block text-sm font-medium text-slate-700'>
                    Password <span className='text-red-500'>*</span>
                  </label>
                  <div className='flex gap-2'>
                    <input
                      type='password'
                      autoComplete='new-password'
                      className={`${inputClasses} ${errors.password ? errorInputClasses : ''}`}
                      placeholder='Create password'
                      disabled={submitting}
                      {...register('password')}
                    />
                    <button
                      type='button'
                      onClick={() =>
                        setValue('password', generatePassword(), { shouldValidate: true })
                      }
                      disabled={submitting}
                      className='flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50'
                    >
                      <RefreshCw size={14} />
                      Generate
                    </button>
                  </div>
                  {errors.password && (
                    <p className='mt-1 text-xs text-red-500'>{errors.password.message}</p>
                  )}
                  {!errors.password && password && (
                    <p className='mt-1 text-xs text-slate-400'>
                      User can be asked to change this on first login.
                    </p>
                  )}
                </div>

              </>
            )}
          </div>

          <div className='flex justify-end gap-3 border-t border-slate-100 px-6 py-4'>
            <button
              type='button'
              onClick={onClose}
              disabled={submitting}
              className='rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={submitting || lookupsLoading || !!lookupsError}
              className='rounded-lg bg-[#1B2A4A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#152140] disabled:cursor-not-allowed disabled:opacity-60'
            >
              {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
