import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { AccessLevel, RoleWizardData } from '../../pages/RoleWizard'
import { UserRound, Users, Shield, Crown, Info, ArrowLeft, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'

const accessLevels = [
  {
    id: 'STANDARD' as AccessLevel,
    title: 'Standard',
    description: 'Basic access to assigned modules',
    icon: UserRound,
  },
  {
    id: 'MANAGER' as AccessLevel,
    title: 'Manager',
    description: 'Can manage team and modules',
    icon: Users,
  },
  {
    id: 'ADMIN' as AccessLevel,
    title: 'Admin',
    description: 'Administrative access across domains',
    icon: Shield,
  },
  {
    id: 'SUPER_ADMIN' as AccessLevel,
    title: 'Super Admin',
    description: 'Full system unrestricted access',
    icon: Crown,
  },
]

const rolePresets = [
  {
    name: 'Branch Manager',
    level: 'MANAGER' as AccessLevel,
    description: 'Oversees daily store operations, branch inventory receipts, and localized reporting.',
  },
  {
    name: 'Finance Controller',
    level: 'MANAGER' as AccessLevel,
    description: 'Maintains accounting ledgers, financial period locks, bank entries, and taxation.',
  },
  {
    name: 'Inventory Supervisor',
    level: 'STANDARD' as AccessLevel,
    description: 'Manages warehouse stock movements, bin tracking, purchase receipts, and audits.',
  },
  {
    name: 'System Administrator',
    level: 'ADMIN' as AccessLevel,
    description: 'Manages user accounts, security roles, organizational setup, and data imports.',
  },
]

interface Props {
  roledata: RoleWizardData
  setRoleData: React.Dispatch<React.SetStateAction<RoleWizardData>>
  onNext: () => void
  onCancel?: () => void
}

function RoleInformation({ roledata, setRoleData, onNext, onCancel }: Props) {
  const navigate = useNavigate()
  const isValid = roledata.roleName.trim().length > 0

  const updateField = <K extends keyof RoleWizardData>(
    field: K,
    value: RoleWizardData[K]
  ) => {
    setRoleData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleApplyPreset = (preset: typeof rolePresets[number]) => {
    setRoleData((prev) => ({
      ...prev,
      roleName: preset.name,
      description: preset.description,
      accessLevel: preset.level,
    }))
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      navigate('/securities/roles')
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
      {/* Card Header */}
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-[#043793]">Role Information</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Define the role identity, operational scope, and system access tier
            </p>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Sparkles size={12} className="text-amber-500" /> Presets:
            </span>
            {rolePresets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-[#043793] transition cursor-pointer"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Card Form Body */}
      <div className="p-6 space-y-6">
        {/* Role Name */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Role Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={roledata.roleName}
            onChange={(e) => updateField('roleName', e.target.value)}
            placeholder="e.g. Branch Operations Manager"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#043793] focus:ring-2 focus:ring-blue-100"
          />
          <p className="mt-1.5 text-xs text-slate-400">
            Choose a clear, descriptive title recognized across your organization.
          </p>
        </div>

        {/* Role Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Description <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <span className="text-xs text-slate-400">
              {roledata.description?.length ?? 0}/250
            </span>
          </div>
          <textarea
            value={roledata.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={3}
            maxLength={250}
            placeholder="Outline this role's key responsibilities, authorization scope, and operational boundaries..."
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#043793] focus:ring-2 focus:ring-blue-100 resize-none"
          />
        </div>

        {/* Access Level */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Access Level <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {accessLevels.map((level) => {
              const Icon = level.icon
              const isSelected = roledata.accessLevel === level.id

              return (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => updateField('accessLevel', level.id)}
                  className={`relative flex flex-col items-start p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#043793] bg-blue-50/60 ring-2 ring-blue-100 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-[#043793] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    {isSelected && (
                      <CheckCircle2 size={18} className="text-[#043793]" />
                    )}
                  </div>

                  <p className="text-sm font-semibold text-slate-800">
                    {level.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    {level.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Info callout */}
        <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-xs text-[#043793]">
          <Info size={18} className="shrink-0 text-[#043793]" />
          <p>
            The selected access level controls baseline privileges and module visibility. You will refine granular permissions in the next step.
          </p>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/40 rounded-b-2xl">
        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
        >
          <ArrowLeft size={14} />
          Cancel
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white transition shadow-xs cursor-pointer ${
            isValid
              ? 'bg-[#043793] hover:bg-blue-900 active:scale-[0.98]'
              : 'bg-slate-300 cursor-not-allowed opacity-60'
          }`}
        >
          <span>Next: Permission Matrix</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}

export default RoleInformation