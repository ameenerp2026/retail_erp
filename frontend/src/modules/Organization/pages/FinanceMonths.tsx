import { useMemo, useState,useEffect} from 'react'
import { Calendar, Download, Plus, RefreshCw, Search, X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import PeriodTable from '../components/FinanceMonths/FinanceTable'
//import FinanceSetupStatCards from '../components/FinanceMonths/FinanceSetupStatCards'
import { financeService } from '@/services/financeService'
import type { FinancePeriodStatus } from '@/types/finance'
import toast from 'react-hot-toast' // or your toast lib
import apiClient from '../../../services/apiClient'
type StatusTab = 'All' | FinancePeriodStatus

const STATUS_TABS: StatusTab[] = ['All', 'Open', 'Closed', 'Future']
export type FinancePeriod = {
  id: number;          // <-- change from string to number
  periodId: string;
  period: string;
  startDate: string;
  endDate: string;
  financeStatus: FinancePeriodStatus;
  lastUpdated: string;
};
export default function FinanceMonths() {
  const [statusTab, setStatusTab] = useState<StatusTab>('All')
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const[finance,setFinance]=useState<FinancePeriod[]>([])
const [loading, setLoading] = useState(false)

  const { data: periods = [], isLoading: periodsLoading } = useQuery({
    queryKey: ['finance-periods'],
    queryFn: financeService.getPeriods,
  })

  const { data: stats = [], isLoading: statsLoading } = useQuery({
    queryKey: ['finance-stats'],
    queryFn: financeService.getStats,
  })

    const fetchFinanceMonths = async () => {
      try {
      setLoading(true);
  
      const financeData = await apiClient.get("/api/financeMonth/finance-month");
        const formattedFinance:FinancePeriod[] = financeData.data.data.map((period: any) => ({
    ...period,
    periodId: `P${String(period.id).padStart(2, "0")}`, 
     startDate: new Date(period.startDate).toLocaleDateString("en-GB", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),

  endDate: new Date(period.endDate).toLocaleDateString("en-GB", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
    lastUpdated:new Date(period.updatedAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
  }));
      setFinance(formattedFinance)
      console.log('financeData',formattedFinance)
} catch (error) {
      console.error(error);
      toast.error("Failed to fetch organization units");
    } finally {
      setLoading(false);
    }
    };
     useEffect(() => {
        
        fetchFinanceMonths();
      }, []);

  const filteredPeriods = useMemo(() => {
    return finance.filter((period) => {
      if (statusTab !== 'All' && period.financeStatus !== statusTab) return false
      if (
        search &&
        !period.period.toLowerCase().includes(search.toLowerCase()) &&
        !period.periodId.toLowerCase().includes(search.toLowerCase())
      ) {
        return false
      }
      
      if (dateFilter) {
        const needle = dateFilter.toLowerCase()
        if (
          !period.startDate.toLowerCase().includes(needle) &&
          !period.endDate.toLowerCase().includes(needle) &&
          !period.period.toLowerCase().includes(needle)
        ) {
          return false
        }
      }
      return true
    })
  }, [periods, statusTab, search, dateFilter])

  const resetFilters = () => {
    setStatusTab('All')
    setSearch('')
    setDateFilter('')
  }

  const hasActiveFilters = statusTab !== 'All' || Boolean(search) || Boolean(dateFilter)

  if (statsLoading || periodsLoading) {
    return <div className="page-shell text-sm text-slate-500">Loading...</div>
  }
  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Finance Month Setup</h1>
          <p className="page-subtitle">
            Manage accounting periods and transaction availability
          </p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-[14px] border border-slate-200 bg-[#F5F7FB] px-3 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 sm:px-4"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export Periods</span>
          </button>
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-[14px] border border-slate-200 bg-[#F5F7FB] px-3 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 sm:px-4"
          >
            <RefreshCw size={13} />
            <span className="hidden sm:inline">Sync FY</span>
          </button>
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-[14px] bg-[linear-gradient(#093055,#043793)] px-3 text-xs font-semibold text-white sm:px-4"
          >
            <Plus size={13} />
            <span className="hidden xs:inline sm:inline">Create Adjustment</span>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      {/* //<StatCards cards={financeCards} /> */}

      {/* Filters — Figma: date · status tabs · search · reset */}
      <div className="mb-5 flex flex-col gap-3 rounded-[14px] border border-slate-200 bg-white p-3 shadow-sm sm:p-4 lg:flex-row lg:items-center">
        <div className="relative w-full lg:w-44">
          <Calendar
            size={14}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            placeholder="Filter by date..."
            className="h-9 w-full rounded-xl border border-slate-200 bg-[#F5F7FB] pr-3 pl-9 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusTab(tab)}
              className={`h-8 rounded-lg px-3 text-xs font-semibold transition ${
                statusTab === tab
                  ? 'bg-[#043793] text-white'
                  : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative min-w-0 flex-1">
          <Search
            size={14}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search period..."
            className="h-9 w-full rounded-xl border border-slate-200 bg-[#F5F7FB] pr-3 pl-9 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
          />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#043793] hover:underline"
          >
            <X size={12} />
            Reset Filters
          </button>
        )}
      </div>

      <PeriodTable periods={filteredPeriods} />
    </div>
  )
}
