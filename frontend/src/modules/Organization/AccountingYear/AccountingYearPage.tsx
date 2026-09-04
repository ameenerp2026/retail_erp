import { useState, useEffect } from "react";
import { Modal } from "@/components/shared/Modal";
import YearListItem from "./components/YearListItem";
import PeriodGrid from "./components/PeriodGrid";
import AccountingYearForm from "./components/AccountingYearForm";
import { AccountingYear, Period, PeriodStatus } from "@/types/accounting";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast"; // or your toast lib
import { Plus } from "lucide-react";


export default function AccountingYearPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  const [years, setYears] = useState<AccountingYear[]>([]);
  const [loading, setLoading] = useState(false);

  const selectedYear = years.find((y) => y.id === selectedYearId)!;

  const fetchAccountingYear = async () => {
    try {
      setLoading(true);

      const yearData = await apiClient.get(
        "/api/accountingYear/accounting-Year",
      );
      const formattedYears: AccountingYear[] = yearData.data.data.map(
        (year: any) => ({
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
          createdBy:year.createdBy.name,
          createdOn: year.createdBy.createdAt,
          updatedBy: year.updatedBy?.name,
          updatedOn: year.updatedBy?.updatedAt,
          status: year.status,
          closedPeriods: year.financeMonths.filter(
            (m: any) => m.financeStatus === "Closed",
          ).length,
          totalPeriods: year.financeMonths.length,
          financeMonths: year.financeMonths,
        }),
      );
      setYears(formattedYears);
      if (formattedYears.length > 0) {
        setSelectedYearId(formattedYears[0].id);
      }
      //  setYears(res.data.data);
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
  return year.financeMonths.map((month: any, idx: number) => {
    
    const now = new Date();
    const start = new Date(month.startDate);
    const end = new Date(month.endDate);

    const formatDate = (d: Date) =>
      d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    return {
      month: month.period.split(" ")[0],   // "Jul"
      year: month.period.split(" ")[1],    // "2026"
      status: month.financeStatus as PeriodStatus,
      sequenceNumber: `#${String(idx + 1).padStart(2, "0")}`,
      accountingYear: year.label,
      startDate: formatDate(start),
      endDate: formatDate(end),
      isCurrentPeriod: now >= start && now <= end,
      createdBy:year.createdBy,           // no backend field yet — placeholder
      createdOn: formatDate(new Date(month.createdAt)),
      updatedBy: "Admin",           // no backend field yet — placeholder
      updatedOn: formatDate(new Date(month.updatedAt)),
      auditLog: [],                  // no backend audit trail yet
    };
  });
};
  return (
    <div className="page-shell">
      <div className="page-header">
        <div className="min-w-0">
          <h1 className="page-title">Accounting Year</h1>
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
            <Plus size={16} /> New Accounting Year
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-6">
        <div className="min-w-0 space-y-3">
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
          <div className="min-w-0">
            <PeriodGrid
              year={selectedYear}
              periods={getPeriodsForYear(selectedYear)}
              onGenerate={() => console.log("Generate periods")}
            />
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="lg"
      >
        <AccountingYearForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
