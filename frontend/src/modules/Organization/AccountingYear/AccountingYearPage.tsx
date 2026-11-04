import { useState, useEffect, useCallback } from "react";
import { Modal } from "@/components/shared/Modal";
import YearListItem from "./components/YearListItem";
import PeriodGrid from "./components/PeriodGrid";
import AccountingYearForm from "./components/AccountingYearForm";
import { useAuth } from "@/context/useAuth";
import Can from "@/context/Can";
import {
  AccountingYear,
  FinanceMonth,
  Period,
  PeriodStatus,
  YearStatus,
} from "@/types/accounting";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";
import { formatDate, formatDateRange } from "@/utils/dateFormat";
import { Plus } from "lucide-react";
import PeriodDetailModal from "./components/PeriodDetailModal";

// Shapes of the accounting year API payloads (typed instead of `any`)
type ApiAuditLog = {
  action: string;
  performedBy?: { name?: string } | null;
  createdAt?: string;
};
type ApiFinanceMonth = {
  id: number;
  period: string;
  startDate: string;
  endDate: string;
  financeStatus: string;
  createdBy?: string | null;
  createdAt?: string;
  updatedBy?: string | null;
  updatedAt?: string;
  auditLogs?: ApiAuditLog[];
};
type ApiAccountingYear = {
  id: number;
  yearName: string;
  fromDate: string;
  toDate: string;
  status: string;
  createdBy?: string | null;
  financeMonths: ApiFinanceMonth[];
};

  // Pure mapper: "OPEN" | "CLOSED" -> display status
const mapYearStatus = (status: string): YearStatus => {
  if (status === "OPEN") return "Active";
  if (status === "CLOSED") return "Closed";
  return "Pending";
};

export default function AccountingYearPage() {
  const { hasPermission } = useAuth();

  // All hooks run before the permission early-return
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);

  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);

  const [years, setYears] = useState<AccountingYear[]>([]);

  // Starts as `true` because the mount effect fetches immediately; subsequent
  // callers (event handlers) toggle loading themselves, so no state is updated
  // synchronously here.
  const [loading, setLoading] = useState(true);

  const selectedYear = years.find((y) => y.id === selectedYearId);

  const loadAccountingYears = useCallback(async (): Promise<AccountingYear[]> => {
    try {
      const yearData = await apiClient.get(
        "/api/accountingYear/accounting-Year",
      );

      return (
        (
          yearData.data.data as ApiAccountingYear[]
        ).map((year) => ({
          id: year.id,
          label: year.yearName,

          dateRange: formatDateRange(year.fromDate, year.toDate),

          status: mapYearStatus(year.status),

          closedPeriods: year.financeMonths.filter(
            (m) => m.financeStatus === "Closed",
          ).length,

          totalPeriods: year.financeMonths.length,

          // The API payload carries richer month fields than the display type,
          // so the raw shapes flow through (same behavior as before).
          financeMonths: year.financeMonths as unknown as FinanceMonth[],

          createdBy: year.createdBy ?? undefined,
        })) as AccountingYear[]
      );
    } catch (error) {
      console.error(error);

      toast.error("Failed to fetch accounting years");
      return [];
    }
  }, []);

  const applyAccountingYears = useCallback((incomingYears: AccountingYear[]) => {
    setYears(incomingYears);

    if (incomingYears.length > 0) {
      setSelectedYearId(incomingYears[0].id);
    }
  }, []);

  const fetchAccountingYear = useCallback(async () => {
    try {
      applyAccountingYears(await loadAccountingYears());
    } finally {
      setLoading(false);
    }
  }, [applyAccountingYears, loadAccountingYears]);
  const handleCreateYear = async (data: {
    fromDate: string;
    toDate: string;
  }) => {
    try {
      await apiClient.post("/api/accountingYear/accounting-Year", data);
      toast.success("Accounting Year created successfully");
      setIsModalOpen(false);
      await fetchAccountingYear();
    } catch (error) {
      console.error(error);
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to save accounting year",
      );
    }
  };

  useEffect(() => {
    // `loading` starts as true and is cleared once the request settles; the
    // state update happens only after the await, never synchronously.
    void (async () => {
      try {
        const incomingYears = await loadAccountingYears();
        applyAccountingYears(incomingYears);
      } finally {
        setLoading(false);
      }
    })();
  }, [applyAccountingYears, loadAccountingYears]);

  if (!hasPermission("ACCOUNT_GROUP_VIEW")) {
    return <p>You do not have permission to view accounting years.</p>;
  }

  const getPeriodsForYear = (year?: AccountingYear): Period[] => {
    if (!year) return [];

    return (year.financeMonths ?? []).map((month, idx: number) => {
      // The stored months keep the full API shape (audit trail etc.)
      const m = month as unknown as ApiFinanceMonth
      const start = new Date(m.startDate);
      const end = new Date(m.endDate);
      const now = new Date();

      return {
        id: m.id,
        month: m.period.split(" ")[0],
        year: m.period.split(" ")[1],

        status: m.financeStatus as PeriodStatus,

        sequenceNumber: `#${String(idx + 1).padStart(2, "0")}`,

        accountingYear: year.label,

        startDate: formatDate(start),

        endDate: formatDate(end),

        isCurrentPeriod: now >= start && now <= end,

        createdBy: m.createdBy ?? "Admin",

        createdOn: m.createdAt ? formatDate(new Date(m.createdAt)) : undefined,

        updatedBy: m.updatedBy ?? "Admin",

        updatedOn: m.updatedAt ? formatDate(new Date(m.updatedAt)) : undefined,

        auditLog: (m.auditLogs ?? []).map((log: ApiAuditLog) => ({
          action: log.action,
          by: log.performedBy?.name ?? "Admin",
          date: log.createdAt ? formatDate(new Date(log.createdAt)) : "—",
        })),
      };
    });
  };

  return (
    <div className="page-shell">
      {/* Header */}
      <div className="page-header">
        <div className="min-w-0">
          <h1 className="page-title">Accounting Year</h1>

          <p className="page-subtitle">
            Fiscal year setup and period configuration
          </p>
        </div>

        <div className="page-actions">
          <Can permission="ACCOUNT_GROUP_CREATE">
            <button
              type="button"
              disabled={loading}
              onClick={() => setIsModalOpen(true)}
              className="inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-[linear-gradient(#093055,#043793)] px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              <Plus size={16} />
              New Accounting Year
            </button>
          </Can>
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
              isSelected={year.id === selectedYearId}
              onSelect={() => setSelectedYearId(year.id)}
            />
          ))}
        </div>

        {/* Period Grid */}
        {selectedYear && (
          <div className="min-w-0">
            <PeriodGrid
              year={selectedYear}
              periods={getPeriodsForYear(selectedYear)}
              onPeriodClick={setSelectedPeriod}
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
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateYear}
        />
      </Modal>
      {/* Period Details Modal */}
      <PeriodDetailModal
        period={selectedPeriod}
        onClose={() => setSelectedPeriod(null)}
      />
    </div>
  );
}