//import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import TreeRow from '../components/AccountGroup/TreeRow'
import { accountGroupService } from '@/services/accountGroupService'

// Level legend
const LEVEL_LEGEND = [
  { label: 'Level 1 (Root)', color: 'bg-[#0B4D8C]'  },
  { label: 'Level 2',        color: 'bg-[#21B6A8]' },
  { label: 'Level 3',        color: 'bg-[#4FC3F7]'  },
]

function AccountGroup() {
  // const [search, setSearch] = useState('')

  const { data: groups = [] } = useQuery({
    queryKey: ['account-groups'],
    queryFn: accountGroupService.getAll,
  })

  return (
     <div className="page-shell">
       <div className="page-header">
        <div>
          <h1 className="page-title">Account Group</h1>
          <p className="page-subtitle">Tree-based account structure management</p>
        </div>
        <button
          type="button"
          className="page-actions flex items-center gap-2 rounded-xl bg-[linear-gradient(#093055,#043793)] px-4 py-2.5 text-sm font-medium text-white"
        >
          <span>+</span> Add Root Group
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3 sm:gap-4">
          {LEVEL_LEGEND.map((level) => (
            <div key={level.label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${level.color}`} />
              <span className="text-xs text-[#94A3B8]">{level.label}</span>
            </div>
          ))}
        </div>

        {/* Tree rows */}
        <div className="divide-y divide-slate-50">
          {groups.map((group) => (
            <TreeRow key={group.id} node={group} />
          ))}
        </div>
      </div>
     </div>
  )
}

export default AccountGroup
