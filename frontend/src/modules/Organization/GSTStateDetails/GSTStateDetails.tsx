import { Download, RefreshCw, Search } from "lucide-react";
import GSTStateDetailDrawer from './components/GSTStateDetailDrawer'
import { GST_STATE_STAT_CARDS } from "@/config/gstinCardConfig";
import SimpleStatCard from "@/components/shared/SimpleStatCard";
import { useMemo, useState } from "react";
import { GSTStateRecord } from "@/types/gstState";
import { getGSTStateColumns } from "./components/GSTStateColumns";
import { useQuery } from "@tanstack/react-query";
import ReusableTable from "@/components/shared/ReusableTable";
import { gstStateService } from "@/services/gstStateService";
import { exportToPDF, ExportColumn } from '@/utils/exportData';

const gstStateColumns: ExportColumn<GSTStateRecord>[] = [
  { header: 'Code', accessor: (s) => s.code },
  { header: 'State Name', accessor: (s) => s.stateName },
  { header: 'IGST Applicable', accessor: (s) => (s.igst ? 'Yes' : 'No') },
  { header: 'CGST + SGST Applicable', accessor: (s) => (s.cgstSgst ? 'Yes' : 'No') },
  { header: 'SEZ Special Rate', accessor: (s) => (s.sez ? 'Yes' : 'No') },
  { header: 'Linked GSTINs', accessor: (s) => s.linkedGstins },
  { header: 'Last Updated', accessor: (s) => s.lastUpdated || '—' },
]

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
        <div className="page-shell">
            <div className="page-header">
                <div>
                    <h1 className="page-title">GST State Details</h1>
                    <p className="page-subtitle">State-wise GST tax applicability reference</p>
                </div>
                <div className="page-actions">
                     <button
                    type="button"
                    onClick={() =>
                      exportToPDF(filteredStates, gstStateColumns, {
                        filename: 'gst-state-details.pdf',
                        title: 'GST State Details',
                      })
                    }
                    className="flex items-center gap-2 rounded-full border border-gray-300 bg-[#F5F7FB] px-3 py-2.5 text-sm font-medium text-[#6B7280] transition hover:bg-slate-100 sm:px-4 cursor-pointer"
                >
                    <Download size={16} /><span className="hidden sm:inline">Export</span>
                </button>
                <button
                    type="button"
                    className="flex items-center gap-2 rounded-full bg-[linear-gradient(#093055,#043793)] px-3 py-2.5 text-sm font-medium text-white sm:px-4"
                >
                    <RefreshCw size={16} /><span className="hidden sm:inline">Sync GST DB</span>
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