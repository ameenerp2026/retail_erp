
import { Download, Plus} from 'lucide-react'
function Ledger() {
  return (
     <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[24px] text-[#043793] font-bold">Ledger</h1>
          <p className="text-[13px] text-[#94A3B8]">Chart of accounts and ledger management</p>
        </div>
        <div className="flex gap-3">
          <button className="h-10 px-4 rounded-full bg-[linear-gradient(#F3F4F6,#E5E7EB)] text-gray-700 flex items-center gap-1.5 text-sm font-medium hover:bg-gray-300 transition border border-gray-300">
            <Download size={16} />
            Export
          </button>
          <button
            className="h-10 px-4 rounded-full bg-[linear-gradient(#093055,#043793)] text-white flex items-center gap-2 text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Plus size={18} />
            Create Ledger
          </button>
        </div>
      </div>
      </div>
  )
}

export default Ledger