import { useState, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Download, Plus, Search } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ReusableTable from '@/components/shared/ReusableTable'
import SimpleStatCard from '@/components/shared/SimpleStatCard'
import { getAccountClassColumns } from '@/modules/Finance/components/AccountClass/AccountClassColumns'
import { accountClassService } from '@/services/admin/finance/accountClassService'
import type { AccountClassRecord } from '@/types/accountClass'
import { Modal } from '@/components/shared/Modal'
import AccountClassForm from '@/modules/Finance/components/AccountClass/AccountClassForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog' // adjust path if you have one; see note below

function AccountClass() {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<AccountClassRecord | null>(null)
  const [deletingRecord, setDeletingRecord] = useState<AccountClassRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['account-classes'],
    queryFn: accountClassService.getAll,
  })

  const classes = Array.isArray(data) ? data : []

  const filteredClasses = useMemo(() => {
    if (!search) return classes
    return classes.filter((c: AccountClassRecord) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.parentGroup.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, classes])

  const stats = useMemo(() => {
    const totalClasses = classes.length
    const activeClasses = classes.filter((c) => c.status === 'Active').length
    const linkedLedgers = classes.reduce((sum, c) => sum + (c.linkedLedgers || 0), 0)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentlyUpdated = classes.filter((c) => {
      const updated = new Date(c.lastUpdated)
      return !isNaN(updated.getTime()) && updated >= sevenDaysAgo
    }).length
    return { totalClasses, activeClasses, linkedLedgers, recentlyUpdated }
  }, [classes])

  const statCards = [
    { id: 1, label: 'Total Classes',    count: stats.totalClasses,    textColor: 'text-[#0B4D8C]' },
    { id: 2, label: 'Active Classes',   count: stats.activeClasses,   textColor: 'text-[#22C55E]' },
    { id: 3, label: 'Linked Ledgers',   count: stats.linkedLedgers,   textColor: 'text-[#21B6A8]' },
    { id: 4, label: 'Recently Updated', count: stats.recentlyUpdated, textColor: 'text-[#F59E0B]' },
  ]

  function handleEdit(record: AccountClassRecord) {
    setEditingRecord(record)
    setIsModalOpen(true)
  }

  function handleDelete(record: AccountClassRecord) {
    setDeletingRecord(record)
  }

  async function confirmDelete() {
    if (!deletingRecord) return
    setIsDeleting(true)
    try {
      await accountClassService.remove(Number(deletingRecord.id))
      toast.success('Account class deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['account-classes'] })
      setDeletingRecord(null)
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Failed to delete account class.'
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  function handleModalClose() {
    setIsModalOpen(false)
    setEditingRecord(null)
  }

  function handleFormSuccess() {
    queryClient.invalidateQueries({ queryKey: ['account-classes'] })
  }

  const columns = getAccountClassColumns(handleEdit, handleDelete)

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[24px] text-[#043793] font-bold">Account Class</h1>
          <p className="text-[13px] text-[#94A3B8]">Organize ledgers into structured finance categories</p>
        </div>
        <div className="flex gap-3">
          <button className="h-10 px-4 rounded-full bg-[linear-gradient(#F3F4F6,#E5E7EB)] text-gray-700 flex items-center gap-1.5 text-sm font-medium hover:cursor-pointer hover:bg-gray-300 transition border border-gray-300">
            <Download size={16} />
            Export
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="h-10 px-4 rounded-full bg-[linear-gradient(#093055,#043793)] text-white flex items-center gap-2 text-sm font-medium hover:cursor-pointer hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Plus size={18} />
            Create Account Class
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => (
          <SimpleStatCard key={card.id} count={card.count} label={card.label} textColor={card.textColor} />
        ))}
      </div>

      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 mb-4 max-w-xs">
        <Search size={14} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search class name, group..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm outline-none flex-1 bg-transparent"
        />
      </div>

      {isLoading && <p className="text-sm text-slate-400 mb-2">Loading account classes...</p>}
      {isError && (
        <p className="text-sm text-red-500 mb-2">
          Failed to load account classes: {(error as any)?.message ?? 'Unknown error'}
        </p>
      )}

      <ReusableTable columns={columns} data={filteredClasses} rowKey="id" />

      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <AccountClassForm
          onClose={handleModalClose}
          onSuccess={handleFormSuccess}
          editingRecord={editingRecord}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingRecord}
        title="Delete Account Class"
        message={`Are you sure you want to delete "${deletingRecord?.name}"? This cannot be undone.`}
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingRecord(null)}
        disabled={isDeleting}
      />
    </div>
  )
}

export default AccountClass