import { useMemo, useState } from 'react'
import { Download, Plus, Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import ReusableTable from '@/components/shared/ReusableTable'
import { securitiesService } from '@/services/securitiesService'
import { getUserColumns } from '../components/UserColumns'

export default function UsersPage() {
  const [search, setSearch] = useState('')

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: securitiesService.getUsers,
  })

  const filtered = useMemo(() => {
    if (!search) return users
    const q = search.toLowerCase()
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.userId.toLowerCase().includes(q)
    )
  }, [users, search])

  const activeCount = users.filter((u) => u.status === 'Active').length

  if (isLoading) {
    return <div className="page-shell text-sm text-slate-500">Loading...</div>
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">
            {users.length} users — {activeCount} active
          </p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-[14px] border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-500 sm:px-4"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-[14px] bg-[linear-gradient(#093055,#043793)] px-3 text-xs font-semibold text-white sm:px-4"
          >
            <Plus size={13} />
            <span className="hidden sm:inline">Add User</span>
          </button>
        </div>
      </div>

      <div className="mb-5">
        <div className="relative max-w-xl">
          <Search
            size={14}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users, roles..."
            className="h-9 w-full rounded-xl border border-slate-200 bg-white pr-3 pl-9 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
          />
        </div>
      </div>

      <ReusableTable columns={getUserColumns()} data={filtered} />
    </div>
  )
}
