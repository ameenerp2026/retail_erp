import { useState ,useEffect} from 'react'
import { Modal } from '@/components/shared/Modal'
import YearListItem from '../components/AccountingYear/YearListItem'
import PeriodGrid from '../components/AccountingYear/PeriodGrid'
import AccountingYearForm from '../components/AccountingYear/AccountingYearForm'
import { AccountingYear, Period, PeriodStatus } from '@/types/accounting'
import apiClient from '../../../services/apiClient'
import toast from 'react-hot-toast'

export default function AccountingYearPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  const [years, setYears] = useState<AccountingYear[]>([]);
  const [loading, setLoading] = useState(false)

  const selectedYear = years.find(y => y.id === selectedYearId)!

  const fetchAccountingYear = async () => {
    try {
      setLoading(true);

      const yearData = await apiClient.get("/api/accountingYear/accounting-Year");

      const formattedYears: AccountingYear[] = yearData.data.data.map((year: any) => ({
        id: year.id,
        label: year.yearName,
        dateRange: `${new Date(year.fromDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })} — ${new Date(year.toDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}`,
        status: year.status,
        closedPeriods: year.financeMonths.filter(
          (m: any) => m.financeStatus === "Closed"
        ).length,
        totalPeriods: year.financeMonths.length,
        financeMonths: year.financeMonths,
      }))
      setYears(formattedYears)

      if (formattedYears.length > 0) {
        setSelectedYearId(formattedYears[0].id);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch organization units");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountingYear();
  }, []);

  const getPeriodsForYear = (year?: AccountingYear): Period[] => {
    if (!year) return [];

    return year.financeMonths.map((month: any) => ({
      month: month.period.split(" ")[0],
      year: month.period.split(" ")[1],
      status: month.financeStatus as PeriodStatus,
    }));
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Accounting Year</h1>
          <p className="page-subtitle">Fiscal year setup and period configuration</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[linear-gradient(#093055,#043793)] px-4 py-2.5 text-sm font-medium text-white"
        >
          <span>+</span> New Accounting Year
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-sm text-gray-500">
          Loading accounting years…
        </div>
      ) : years.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-sm text-gray-500">
          No accounting years found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-6">
          <div className="space-y-3">
            {years.map((year) => (
              <YearListItem
                key={year.id}
                year={year}
                isSelected={year.id === selectedYearId}
                onSelect={() => setSelectedYearId(year.id)}
              />
            ))}
          </div>
          {selectedYearId && (
            <PeriodGrid
              year={selectedYear}
              periods={getPeriodsForYear(selectedYear)}
              onGenerate={() => console.log('Generate periods')}
            />
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AccountingYearForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  )
}