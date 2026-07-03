import { getInventoryColumns } from "./InventoryColumns"
import type { InventoryPeriod } from "@/types/inventory"
import ReusableTable from "@/components/shared/ReusableTable"

type PeriodTableProps = {
  periods: InventoryPeriod[]
  onRowClick: (period: InventoryPeriod) => void,
  onHistoryClick: (period: InventoryPeriod) => void
}

export default function InventoryTable({ periods = [], onRowClick, onHistoryClick }: PeriodTableProps) {

  const columns = getInventoryColumns(onRowClick,onHistoryClick)

  return (
    <div className="w-full h-full">
      {/* ← onApply updates filters in PeriodTable */}
       <ReusableTable columns={columns} data={periods} rowKey="id" />
    </div>
  )
}