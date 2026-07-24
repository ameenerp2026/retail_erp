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

  const { data } = useQuery({
    queryKey: ['account-groups'],
    queryFn: accountGroupService.getAll,
  })

  // Guard against non-array responses (e.g. API error payloads) so the page never crashes
  const groups = Array.isArray(data) ? data : []

  return (
     <div className="p-6 bg-slate-50 min-h-screen">
       <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[24px] text-[#043793] font-bold">Account Group</h1>
          <p className="text-[13px] text-[#94A3B8]">Tree-based account structure management</p>
        </div>
        <button 
          className="bg-slate-800 text-white px-4 py-2.5 rounded-xl bg-[linear-gradient(#093055,#043793)] text-sm font-medium flex items-center gap-2"
        >
          <span>+</span> Add Root Group
        </button>
      </div>
      {/* Tree card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

        {/* Level legend */}
        <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-100">
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
