import { Plus, Search} from "lucide-react";
import { GSTIN_STAT_CARDS } from "../config/gstinCardConfig";
import SimpleStatCard from "@/components/shared/SimpleStatCard";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGSTINColumns } from "../components/GSTINManagement/GSTINColumns";
import { GSTINRecord } from "@/types/gstin";
import ReusableTable from "@/components/shared/ReusableTable";
import { gstinService } from "@/services/gstinService";

export default function GSTINManagement() {
    const [search, setSearch] = useState('')

  const { data: records = [] } = useQuery({
    queryKey: ['gstin-records'],
    queryFn: gstinService.getAll,
  })

  const filteredRecords = useMemo(() => {
    if (!search) return records
    return records.filter((r: GSTINRecord) =>
      r.gstin.toLowerCase().includes(search.toLowerCase()) ||
      r.state.toLowerCase().includes(search.toLowerCase()) ||
      r.orgUnit.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, records])

  function handleReVerify(record: GSTINRecord) {
    console.log("Re-verify", record.gstin)
    // call API to re-verify
  }

  const columns = getGSTINColumns(handleReVerify)

    return (
        <div className="p-6 bg-slate-50 min-h-screen w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[24px] text-[#043793] font-bold">GSTIN Management</h1>
                    <p className="text-sm text-gray-500 mt-1 sm:whitespace-nowrap">GST registration, verification and compliance tracking</p>
                </div>
                <button 
                    className="bg-slate-800 text-white px-4 py-2.5 rounded-xl bg-[linear-gradient(#093055,#043793)] text-sm font-medium flex items-center gap-2"
                >
                    <span><Plus size={18} /></span> Add GSTIN
                </button>
            </div>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {GSTIN_STAT_CARDS.map((card) => (
                    <SimpleStatCard
                        key={card.id}
                        count={card.count}
                        label={card.label}
                        textColor={card.textColor}
                    />
                ))}
            </div>
             {/* Search bar */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 mb-4 max-w-md">
                <Search size={14} className="text-slate-400" />
                <input
                    type="text"
                    placeholder="Search GSTIN, state, unit..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="text-sm outline-none flex-1 bg-transparent"
                />
            </div>
            {/* Table */}
            <ReusableTable
                columns={columns}
                data={filteredRecords}
                rowKey="id"
            />
        </div>
    )
}