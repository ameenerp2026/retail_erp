import { Plus, Search} from "lucide-react";
import { GSTIN_STAT_CARDS } from "@/config/gstinCardConfig";
import SimpleStatCard from "@/components/shared/SimpleStatCard";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getGSTINColumns } from "../components/GSTINManagement/GSTINColumns";
import GSTINModal from "../components/GSTINManagement/GSTINModal";
import { GSTINRecord } from "@/types/gstin";
import type { GstinFormData } from "@/components/forms/validate.schema";
import ReusableTable from "@/components/shared/ReusableTable";
import { gstinService } from "@/services/gstinService";

export default function GSTINManagement() {
    const [search, setSearch] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: records = [] } = useQuery({
    queryKey: ['gstin-records'],
    queryFn: gstinService.getAll,
  })

  function handleAddGSTIN(data: GstinFormData) {
    console.log("Add GSTIN", data)
    toast.success("GSTIN added")
    // TODO: call API to persist and refetch
  }


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
        <div className="page-shell">
            <div className="page-header">
                <div>
                    <h1 className="page-title">GSTIN Management</h1>
                    <p className="page-subtitle">GST registration, verification and compliance tracking</p>
                </div>
                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-[linear-gradient(#093055,#043793)] px-4 py-2.5 text-sm font-medium text-white"
                >
                    <span><Plus size={18} /></span> Add GSTIN
                </button>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
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

            {/* Add GSTIN modal */}
            <GSTINModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddGSTIN}
            />
        </div>
    )
}


