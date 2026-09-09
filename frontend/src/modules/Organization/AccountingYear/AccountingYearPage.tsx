import { useState, useEffect } from "react";
import { Modal } from "@/components/shared/Modal";
import YearListItem from "./components/YearListItem";
import PeriodGrid from "./components/PeriodGrid";
import AccountingYearForm from "./components/AccountingYearForm";
import {
  AccountingYear,
  Period,
  PeriodStatus,
} from "@/types/accounting";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";
import {
  formatDate,
  formatDateRange,
} from "@/utils/dateFormat";
import { Plus } from "lucide-react";

export default function AccountingYearPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedYearId, setSelectedYearId] =
    useState<number | null>(null);

  const [years, setYears] = useState<AccountingYear[]>([]);

  const [loading, setLoading] = useState(false);

  const selectedYear = years.find(
    (y) => y.id === selectedYearId
  );

  const fetchAccountingYear = async () => {
    try {
      setLoading(true);

      const yearData = await apiClient.get(
        "/api/accountingYear/accounting-Year"
      );

      const formattedYears: AccountingYear[] =
        yearData.data.data.map((year: any) => ({
          id: year.id,
          label: year.yearName,

          dateRange: formatDateRange(
            year.fromDate,
            year.toDate
          ),

          status: year.status,

          closedPeriods: year.financeMonths.filter(
            (m: any) =>
              m.financeStatus === "Closed"
          ).length,

          totalPeriods: year.financeMonths.length,

          financeMonths: year.financeMonths,

          createdBy: year.createdBy,
        }));

      setYears(formattedYears);

      if (formattedYears.length > 0) {
        setSelectedYearId(formattedYears[0].id);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to fetch accounting years"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountingYear();
  }, []);

  const getPeriodsForYear = (
    year?: AccountingYear
  ): Period[] => {
    if (!year) return [];

    return (year.financeMonths ?? []).map(
      (month: any, idx: number) => {
        const start = new Date(month.fromDate);
        const end = new Date(month.toDate);
        const now = new Date();

        return {
          month: month.period.split(" ")[0],
          year: month.period.split(" ")[1],

          status: month.financeStatus as PeriodStatus,

          sequenceNumber: `#${String(
            idx + 1
          ).padStart(2, "0")}`,

          accountingYear: year.label,

          startDate: formatDate(start),

          endDate: formatDate(end),

          isCurrentPeriod:
            now >= start && now <= end,

          createdBy: month.createdBy ?? "Admin",

          createdOn: formatDate(
            new Date(month.createdAt)
          ),

          updatedBy: month.updatedBy ?? "Admin",

          updatedOn: formatDate(
            new Date(month.updatedAt)
          ),

          auditLog: [],
        };
      }
    );
  };

  return (
    <div className="page-shell">

      {/* Header */}
      <div className="page-header">
        <div className="min-w-0">
          <h1 className="page-title">
            Accounting Year
          </h1>

          <p className="page-subtitle">
            Fiscal year setup and period configuration
          </p>
        </div>

        <div className="page-actions">
          <button
            type="button"
            disabled={loading}
            onClick={() => setIsModalOpen(true)}
            className="inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-[linear-gradient(#093055,#043793)] px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            <Plus size={16} />

            New Accounting Year
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-6">

        {/* Year List */}
        <div className="min-w-0 space-y-3">
          {years.map((year) => (
            <YearListItem
              key={year.id}
              year={year}
              isSelected={
                year.id === selectedYearId
              }
              onSelect={() =>
                setSelectedYearId(year.id)
              }
            />
          ))}
        </div>

        {/* Period Grid */}
        {selectedYear && (
          <div className="min-w-0">
            <PeriodGrid
              year={selectedYear}
              periods={getPeriodsForYear(selectedYear)}
              onGenerate={() =>
                console.log("Generate periods")
              }
            />
          </div>
        )}

      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="lg"
      >
        <AccountingYearForm
          onClose={() =>
            setIsModalOpen(false)
          }
        />
      </Modal>

    </div>
  );
}