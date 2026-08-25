import { Download, RefreshCw, Search } from "lucide-react";
import GSTStateDetailDrawer from './components/GSTStateDetailDrawer'
import SimpleStatCard from "@/components/shared/SimpleStatCard";
import { useMemo, useState } from "react";
import { GSTStateRecord } from "@/types/gstState";
import { getGSTStateColumns } from "./components/GSTStateColumns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReusableTable from "@/components/shared/ReusableTable";
import {
  getGstStates,
  getGstStateStats,
  updateGstStateField,
  type GstStateRow,
} from "@/services/admin/organization/gstState.service";

export default function GSTStateDetails() {
  const [selectedState, setSelectedState] = useState<GSTStateRecord | null>(null)
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const { data: states = [] } = useQuery({
    queryKey: ['gst-states'],
    queryFn: getGstStates,
  })
  const { data: stats } = useQuery({
    queryKey: ['gst-state-stats'],
    queryFn: getGstStateStats,
  })
  const statCards = [
    { id: 1, label: "Total States", count: stats?.totalStates ?? 0, textColor: "text-[#0B4D8C]" },
    { id: 2, label: "Active GSTINs", count: stats?.activeGstins ?? 0, textColor: "text-[#21B6A8]" },
    { id: 3, label: "IGST Enabled", count: stats?.igstEnabled ?? 0, textColor: "text-[#22C55E]" },
    { id: 4, label: "States with SEZ", count: stats?.statesWithSEZ ?? 0, textColor: "text-[#F59E0B]" },
  ]

  // Transform GstStateRow to GSTStateRecord
  const transformedStates: GSTStateRecord[] = useMemo(() => {
    return states.map((row: GstStateRow) => ({
      id: String(row.id),
      code: row.code,
      stateName: row.name,
      igst: row.igstEnabled,
      cgstSgst: row.cgstSgstEnabled,
      sez: row.hasSEZ,
      linkedGstins: row.linkedStores,
      lastUpdated: row.updatedAt,
      createdBy: row.createdBy,
    }))
  }, [states])

  const filteredStates = useMemo(() => {
    if (!search) return transformedStates
    return transformedStates.filter((s: GSTStateRecord) =>
      s.stateName.toLowerCase().includes(search.toLowerCase()) ||
      s.code.includes(search)
    )
  }, [search, transformedStates])

  function handleView(record: GSTStateRecord) {
    setSelectedState(record)
  }

  // function handleLinkedClick(record: GSTStateRecord) {
  //   console.log("Show linked GSTINs for", record.stateName)
  // }

  // ── Toggle mutation with optimistic update ──────────────────
  const toggleMutation = useMutation({
    mutationFn: (vars: { id: string; field: 'igst' | 'cgstSgst'; value: boolean }) =>
      updateGstStateField(Number(vars.id), vars.field, vars.value),

    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: ['gst-states'] })
      const previous = queryClient.getQueryData<GstStateRow[]>(['gst-states'])
       console.log('Before update:', previous)
  console.log('Toggle vars:', vars)

      queryClient.setQueryData<GstStateRow[]>(['gst-states'], (old) =>
        old?.map((row) =>
          String(row.id) === vars.id
            ? {
                ...row,
                [vars.field === 'igst' ? 'igstEnabled' : 'cgstSgstEnabled']: vars.value,
              }
            : row
        )
      )

      return { previous } // for rollback
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['gst-states'], context.previous)
      }
      // show a toast here if you have one
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['gst-states'] })
    },
  })

  function handleToggleField(record: GSTStateRecord, field: 'igst' | 'cgstSgst') {
    const currentValue = field === 'igst' ? record.igst : record.cgstSgst
    toggleMutation.mutate({ id: record.id, field, value: !currentValue })
  }

  const columns = getGSTStateColumns(handleView, handleToggleField)

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
            className="flex items-center gap-2 rounded-full border border-gray-300 bg-[#F5F7FB] px-3 py-2.5 text-sm font-medium text-[#6B7280] sm:px-4"
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
        {statCards.map((card) => (
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