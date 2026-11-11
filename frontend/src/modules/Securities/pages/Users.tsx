import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnsType } from 'antd/es/table'
import {
  Search,
  Download,
  Plus,
  Pencil,
  CheckCircle2,
  Clock3,
  Power,
} from 'lucide-react'
import toast from 'react-hot-toast'
import ReusableTable from '@/components/shared/ReusableTable'
import UserFormModal from '../components/Users/UserFormModal'
import type { AddUserFormData } from '@/components/forms/validate.schema'
import { useAuth } from '@/context/useAuth'
import {
  getRoles,
} from '@/services/admin/securities/role.service'

import {
  createUser,
  getUserById,
  getUserRequestError,
  getUserOrganizationUnits,
  getUsers,
  updateUser,
  updateUserStatus,
  type SecurityUserListItem,
} from '@/services/admin/securities/user.service'

type UserStatus = 'Active' | 'Inactive'
const EMPTY_USERS: SecurityUserListItem[] = []

const ROLE_STYLES: Record<string, string> = {
  "Super Admin": "bg-rose-50 text-rose-600",
  "Finance Manager": "bg-blue-50 text-blue-600",
  "Branch Manager": "bg-emerald-50 text-emerald-600",
  "GST Operator": "bg-amber-50 text-amber-600",
  "Data Entry": "bg-sky-50 text-sky-600",
  Auditor: "bg-violet-50 text-violet-600",
};

const STATUS_STYLES: Record<UserStatus, string> = {
  Active: 'bg-emerald-50 text-emerald-600',
  Inactive: 'bg-rose-50 text-rose-600',
}

const AVATAR_PALETTE = [
  "bg-violet-100 text-violet-700",
  "bg-pink-100 text-pink-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
  "bg-teal-100 text-teal-700",
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}



function avatarColor(seed: string) {
  const index =
    seed.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) %
    AVATAR_PALETTE.length
  return AVATAR_PALETTE[index]
}

function formatLastLogin(value: string | null) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

export default function Users() {
  const queryClient = useQueryClient()
  const [query, setQuery] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<SecurityUserListItem | null>(null)
  const [submitting, setSubmitting] = useState(false)
 const { hasPermission } = useAuth();


  const canView = hasPermission("USER_VIEW");
  //const canExport = hasPermission("AUDIT_LOG_EXPORT");

  const usersQuery = useQuery({
    queryKey: ['security-users'],
    queryFn: getUsers,
  })
  const rolesQuery = useQuery({
    queryKey: ['security-roles'],
    queryFn: getRoles,
  })
  const orgUnitsQuery = useQuery({
    queryKey: ['security-user-org-units'],
    queryFn: getUserOrganizationUnits,
  })
  const userDetailsQuery = useQuery({
    queryKey: ['security-user', editingUser?.id],
    queryFn: () => getUserById(editingUser!.id),
    enabled: editingUser !== null,
  })

  const users = usersQuery.data?.data ?? EMPTY_USERS
  const filteredUsers = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return users
    return users.filter((user) =>
      [
        user.name,
        user.email,
        user.role?.name ?? '',
        user.orgUnit?.name ?? '',
      ].some((value) => value.toLowerCase().includes(term)),
    )
  }, [query, users])

  const editingDetails = userDetailsQuery.data
  const initialValues = useMemo<Partial<AddUserFormData> | undefined>(() => {
    if (!editingDetails) return undefined
    return {
      fullName: editingDetails.name,
      email: editingDetails.email,
      roleId: editingDetails.role?.id ?? 0,
      organizationUnitId: editingDetails.orgUnit?.id,
      reportingManagerId: editingDetails.reportingManager?.id,
      password: '',
    }
  }, [editingDetails])

  const isModalOpen = isAddOpen || editingUser !== null;
  const modalMode = editingUser ? "edit" : "create";

  function closeModal() {
    setIsAddOpen(false);
    setEditingUser(null);
  }

  async function handleModalSubmit(form: AddUserFormData) {
    setSubmitting(true)
    try {
      const payload = {
        name: form.fullName.trim(),
        email: form.email.trim(),
        roleId: form.roleId,
        organizationUnitId: form.organizationUnitId ?? null,
        reportingManagerId: form.reportingManagerId ?? null,
      }

      if (editingUser) {
        await updateUser(editingUser.id, payload)
        toast.success(`${form.fullName} was updated`)
      } else {
        await createUser({ ...payload, password: form.password ?? '' })
        toast.success(`${form.fullName} was added`)
      }

      await queryClient.invalidateQueries({ queryKey: ['security-users'] })
      closeModal()
    } catch (error) {
      toast.error(getUserRequestError(error))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleToggleStatus(user: SecurityUserListItem) {
    const nextStatus = !user.isActive
    try {
      await updateUserStatus(user.id, nextStatus)
      await queryClient.invalidateQueries({ queryKey: ['security-users'] })
      toast.success(`${user.name} ${nextStatus ? 'activated' : 'deactivated'}`)
    } catch (error) {
      toast.error(getUserRequestError(error))
    }
  }

  const columns: ColumnsType<SecurityUserListItem> = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (_: string, record) => (
        <div className='flex items-center gap-3 py-1'>
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColor(record.name)}`}
          >
            {initials(record.name)}
          </div>
          <div>
            <div className='text-sm font-semibold text-[#043793]'>{record.name}</div>
            <div className='text-xs text-[#94A3B8]'>{record.code}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => <span className='text-sm text-[#64748B]'>{email}</span>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (_: unknown, record) => {
        const roleName = record.role?.name ?? 'Unassigned'
        return (
          <span
            className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${ROLE_STYLES[roleName] ?? 'bg-slate-100 text-slate-600'}`}
          >
            {roleName}
          </span>
        )
      },
    },
    {
      title: 'Org Unit',
      dataIndex: 'orgUnit',
      key: 'orgUnit',
      render: (_: unknown, record) => (
        <span className='text-sm text-[#334155]'>{record.orgUnit?.name ?? '—'}</span>
      ),
    },
    {
      title: "Onboarded",
      dataIndex: "onboarded",
      key: "onboarded",
      align: "center",
      render: (onboarded: boolean) =>
        onboarded ? (
          <CheckCircle2 size={17} className='mx-auto text-emerald-500' />
        ) : (
          <Clock3 size={17} className='mx-auto text-slate-300' />
        ),
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (lastLogin: string | null) => (
        <span className='text-sm text-[#94A3B8]'>
          {formatLastLogin(lastLogin) ?? 'Never'}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => {
        const status: UserStatus = isActive ? 'Active' : 'Inactive'
        return (
          <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}>
            {status}
          </span>
        )
      },
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_: unknown, record) => (
        <div className='flex items-center justify-center gap-3'>
          <button
            type='button'
            aria-label={`Edit ${record.name}`}
            onClick={(event) => {
              event.stopPropagation()
              setEditingUser(record)
            }}
            className='text-[#4FC3F7] transition hover:cursor-pointer'
          >
            <Pencil size={15} />
          </button>
          <button
            type='button'
            aria-label={`${record.isActive ? 'Deactivate' : 'Activate'} ${record.name}`}
            title={record.isActive ? 'Deactivate user' : 'Activate user'}
            onClick={(event) => {
              event.stopPropagation()
              void handleToggleStatus(record)
            }}
            className={`${record.isActive ? 'text-rose-500' : 'text-emerald-500'} transition hover:cursor-pointer`}
          >
            <Power size={15} />
          </button>
        </div>
      ),
    },
  ];

  if (!canView) {
    return <p>You do not have permission to view users.</p>;
  }

  const lookupsError =
    rolesQuery.error || orgUnitsQuery.error
      ? getUserRequestError(rolesQuery.error ?? orgUnitsQuery.error)
      : undefined
  const activeCount =
    usersQuery.data?.counts.active ?? users.filter((user) => user.isActive).length
  const userDetailsError = userDetailsQuery.error
    ? getUserRequestError(userDetailsQuery.error)
    : undefined

  return (
    <div className='space-y-5'>
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-[#043793]'>Users</h1>
          <p className='mt-1 text-sm text-slate-400'>
            {usersQuery.data?.counts.total ?? users.length} users — {activeCount} active
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            className='flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50'
          >
            <Download size={15} />
            Export
          </button>
          <button
            type='button'
            onClick={() => setIsAddOpen(true)}
            className='flex items-center gap-2 rounded-lg bg-[#1B2A4A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#152140]'
          >
            <Plus size={15} />
            Add User
          </button>
        </div>
      </div>

      <div className='relative max-w-sm'>
        <Search size={16} className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder='Search users, roles...'
          className='w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A]/10'
        />
      </div>

      {usersQuery.isLoading ? (
        <p className='py-8 text-center text-sm text-slate-500'>Loading users...</p>
      ) : usersQuery.error ? (
        <p role='alert' className='py-8 text-center text-sm text-red-600'>
          Failed to load users: {getUserRequestError(usersQuery.error)}
        </p>
      ) : (
        <ReusableTable<SecurityUserListItem>
          columns={columns}
          data={filteredUsers}
          rowKey='id'
        />
      )}

      {editingUser && userDetailsError && (
        <p role='alert' className='text-sm text-red-600'>
          Failed to load user details: {userDetailsError}
        </p>
      )}

      <UserFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialValues={initialValues}
        editingUserId={editingUser?.id}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        roles={rolesQuery.data ?? []}
        orgUnits={orgUnitsQuery.data ?? []}
        managers={users}
        lookupsLoading={rolesQuery.isLoading || orgUnitsQuery.isLoading}
        lookupsError={lookupsError}
        detailsError={userDetailsError}
        submitting={submitting}
      />
    </div>
  )
}
