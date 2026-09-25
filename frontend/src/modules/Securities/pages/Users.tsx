import { useMemo, useState } from 'react'
import type { ColumnsType } from 'antd/es/table'
import {
  Search,
  Download,
  Plus,
  Pencil,
  Mail,
  Trash2,
  CheckCircle2,
  Clock3,
} from 'lucide-react'
import ReusableTable from '@/components/shared/ReusableTable'
import UserFormModal from '../components/Users/UserFormModal'
import type { AddUserFormData } from '@/components/forms/validate.schema'
import toast from 'react-hot-toast'

type UserStatus = 'Active' | 'Inactive' | 'Pending'

type SecuritiesUser = {
  id: string
  userId: string
  name: string
  email: string
  role: string
  orgUnit: string
  onboarded: boolean
  lastLogin: string | null
  status: UserStatus
}

const INITIAL_USERS: SecuritiesUser[] = [
  {
    id: 'USR-001',
    userId: 'USR-001',
    name: 'Admin User',
    email: 'admin@streamys.in',
    role: 'Super Admin',
    orgUnit: 'HQ - Mumbai',
    onboarded: true,
    lastLogin: '21 May 2026',
    status: 'Active',
  },
  {
    id: 'USR-002',
    userId: 'USR-002',
    name: 'Priya Sharma',
    email: 'priya.sharma@retailshop.in',
    role: 'Finance Manager',
    orgUnit: 'HQ - Mumbai',
    onboarded: true,
    lastLogin: '21 May 2026',
    status: 'Active',
  },
  {
    id: 'USR-003',
    userId: 'USR-003',
    name: 'Raj Kumar',
    email: 'raj.kumar@retailshop.in',
    role: 'Branch Manager',
    orgUnit: 'Delhi North',
    onboarded: true,
    lastLogin: '20 May 2026',
    status: 'Active',
  },
  {
    id: 'USR-004',
    userId: 'USR-004',
    name: 'Meena Joshi',
    email: 'meena.joshi@retailshop.in',
    role: 'GST Operator',
    orgUnit: 'Bangalore Central',
    onboarded: true,
    lastLogin: '19 May 2026',
    status: 'Active',
  },
  {
    id: 'USR-005',
    userId: 'USR-005',
    name: 'Suresh Reddy',
    email: 'suresh.reddy@retailshop.in',
    role: 'Branch Manager',
    orgUnit: 'Hyderabad Central',
    onboarded: false,
    lastLogin: '10 May 2026',
    status: 'Inactive',
  },
  {
    id: 'USR-006',
    userId: 'USR-006',
    name: 'Arun Patel',
    email: 'arun.patel@retailshop.in',
    role: 'Data Entry',
    orgUnit: 'Pune West',
    onboarded: true,
    lastLogin: '21 May 2026',
    status: 'Active',
  },
  {
    id: 'USR-007',
    userId: 'USR-007',
    name: 'Bikash Roy',
    email: 'bikash.roy@retailshop.in',
    role: 'Auditor',
    orgUnit: 'Kolkata East',
    onboarded: false,
    lastLogin: null,
    status: 'Pending',
  },
]

const ROLE_STYLES: Record<string, string> = {
  'Super Admin': 'bg-rose-50 text-rose-600',
  'Finance Manager': 'bg-blue-50 text-blue-600',
  'Branch Manager': 'bg-emerald-50 text-emerald-600',
  'GST Operator': 'bg-amber-50 text-amber-600',
  'Data Entry': 'bg-sky-50 text-sky-600',
  Auditor: 'bg-violet-50 text-violet-600',
}

const STATUS_STYLES: Record<UserStatus, string> = {
  Active: 'bg-emerald-50 text-emerald-600',
  Inactive: 'bg-rose-50 text-rose-600',
  Pending: 'bg-amber-50 text-amber-600',
}

const AVATAR_PALETTE = [
  'bg-violet-100 text-violet-700',
  'bg-pink-100 text-pink-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-indigo-100 text-indigo-700',
  'bg-teal-100 text-teal-700',
]

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
}

function avatarColor(seed: string) {
  const idx = seed.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % AVATAR_PALETTE.length
  return AVATAR_PALETTE[idx]
}

export default function Users() {
  const [users, setUsers] = useState<SecuritiesUser[]>(INITIAL_USERS)
  const [query, setQuery] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<SecuritiesUser | null>(null)

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.orgUnit.toLowerCase().includes(q)
    )
  }, [users, query])

  const activeCount = useMemo(() => users.filter((u) => u.status === 'Active').length, [users])

  const isModalOpen = isAddOpen || editingUser !== null
  const modalMode = editingUser ? 'edit' : 'create'

  function closeModal() {
    setIsAddOpen(false)
    setEditingUser(null)
  }

  async function handleCreateUser(payload: AddUserFormData) {
    try {
      const emailTaken = users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())
      if (emailTaken) {
        throw new Error(`A user with ${payload.email} already exists`)
      }

      // TODO: replace with real API call, e.g.
      // const created = await api.post('/securities/users', payload)
      const nextIndex = users.length + 1
      const userId = `USR-${String(nextIndex).padStart(3, '0')}`
      const newUser: SecuritiesUser = {
        id: userId,
        userId,
        name: payload.fullName,
        email: payload.email,
        role: payload.role,
        orgUnit: payload.orgUnit || '—',
        onboarded: false,
        lastLogin: null,
        status: 'Pending',
      }

      setUsers((prev) => [...prev, newUser])
      closeModal()
      toast.success(`${payload.fullName} was added`)
    } catch (err) {
      const description = err instanceof Error ? err.message : 'Failed to add user. Please try again.'
      toast.error(description)
    }
  }

  async function handleUpdateUser(payload: AddUserFormData) {
    if (!editingUser) return
    try {
      // TODO: replace with real API call, e.g.
      // const updated = await api.patch(`/securities/users/${editingUser.id}`, payload)
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: payload.fullName,
                email: payload.email,
                role: payload.role,
                orgUnit: payload.orgUnit || u.orgUnit,
              }
            : u
        )
      )
      closeModal()
      toast.success(`${payload.fullName} was updated`)
    } catch (err) {
      const description = err instanceof Error ? err.message : 'Failed to update user. Please try again.'
      toast.error(description)
    }
  }

  async function handleModalSubmit(payload: AddUserFormData) {
    if (modalMode === 'edit') await handleUpdateUser(payload)
    else await handleCreateUser(payload)
  }

  async function handleDelete(user: SecuritiesUser) {
    try {
      // TODO: replace with real API call, e.g.
      // await api.delete(`/securities/users/${user.id}`)
      setUsers((prev) => prev.filter((u) => u.id !== user.id))
      toast.success(`${user.name} was removed`)
    } catch (err) {
      const description = err instanceof Error ? err.message : 'Failed to delete user. Please try again.'
      toast.error(description)
    }
  }

  const columns: ColumnsType<SecuritiesUser> = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      render: (_: string, record) => (
        <div className="flex items-center gap-3 py-1">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColor(
              record.name
            )}`}
          >
            {initials(record.name)}
          </div>
          <div>
            <div className="text-sm font-semibold text-[#043793]">{record.name}</div>
            <div className="text-xs text-[#94A3B8]">{record.userId}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => <span className="text-sm text-[#64748B]">{email}</span>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <span
          className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${
            ROLE_STYLES[role] ?? 'bg-slate-100 text-slate-600'
          }`}
        >
          {role}
        </span>
      ),
    },
    {
      title: 'Org Unit',
      dataIndex: 'orgUnit',
      key: 'orgUnit',
      render: (orgUnit: string) => <span className="text-sm text-[#334155]">{orgUnit}</span>,
    },
    {
      title: 'Onboarded',
      dataIndex: 'onboarded',
      key: 'onboarded',
      align: 'center',
      render: (onboarded: boolean) =>
        onboarded ? (
          <CheckCircle2 size={17} className="mx-auto text-emerald-500" />
        ) : (
          <Clock3 size={17} className="mx-auto text-slate-300" />
        ),
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (lastLogin: string | null) =>
        lastLogin ? (
          <span className="text-sm text-[#94A3B8]">{lastLogin}</span>
        ) : (
          <span className="text-sm text-[#94A3B8]">Never</span>
        ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: UserStatus) => (
        <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}>
          {status}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_: unknown, record) => (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label={`Edit ${record.name}`}
            onClick={(e) => {
              e.stopPropagation()
              setEditingUser(record)
            }}
            className="text-[#4FC3F7] transition hover:cursor-pointer"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            aria-label={`Email ${record.name}`}
            onClick={(e) => e.stopPropagation()}
            className="text-[#22C55E] transition hover:cursor-pointer"
          >
            <Mail size={15} />
          </button>
          <button
            type="button"
            aria-label={`Delete ${record.name}`}
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(record)
            }}
            className="text-[#EF4444] transition hover:cursor-pointer"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#043793]">Users</h1>
          <p className="mt-1 text-sm text-slate-400">
            {users.length} users — {activeCount} active
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <Download size={15} />
            Export
          </button>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#1B2A4A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#152140]"
          >
            <Plus size={15} />
            Add User
          </button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users, roles..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A]/10"
        />
      </div>

      <ReusableTable<SecuritiesUser> columns={columns} data={filteredUsers} rowKey="id" />

      <UserFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialValues={
          editingUser
            ? {
                fullName: editingUser.name,
                email: editingUser.email,
                role: editingUser.role,
                orgUnit: editingUser.orgUnit,
              }
            : undefined
        }
        onClose={closeModal}
        onSubmit={handleModalSubmit}
      />
    </div>
  )
}