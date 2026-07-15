import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Settings,
  Shield,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { securitiesService } from '@/services/securitiesService'

const STEPS = [
  { id: 1, label: 'Role Info', icon: Shield },
  { id: 2, label: 'Permissions', icon: Settings },
  { id: 3, label: 'Review', icon: Eye },
] as const

export default function RoleWizardPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['permission-groups'],
    queryFn: securitiesService.getPermissionGroups,
  })

  const selectedCount = selected.size

  const togglePermission = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleGroup = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId)
    if (!group) return
    const ids = group.permissions.map((p) => p.id)
    const allSelected = ids.every((id) => selected.has(id))
    setSelected((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => {
        if (allSelected) next.delete(id)
        else next.add(id)
      })
      return next
    })
  }

  const selectedByGroup = useMemo(() => {
    return groups.map((group) => ({
      ...group,
      count: group.permissions.filter((p) => selected.has(p.id)).length,
    }))
  }, [groups, selected])

  if (isLoading) {
    return <div className="page-shell text-sm text-slate-500">Loading...</div>
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Role Wizard</h1>
          <p className="page-subtitle">
            Create a new role with fine-grained permission control
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
        {STEPS.map((s, index) => {
          const Icon = s.icon
          const done = step > s.id
          const active = step === s.id
          return (
            <div key={s.id} className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-[14px] ${
                    done
                      ? 'bg-emerald-500 text-white'
                      : active
                        ? 'bg-[linear-gradient(#093055,#043793)] text-white'
                        : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {done ? <Check size={16} /> : <Icon size={16} />}
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Step {s.id}</p>
                  <p
                    className={`text-xs font-semibold ${
                      active ? 'text-[#043793]' : 'text-slate-400'
                    }`}
                  >
                    {s.label}
                  </p>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`hidden h-0.5 w-8 sm:block sm:w-10 ${
                    done ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {step === 1 && (
        <div className="mx-auto max-w-xl">
          <div className="section-card space-y-4">
            <h2 className="section-title">Role Information</h2>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-400">
                Role Name *
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Branch Manager"
                className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-400">
                Description
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the role's responsibilities..."
                rows={3}
                className="w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
              />
            </label>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="section-card">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="section-title">Permission Matrix</h2>
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-700">
              {selectedCount} permissions selected
            </span>
          </div>

          <div className="space-y-6">
            {selectedByGroup.map((group) => {
              const allSelected =
                group.permissions.length > 0 &&
                group.count === group.permissions.length
              return (
                <div key={group.id}>
                  <div className="mb-3 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-semibold text-[#043793]">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={() => toggleGroup(group.id)}
                        className="rounded border-slate-300"
                      />
                      {group.name}
                    </label>
                    <span className="text-xs text-slate-400">
                      {group.count}/{group.permissions.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {group.permissions.map((perm) => (
                      <label
                        key={perm.id}
                        className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-600 hover:border-[#043793]/30"
                      >
                        <input
                          type="checkbox"
                          checked={selected.has(perm.id)}
                          onChange={() => togglePermission(perm.id)}
                          className="rounded border-slate-300"
                        />
                        {perm.label}
                      </label>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mx-auto max-w-xl">
          <div className="section-card space-y-5">
            <h2 className="section-title">Review & Confirm</h2>
            <div className="rounded-[14px] bg-slate-50 p-4">
              <p className="text-[11px] tracking-wide text-slate-400 uppercase">
                Role Name
              </p>
              <p className="mt-1 text-base font-bold text-[#043793]">
                {name.trim() || 'Untitled Role'}
              </p>
              {description.trim() && (
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  {description}
                </p>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                Permissions ({selectedCount} total)
              </p>
              {selectedCount === 0 ? (
                <p className="mt-2 text-xs text-rose-500">
                  No permissions selected. Go back and assign permissions.
                </p>
              ) : (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {groups
                    .flatMap((g) => g.permissions)
                    .filter((p) => selected.has(p.id))
                    .map((p) => (
                      <span
                        key={p.id}
                        className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                      >
                        {p.label}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div
        className={`mt-6 flex items-center justify-between gap-3 ${
          step === 2 ? 'w-full' : 'mx-auto max-w-xl'
        }`}
      >
        <button
          type="button"
          onClick={() => {
            if (step === 1) navigate('/securities/roles')
            else setStep((s) => s - 1)
          }}
          className="flex h-10 items-center gap-2 rounded-[14px] bg-slate-100 px-4 text-xs font-semibold text-slate-500"
        >
          <ArrowLeft size={14} />
          {step === 1 ? 'Cancel' : 'Back'}
        </button>

        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 1 && !name.trim()}
            className="flex h-10 items-center gap-2 rounded-[14px] bg-[linear-gradient(#093055,#043793)] px-4 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ArrowRight size={14} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/securities/roles')}
            className="flex h-10 items-center gap-2 rounded-[14px] bg-[linear-gradient(#22C55E,#16A34A)] px-4 text-xs font-semibold text-white"
          >
            Create Role
          </button>
        )}
      </div>
    </div>
  )
}
