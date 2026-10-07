import { useState } from 'react'
import type { RoleWizardData } from '../../pages/RoleWizard'
import {
  Search,
  Building2,
  Coins,
  Shield,
  SlidersHorizontal,
  ArrowLeft,
  ArrowRight,
  CheckCheck,
  XCircle,
  type LucideIcon,
} from 'lucide-react'

interface PermissionMatrixProps {
  roledata: RoleWizardData
  setRoleData: React.Dispatch<React.SetStateAction<RoleWizardData>>
  onBack: () => void
  onNext: () => void
}

interface PermissionGroup {
  module: string
  icon: LucideIcon
  description: string
  permissions: { id: string; label: string; description?: string }[]
}

const permissionGroups: PermissionGroup[] = [
  {
    module: 'Organization',
    icon: Building2,
    description: 'Corporate hierarchy, branches, business locations, and fiscal years',
    permissions: [
      { id: 'ORG_GROUP_VIEW', label: 'View Org Group' },
      { id: 'ORG_GROUP_EDIT', label: 'Edit Org Group' },
      { id: 'ORG_UNIT_VIEW', label: 'View Org Units' },
      { id: 'ORG_UNIT_EDIT', label: 'Edit Org Units' },
      { id: 'BUSINESS_LOCATION_MANAGE', label: 'Manage Business Locations' },
      { id: 'ACCOUNTING_YEAR_MANAGE', label: 'Manage Accounting Year' },
      { id: 'FINANCE_MONTH_VIEW', label: 'View Finance Months' },
      { id: 'FINANCE_MONTH_EDIT', label: 'Edit Finance Months' },
      { id: 'GSTIN_MANAGE', label: 'Manage GSTIN' },
      { id: 'GST_STATE_MANAGE', label: 'Manage GST State' },
    ],
  },
  {
    module: 'Finance',
    icon: Coins,
    description: 'Chart of accounts, general ledger, sub-ledgers, and currencies',
    permissions: [
      { id: 'ACCOUNT_GROUP_VIEW', label: 'View Account Groups' },
      { id: 'ACCOUNT_GROUP_EDIT', label: 'Edit Account Groups' },
      { id: 'ACCOUNT_CLASS_VIEW', label: 'View Account Classes' },
      { id: 'ACCOUNT_CLASS_EDIT', label: 'Edit Account Classes' },
      { id: 'LEDGER_VIEW', label: 'View Ledgers' },
      { id: 'LEDGER_EDIT', label: 'Edit Ledgers' },
      { id: 'LEDGER_DELETE', label: 'Delete Ledgers' },
      { id: 'SUB_LEDGER_VIEW', label: 'View Sub-Ledgers' },
      { id: 'SUB_LEDGER_EDIT', label: 'Edit Sub-Ledgers' },
      { id: 'CURRENCY_MANAGE', label: 'Manage Currencies' },
    ],
  },
  {
    module: 'Securities',
    icon: Shield,
    description: 'User access control, role definitions, audit logs, and licenses',
    permissions: [
      { id: 'ROLE_VIEW', label: 'View Roles' },
      { id: 'ROLE_CREATE', label: 'Create Roles' },
      { id: 'ROLE_EDIT', label: 'Edit Roles' },
      { id: 'ROLE_DELETE', label: 'Delete Roles' },
      { id: 'USER_MANAGE', label: 'Manage Users' },
      { id: 'USER_LOG_VIEW', label: 'View User Logs' },
      { id: 'AUDIT_LOG_EXPORT', label: 'Export Audit Logs' },
      { id: 'LICENSE_VIEW', label: 'View User Licenses' },
    ],
  },
  {
    module: 'Utilities',
    icon: SlidersHorizontal,
    description: 'Data import tools, electronic invoicing, e-way bills, and system utilities',
    permissions: [
      { id: 'DATA_IMPORT', label: 'Import Data' },
      { id: 'E_INVOICE_GENERATE', label: 'Generate E-Invoice' },
      { id: 'E_WAY_BILL_GENERATE', label: 'Generate E-Way Bill' },
      { id: 'REPORT_EXPORT', label: 'Export Reports' },
      { id: 'IMPORT_LOG_VIEW', label: 'View Import Logs' },
    ],
  },
]

function PermissionMatrix({ roledata, setRoleData, onBack, onNext }: PermissionMatrixProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const selectedPermissions = roledata.permissions ?? []

  const allPermissionIds = permissionGroups.flatMap((group) =>
    group.permissions.map((p) => p.id)
  )

  const handlePermissionChange = (permissionId: string) => {
    setRoleData((prev) => {
      const current = prev.permissions ?? []
      const exists = current.includes(permissionId)
      return {
        ...prev,
        permissions: exists
          ? current.filter((id) => id !== permissionId)
          : [...current, permissionId],
      }
    })
  }

  const handleSelectAll = () => {
    setRoleData((prev) => ({
      ...prev,
      permissions: allPermissionIds,
    }))
  }

  const handleClearAll = () => {
    setRoleData((prev) => ({
      ...prev,
      permissions: [],
    }))
  }

  const handleSelectModule = (permissionIds: string[]) => {
    setRoleData((prev) => {
      const current = prev.permissions ?? []
      return {
        ...prev,
        permissions: Array.from(new Set([...current, ...permissionIds])),
      }
    })
  }

  const handleClearModule = (permissionIds: string[]) => {
    setRoleData((prev) => ({
      ...prev,
      permissions: (prev.permissions ?? []).filter((id) => !permissionIds.includes(id)),
    }))
  }

  const isAllSelected =
    allPermissionIds.length > 0 && selectedPermissions.length === allPermissionIds.length

  // Filter groups based on search term
  const filteredGroups = permissionGroups
    .map((group) => {
      const matchingPermissions = group.permissions.filter((p) =>
        p.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.module.toLowerCase().includes(searchTerm.toLowerCase())
      )
      return {
        ...group,
        permissions: matchingPermissions,
      }
    })
    .filter((group) => group.permissions.length > 0)

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
      {/* Header */}
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#043793]">Permission Matrix</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select module authorizations and operational actions assigned to this role
            </p>
          </div>

          {/* Quick search */}
          <div className="relative w-full md:w-64">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter permissions..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#043793] focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-3 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {selectedPermissions.length} of {allPermissionIds.length} permissions granted
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSelectAll}
            disabled={isAllSelected}
            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <CheckCheck size={14} />
            Select All
          </button>

          <button
            type="button"
            onClick={handleClearAll}
            disabled={selectedPermissions.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <XCircle size={14} />
            Clear All
          </button>
        </div>
      </div>

      {/* Groups List */}
      <div className="p-6 space-y-5 max-h-[580px] overflow-y-auto">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">
            No permissions matching "{searchTerm}"
          </div>
        ) : (
          filteredGroups.map((group) => {
            const Icon = group.icon
            const modulePermissionIds = group.permissions.map((p) => p.id)
            const moduleSelectedCount = modulePermissionIds.filter((id) =>
              selectedPermissions.includes(id)
            ).length
            const isModuleFullySelected =
              modulePermissionIds.length > 0 &&
              moduleSelectedCount === modulePermissionIds.length

            return (
              <div
                key={group.module}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-slate-300"
              >
                {/* Module Header */}
                <div className="flex items-center justify-between bg-slate-50/80 px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-slate-200 text-[#043793]">
                      <Icon size={14} />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-slate-800">
                        {group.module}
                      </h3>
                      <p className="text-[11px] text-slate-400 hidden sm:block">
                        {group.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-slate-500">
                      {moduleSelectedCount}/{modulePermissionIds.length}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        isModuleFullySelected
                          ? handleClearModule(modulePermissionIds)
                          : handleSelectModule(modulePermissionIds)
                      }
                      className="text-xs font-semibold text-[#043793] hover:text-blue-900 transition cursor-pointer"
                    >
                      {isModuleFullySelected ? 'Clear Module' : 'Select Module'}
                    </button>
                  </div>
                </div>

                {/* Permissions Grid */}
                <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.permissions.map((permission) => {
                    const checked = selectedPermissions.includes(permission.id)

                    return (
                      <label
                        key={permission.id}
                        className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-2.5 transition select-none ${
                          checked
                            ? 'border-blue-300 bg-blue-50/60 text-slate-800 shadow-2xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50/60 text-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handlePermissionChange(permission.id)}
                          className="h-4 w-4 rounded border-slate-300 text-[#043793] focus:ring-2 focus:ring-blue-200 cursor-pointer"
                        />
                        <span className="text-xs font-medium truncate">
                          {permission.label}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/40 rounded-b-2xl">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-xl bg-[#043793] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-900 active:scale-[0.98] shadow-xs cursor-pointer"
        >
          <span>Next: Review & Confirm</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}

export default PermissionMatrix
