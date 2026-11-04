import React from 'react'
import type { RolePermission } from '@/services/admin/securities/role.service'
import type { RoleWizardData } from '../../pages/RoleWizard'

interface PermissionMatrixProps {
  roledata: RoleWizardData
  setRoleData: React.Dispatch<React.SetStateAction<RoleWizardData>>
  onBack: () => void
  onNext: () => void
  permissions: RolePermission[]
  loading: boolean
  error?: string
}

function PermissionMatrix({
  roledata,
  setRoleData,
  onBack,
  onNext,
  permissions,
  loading,
  error,
}: PermissionMatrixProps) {
  const selectedPermissions = roledata.permissions
  const groupedPermissions = permissions.reduce((groups, permission) => {
    const modulePermissions = groups.get(permission.module) ?? []
    modulePermissions.push(permission)
    groups.set(permission.module, modulePermissions)
    return groups
  }, new Map<string, RolePermission[]>())
  const allPermissionIds = permissions.map((permission) => permission.id)
  const isAllSelected =
    allPermissionIds.length > 0 &&
    allPermissionIds.every((id) => selectedPermissions.includes(id))

  const handlePermissionChange = (permissionId: number) => {
    setRoleData((previous) => ({
      ...previous,
      permissions: previous.permissions.includes(permissionId)
        ? previous.permissions.filter((id) => id !== permissionId)
        : [...previous.permissions, permissionId],
    }))
  }

  const handleSelectAll = () => {
    setRoleData((previous) => ({
      ...previous,
      permissions: allPermissionIds,
    }))
  }

  const handleClearAll = () => {
    setRoleData((previous) => ({
      ...previous,
      permissions: [],
    }))
  }

  const handleModuleChange = (permissionIds: number[], select: boolean) => {
    setRoleData((previous) => ({
      ...previous,
      permissions: select
        ? Array.from(new Set([...previous.permissions, ...permissionIds]))
        : previous.permissions.filter((id) => !permissionIds.includes(id)),
    }))
  }

  return (
    <div className='w-full rounded-2xl border border-slate-200 bg-white shadow-sm'>
      <div className='flex flex-col gap-3 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h2 className='text-sm font-semibold text-[#123B63]'>Permission Matrix</h2>
          <p className='mt-1 text-xs text-slate-500'>
            Select the permissions this role should have.
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600'>
            {selectedPermissions.length} permissions selected
          </span>
          <button
            type='button'
            onClick={handleSelectAll}
            disabled={loading || !!error || isAllSelected || permissions.length === 0}
            className='rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50'
          >
            Select All
          </button>
          <button
            type='button'
            onClick={handleClearAll}
            disabled={selectedPermissions.length === 0}
            className='rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50'
          >
            Clear All
          </button>
        </div>
      </div>

      {loading ? (
        <p className='p-8 text-center text-sm text-slate-500'>Loading permissions...</p>
      ) : error ? (
        <p role='alert' className='p-8 text-center text-sm text-red-600'>
          Failed to load permissions: {error}
        </p>
      ) : permissions.length === 0 ? (
        <p className='p-8 text-center text-sm text-slate-500'>
          No permissions are available.
        </p>
      ) : (
        <div className='space-y-3 p-4'>
          {Array.from(groupedPermissions.entries()).map(([module, modulePermissions]) => {
            const modulePermissionIds = modulePermissions.map(({ id }) => id)
            const selectedCount = modulePermissionIds.filter((id) =>
              selectedPermissions.includes(id),
            ).length
            const moduleFullySelected =
              selectedCount === modulePermissionIds.length

            return (
              <section
                key={module}
                className='overflow-hidden rounded-xl border border-slate-200'
              >
                <div className='flex items-center justify-between bg-slate-50 px-4 py-3'>
                  <div className='flex items-center gap-2'>
                    <h3 className='text-sm font-semibold text-slate-700'>{module}</h3>
                    <span className='text-[11px] font-medium text-slate-400'>
                      {selectedCount}/{modulePermissionIds.length}
                    </span>
                  </div>
                  <button
                    type='button'
                    onClick={() =>
                      handleModuleChange(modulePermissionIds, !moduleFullySelected)
                    }
                    className='text-xs font-medium text-blue-600 transition hover:text-blue-700'
                  >
                    {moduleFullySelected ? 'Clear All' : 'Select All'}
                  </button>
                </div>
                <div className='grid grid-cols-1 gap-2 p-3 md:grid-cols-2 xl:grid-cols-3'>
                  {modulePermissions.map((permission) => {
                    const checked = selectedPermissions.includes(permission.id)

                    return (
                      <label
                        key={permission.id}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 transition ${
                          checked
                            ? 'border-blue-200 bg-blue-50'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type='checkbox'
                          checked={checked}
                          onChange={() => handlePermissionChange(permission.id)}
                          className='h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500'
                        />
                        <span className='text-sm text-slate-700'>
                          {permission.name}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      )}

      <div className='flex items-center justify-between border-t border-slate-100 px-5 py-4'>
        <button
          type='button'
          onClick={onBack}
          className='rounded-lg bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-200'
        >
          ← Back
        </button>
        <button
          type='button'
          onClick={onNext}
          disabled={loading || !!error || permissions.length === 0}
          className='rounded-lg bg-[#123B63] px-5 py-2 text-xs font-medium text-white transition hover:bg-[#0f3152] disabled:cursor-not-allowed disabled:opacity-60'
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export default PermissionMatrix
