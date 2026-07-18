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
        <div className="page-shell">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Inventory Months</h1>
                    <p className="page-subtitle">
                        Manage and monitor inventory period status across all organization units
                    </p>
                </div>
                <div className="page-actions">
                    <button type="button" className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-2 text-sm text-[#1A2332] hover:bg-gray-50 sm:px-4">
                        <RefreshCw size={12} /> <span className="hidden sm:inline">Refresh</span>
                    </button>
                    <button type="button" className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-2 text-sm text-[#1A2332] hover:bg-gray-50 sm:px-4">
                        <Lock size={12} /> <span className="hidden sm:inline">Close Month</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/organization/recalculate-cogs')}
                        className="flex cursor-pointer items-center gap-2 rounded-full bg-[#043793] px-3 py-2 text-sm text-white sm:px-4">
                        <BarChart2 size={12} /> <span className="hidden xs:inline sm:inline">Recalculate COGS</span>
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
            <div className="flex w-full flex-col gap-4 xl:flex-row">
                <div className="min-w-0 flex-1 overflow-x-auto">
                    <InventoryTable
                        periods={filteredItems}
                        onRowClick={setSelectedPeriod}
                        onHistoryClick={setCogsHistoryPeriod}
                    />
                </div>
                        {selectedPeriod && (
                          <div className="w-full shrink-0 overflow-y-auto xl:max-h-[calc(100vh-100px)] xl:w-[320px]">
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