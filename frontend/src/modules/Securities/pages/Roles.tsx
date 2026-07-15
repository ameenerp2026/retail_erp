import { Copy, Lock, Pencil, Plus, Shield, Trash2, Users } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { securitiesService } from '@/services/securitiesService'
import type { RoleTone } from '@/types/securities'

const TONE: Record<RoleTone, { iconBg: string; icon: string; badge: string }> = {
  red: {
    iconBg: 'bg-rose-50',
    icon: 'text-rose-500',
    badge: 'bg-rose-50 text-rose-600',
  },
  blue: {
    iconBg: 'bg-blue-50',
    icon: 'text-blue-600',
    badge: 'bg-blue-50 text-blue-700',
  },
  green: {
    iconBg: 'bg-emerald-50',
    icon: 'text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-700',
  },
  orange: {
    iconBg: 'bg-amber-50',
    icon: 'text-amber-600',
    badge: 'bg-amber-50 text-amber-700',
  },
  sky: {
    iconBg: 'bg-sky-50',
    icon: 'text-sky-600',
    badge: 'bg-sky-50 text-sky-700',
  },
  purple: {
    iconBg: 'bg-violet-50',
    icon: 'text-violet-600',
    badge: 'bg-violet-50 text-violet-700',
  },
}

export default function RolesPage() {
  const navigate = useNavigate()
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: securitiesService.getRoles,
  })

  if (isLoading) {
    return <div className="page-shell text-sm text-slate-500">Loading...</div>
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Roles</h1>
          <p className="page-subtitle">
            {roles.length} roles configured — manage access control
          </p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            onClick={() => navigate('/securities/role-wizard')}
            className="flex h-9 items-center gap-2 rounded-[14px] bg-[linear-gradient(#093055,#043793)] px-3 text-xs font-semibold text-white sm:px-4"
          >
            <Plus size={13} />
            Create Role
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => {
          const tone = TONE[role.tone]
          return (
            <div
              key={role.id}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-start gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] ${tone.iconBg}`}
                >
                  <Shield size={18} className={tone.icon} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-[#043793]">{role.name}</p>
                    {role.locked && <Lock size={12} className="text-slate-400" />}
                  </div>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${tone.badge}`}
                  >
                    {role.badge}
                  </span>
                </div>
              </div>

              <p className="mb-4 text-xs leading-relaxed text-slate-400">
                {role.description}
              </p>

              <div className="mb-4 flex items-center gap-4 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Users size={12} />
                  {role.userCount} users
                </span>
                <span className="inline-flex items-center gap-1">
                  <Shield size={12} />
                  {role.permissionCount} permissions
                </span>
              </div>

              <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-50 text-xs font-semibold text-blue-600"
                >
                  <Pencil size={12} />
                  Edit
                </button>
                <button
                  type="button"
                  className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-50 text-xs font-semibold text-emerald-600"
                >
                  <Copy size={12} />
                  Clone
                </button>
                {role.deletable && (
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-500"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
