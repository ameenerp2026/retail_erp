import { getPeriodColumns } from "./FinanceColumns"
import type { FinancePeriod } from "@/types/finance"
import ReusableTable from "@/components/shared/ReusableTable"

type PeriodTableProps = {
  periods: FinancePeriod[]
  onRowClick: (period: FinancePeriod) => void
}

export default function PeriodTable({ periods = [], onRowClick }: PeriodTableProps) {

  const columns = getPeriodColumns(onRowClick)

  return (
    <div className="w-full h-full">
      {/* ← onApply updates filters in PeriodTable */}
       <ReusableTable columns={columns} data={periods} rowKey="id" />
    </div>
  )
}