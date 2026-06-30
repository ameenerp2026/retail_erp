import { Download, RefreshCw, Search } from "lucide-react";
import GSTStateDetailDrawer from '../components/GSTStateDetails/GSTStateDetailDrawer'
import { GST_STATE_STAT_CARDS } from "../config/gstinCardConfig";
import SimpleStatCard from "@/components/shared/SimpleStatCard";
import { useMemo, useState } from "react";
import { GSTStateRecord } from "@/types/gstState";
import { getGSTStateColumns } from "../components/GSTStateDetails/GSTStateColumns";
import { useQuery } from "@tanstack/react-query";
import ReusableTable from "@/components/shared/ReusableTable";
import { gstStateService } from "@/services/gstStateService";

export default function GSTStateDetails(){
    const [selectedState, setSelectedState] = useState<GSTStateRecord | null>(null)
   const [search, setSearch] = useState('')

  const { data: states = [] } = useQuery({
    queryKey: ['gst-states'],
    queryFn: gstStateService.getAll,
  })

  const filteredStates = useMemo(() => {
    if (!search) return states
    return states.filter((s: GSTStateRecord) =>
      s.stateName.toLowerCase().includes(search.toLowerCase()) ||
      s.code.includes(search)
    )
  }, [search, states])

  function handleView(record: GSTStateRecord) {
    setSelectedState(record)
  }

  function handleLinkedClick(record: GSTStateRecord) {
    console.log("Show linked GSTINs for", record.stateName)
  }

  const columns = getGSTStateColumns(handleView, handleLinkedClick)

    return (
        <div className="p-6 bg-slate-50 min-h-screen w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-[24px] text-[#043793] font-bold">GST State Details</h1>
                    <p className="text-sm text-gray-500 mt-1 sm:whitespace-nowrap">State-wise GST tax applicability reference</p>
                </div>
                <div className="flex gap-3">
                     <button 
                    className="flex items-center gap-2 text-[#6B7280] px-4 py-2.5 rounded-full bg-[#F5F7FB] text-sm font-medium  border border-gray-300"
                >
                    <span><Download size={18} /></span>Export
                </button>
                <button 
                    className="flex items-center gap-2 text-white px-4 py-2.5 rounded-full bg-[linear-gradient(#093055,#043793)] text-sm font-medium "
                >
                    <span><RefreshCw size={18} /></span> Sync GST DB
                </button>
                </div>
               
            </div>
            {/*stat cards*/}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {GST_STATE_STAT_CARDS.map((card) => (
                    <SimpleStatCard
                        key={card.id}
                        count={card.count}
                        label={card.label}
                        textColor={card.textColor}
                    />
                ))}
            </div>
            {/* Search bar */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 mb-4 max-w-md">
                <Search size={14} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search state name or code ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="text-sm outline-none flex-1 bg-transparent"
                    />
            </div>
            {/* Table */}
            <ReusableTable
                columns={columns}
                data={filteredStates}
                rowKey="id"
            />
            {/* Drawer */}
            <GSTStateDetailDrawer
                isOpen={!!selectedState}
                onClose={() => setSelectedState(null)}
                state={selectedState}
            />
        </div>
    )
}