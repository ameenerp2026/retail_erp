import { BarChart2,Lock, RefreshCw } from "lucide-react";
import StatCards from '@/components/shared/StatCards'
import { INVENTORY_CARD_CONFIG } from '@/config/inventoryCardConfig'
import { useQuery } from "@tanstack/react-query";
import { inventoryService } from "@/services/inventoryService";
import { usePeriodFilter } from "@/hooks/usePeriodFilter";
import { PERIOD_FILTER_FIELDS } from "@/config/filterConfig";
import FilterBar from "@/components/shared/FilterBar";
import InventoryTable from "../components/InventoryMonths/InventoryTable";
import { InventoryPeriod } from "@/types/inventory";
import { useState } from "react";
import InventoryDetailPanel from "../components/InventoryMonths/InventoryDetailPanel";
import COGSRunHistory from '../components/InventoryMonths/COGSRunHistory'
import { useNavigate } from "react-router-dom";
import Drawer from "@/components/shared/Drawer";
import UnpostedDocuments from "../components/InventoryMonths/UnpostedDocuments";




export default function InventoryMonths() {
      const navigate = useNavigate()

      // sidepanel state: which period is currently selected (if any)
      const [selectedPeriod, setSelectedPeriod] = useState<InventoryPeriod | null>(null)
      const [cogsHistoryPeriod, setCogsHistoryPeriod] = useState<InventoryPeriod | null>(null)
    const { data: stats = [] } = useQuery({
  queryKey: ['inventory-stats'],
  queryFn: inventoryService.getStats
})
 const { data: periods = [] } = useQuery({
  queryKey: ['inventory-periods'],
  queryFn: inventoryService.getPeriods
})
//Filter state for the table
const { filteredItems, setFilters } = usePeriodFilter(periods)


const inventoryCards = stats.map((stat) => ({
  id:          stat.id,
  label:       stat.label,
  count:       stat.count,
  logo:        INVENTORY_CARD_CONFIG[stat.type].logo,
  logoBgColor: INVENTORY_CARD_CONFIG[stat.type].logoBgColor,
  drawerKey:   INVENTORY_CARD_CONFIG[stat.type].drawerKey
}))
 // ← track which card was clicked
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null)
    return (
        <div className="p-6 bg-slate-50 min-h-screen w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[24px] text-[#043793] font-bold">Inventory Months</h1>
                    <p className="text-sm text-gray-500 mt-1 sm:whitespace-nowrap">
                        Manage and monitor inventory period status across all organization units
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 bg-white rounded-full hover:bg-gray-50 text-[#1A2332]">
                        <RefreshCw size={12} /> Refresh
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 bg-white rounded-full hover:bg-gray-50 text-[#1A2332]">
                        <Lock size={12} /> Close Month
                    </button>
                    <button
                        onClick={() => navigate('/organization/recalculate-cogs')} 
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-[#043793] text-white rounded-full cursor-pointer">
                        <BarChart2 size={12} /> Recalculate COGS
                    </button>
                </div>
            </div>   
            {/* Stat Cards */}
            <StatCards cards={inventoryCards} onCardClick={(key) => {
    console.log('Key:', key) // ← Add this. Does it log 'Unposted'?
    setActiveDrawer(key)
  }}/>
            {/* Drawer — opens based on which card was clicked */}
      <Drawer
  isOpen={!!activeDrawer}
  onClose={() => setActiveDrawer(null)}
  title={activeDrawer === 'Unposted'? 'Unposted Documents' : activeDrawer ?? ''}
  description={activeDrawer === 'Unposted' ? '6 documents require attention before month closure.' : ''}
>
  {activeDrawer === 'Unposted' && <UnpostedDocuments />}
</Drawer>

       
 
            {/* Filters */}
            <FilterBar fields={PERIOD_FILTER_FIELDS} onApply={setFilters} />
            {/* Table + Side Panel */}
            <div className="flex gap-4 w-full">
                {/* Table — takes all remaining space */}
                <div className="flex-1 min-w-0">
                    <InventoryTable
                        periods={filteredItems}
                        onRowClick={setSelectedPeriod}
                        onHistoryClick={setCogsHistoryPeriod}
                    />
                </div>
                {/* Side panel — only renders when a row is clicked */}
                        {selectedPeriod && (
                          <div className="w-[320px] flex-shrink-0 max-h-[calc(100vh-100px)] overflow-y-auto">
                            <InventoryDetailPanel
                              period={selectedPeriod}
                              onClose={() => setSelectedPeriod(null)}
                            />
                          </div>
                      )}
            </div>
            
      {/* COGS Run History Modal */}
      <COGSRunHistory
        isOpen={!!cogsHistoryPeriod}
        onClose={() => setCogsHistoryPeriod(null)}
        periodName={cogsHistoryPeriod?.period ?? ""}
      />
        </div>   
    )   
            
}