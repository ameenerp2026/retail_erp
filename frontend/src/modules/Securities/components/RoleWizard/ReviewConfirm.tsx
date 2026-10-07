import { useState } from 'react'
import type { RoleWizardData } from '../../pages/RoleWizard'
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  FileEdit,
  Building2,
  Coins,
  Shield,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'

interface ReviewConfirmProps {
  roledata: RoleWizardData
  setRoleData?: React.Dispatch<React.SetStateAction<RoleWizardData>>
  onNext: () => void
  onBack: () => void
  onEditSection?: (step: number) => void
}

const accessLevelBadges: Record<string, { label: string; bg: string; text: string; border: string }> = {
  STANDARD: {
    label: 'Standard User',
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
  },
  MANAGER: {
    label: 'Manager Tier',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  ADMIN: {
    label: 'Administrator',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
  },
  SUPER_ADMIN: {
    label: 'Super Admin',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
  },
}

function ReviewConfirm({
  roledata,
  onNext,
  onBack,
  onEditSection,
}: ReviewConfirmProps) {
  const [isAgreed, setIsAgreed] = useState(true)

  const accessBadge =
    accessLevelBadges[roledata.accessLevel] ?? accessLevelBadges.STANDARD

  const permissions = roledata.permissions ?? []

  // Group permissions for cleaner preview
  const orgPerms = permissions.filter((p) => p.startsWith('ORG_') || p.startsWith('BUSINESS_') || p.startsWith('ACCOUNTING_') || p.startsWith('FINANCE_MONTH') || p.startsWith('GST'))
  const finPerms = permissions.filter((p) => p.startsWith('ACCOUNT_') || p.startsWith('LEDGER_') || p.startsWith('SUB_LEDGER_') || p.startsWith('CURRENCY_'))
  const secPerms = permissions.filter((p) => p.startsWith('ROLE_') || p.startsWith('USER_') || p.startsWith('AUDIT_') || p.startsWith('LICENSE_'))
  const utilPerms = permissions.filter((p) => p.startsWith('DATA_') || p.startsWith('E_') || p.startsWith('REPORT_') || p.startsWith('IMPORT_'))

  const groups = [
    { name: 'Organization', icon: Building2, list: orgPerms },
    { name: 'Finance', icon: Coins, list: finPerms },
    { name: 'Securities', icon: Shield, list: secPerms },
    { name: 'Utilities', icon: SlidersHorizontal, list: utilPerms },
  ].filter((g) => g.list.length > 0)

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
      {/* Header */}
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="text-base font-semibold text-[#043793]">Review & Confirm</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Verify configuration details and granted permissions before committing this role
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Role Information Card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#043793]" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Role Identity
              </h3>
            </div>
            {onEditSection && (
              <button
                type="button"
                onClick={() => onEditSection(1)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#043793] hover:text-blue-900 transition cursor-pointer"
              >
                <FileEdit size={12} />
                Edit Info
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
            <div>
              <p className="text-slate-400 font-medium uppercase text-[10px] tracking-wider">
                Role Name
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {roledata.roleName || '(Not specified)'}
              </p>
            </div>

            <div>
              <p className="text-slate-400 font-medium uppercase text-[10px] tracking-wider">
                Access Level Tier
              </p>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold border ${accessBadge.bg} ${accessBadge.text} ${accessBadge.border}`}
                >
                  <ShieldCheck size={13} />
                  {accessBadge.label}
                </span>
              </div>
            </div>

            <div className="md:col-span-2">
              <p className="text-slate-400 font-medium uppercase text-[10px] tracking-wider">
                Operational Description
              </p>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                {roledata.description || 'No description provided.'}
              </p>
            </div>
          </div>
        </div>

        {/* Permissions Breakdown Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-600" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Granted Permissions ({permissions.length})
              </h3>
            </div>
            {onEditSection && (
              <button
                type="button"
                onClick={() => onEditSection(2)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#043793] hover:text-blue-900 transition cursor-pointer"
              >
                <FileEdit size={12} />
                Edit Matrix
              </button>
            )}
          </div>

          {permissions.length === 0 ? (
            <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/60 p-4 mt-4 text-xs text-amber-800">
              <AlertTriangle size={18} className="shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold">No permissions selected!</p>
                <p className="mt-0.5 text-amber-700">
                  Users assigned to this role will not be able to perform any operational actions. You can return to Step 2 to assign permissions.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {groups.map((grp) => {
                const Icon = grp.icon
                return (
                  <div key={grp.name} className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <Icon size={14} className="text-[#043793]" />
                      <span>{grp.name}</span>
                      <span className="text-[10px] font-normal text-slate-400">
                        ({grp.list.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pl-5">
                      {grp.list.map((id) => (
                        <span
                          key={id}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                        >
                          {id.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Confirmation agreement */}
        <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#043793] focus:ring-2 focus:ring-blue-200 cursor-pointer"
          />
          <span className="text-xs text-slate-600">
            I confirm that these role details and permission grants adhere to organizational access control policies.
          </span>
        </label>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/40 rounded-b-2xl">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to Matrix
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!isAgreed || !roledata.roleName.trim()}
          className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-semibold text-white transition shadow-xs cursor-pointer ${
            isAgreed && roledata.roleName.trim()
              ? 'bg-[#043793] hover:bg-blue-900 active:scale-[0.98]'
              : 'bg-slate-300 cursor-not-allowed opacity-60'
          }`}
        >
          <CheckCircle2 size={14} />
          <span>Create & Activate Role</span>
        </button>
      </div>
    </div>
  )
}

export default ReviewConfirm