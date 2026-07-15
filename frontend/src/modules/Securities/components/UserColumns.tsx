import type { ColumnsType } from 'antd/es/table'
import { CheckCircle2, Mail, Pencil, Trash2, XCircle } from 'lucide-react'
import StatusTag from '@/components/shared/StatusTags'
import type { AppUser, RoleTone } from '@/types/securities'

const ROLE_PILL: Record<RoleTone, string> = {
  red: 'bg-rose-50 text-rose-600',
  blue: 'bg-[#043793]/10 text-[#043793]',
  green: 'bg-teal-50 text-teal-700',
  orange: 'bg-amber-50 text-amber-700',
  sky: 'bg-sky-50 text-sky-700',
  purple: 'bg-violet-50 text-violet-700',
}

export function getUserColumns(): ColumnsType<AppUser> {
  return [
    {
      title: 'USER',
      key: 'user',
      render: (_text, record) => (
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${record.avatarColor}`}
          >
            {record.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#043793]">{record.name}</p>
            <p className="text-[11px] text-slate-400">{record.userId}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'EMAIL',
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => <span className="text-sm text-slate-500">{text}</span>,
    },
    {
      title: 'ROLE',
      dataIndex: 'role',
      key: 'role',
      render: (_text, record) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_PILL[record.roleTone]}`}
        >
          {record.role}
        </span>
      ),
    },
    {
      title: 'ORG UNIT',
      dataIndex: 'orgUnit',
      key: 'orgUnit',
      render: (text: string) => <span className="text-sm text-slate-600">{text}</span>,
    },
    {
      title: 'ONBOARDED',
      dataIndex: 'onboarded',
      key: 'onboarded',
      render: (onboarded: boolean) =>
        onboarded ? (
          <CheckCircle2 size={16} className="text-emerald-500" />
        ) : (
          <XCircle size={16} className="text-slate-300" />
        ),
    },
    {
      title: 'LAST LOGIN',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (text: string | null) => (
        <span className="text-sm text-slate-600">{text ?? 'Never'}</span>
      ),
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status: AppUser['status']) => <StatusTag status={status} />,
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: () => (
        <div className="flex items-center gap-1.5">
          <button type="button" className="rounded-lg p-1.5 text-blue-500 hover:bg-blue-50">
            <Pencil size={14} />
          </button>
          <button type="button" className="rounded-lg p-1.5 text-emerald-500 hover:bg-emerald-50">
            <Mail size={14} />
          </button>
          <button type="button" className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]
}
