import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Download, Plus, Search } from 'lucide-react'
import ReusableTable from '@/components/shared/ReusableTable'
import SimpleStatCard from '@/components/shared/SimpleStatCard'
import { getAccountClassColumns } from '@/modules/Finance/components/AccountClass/AccountClassColumns'
import { accountClassService } from '@/services/accountClassService'
import type { AccountClassRecord } from '@/types/accountClass'
import { Modal } from '@/components/shared/Modal'
import AccountClassForm from '@/modules/Finance/components/AccountClass/AccountClassForm'

const statCards = [
  { id: 1, label: "Total Classes",    count: 9,   textColor: "text-[#0B4D8C]"  },
  { id: 2, label: "Active Classes",   count: 8,   textColor: "text-[#22C55E]"  },
  { id: 3, label: "Linked Ledgers",   count: 120, textColor: "text-[#21B6A8]"   },
  { id: 4, label: "Recently Updated", count: 9,   textColor: "text-[#F59E0B]" },
]
function AccountClass() {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)


  const { data: classes = [] } = useQuery({
    queryKey: ['account-classes'],
    queryFn: accountClassService.getAll,
  })
  const filteredClasses = useMemo(() => {
    if (!search) return classes
    return classes.filter((c: AccountClassRecord) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.parentGroup.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, classes])
  function handleEdit(record: AccountClassRecord) {
    console.log('Edit', record)
  }

  function handleDelete(record: AccountClassRecord) {
    console.log('Delete', record)
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
          <button className="h-10 px-4 rounded-full bg-[linear-gradient(#F3F4F6,#E5E7EB)] text-gray-700 flex items-center gap-1.5 text-sm font-medium hover:bg-gray-300 transition border border-gray-300">
            <Download size={16} />
            Export
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="h-10 px-4 rounded-full bg-[linear-gradient(#093055,#043793)] text-white flex items-center gap-2 text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Plus size={18} />
            Create Account Class
          </button>
        </div>
      </div>
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => (
          <SimpleStatCard
            key={card.id}
            count={card.count}
            label={card.label}
            textColor={card.textColor}
          />
        ))}
      </div>
      {/* Search */}
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
      {/* Table */}
      <ReusableTable
        columns={columns}
        data={filteredClasses}
        rowKey="id"
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AccountClassForm onClose={() => setIsModalOpen(false)} />
      </Modal>
   </div>
  )
}

export default AccountClass