import type { FinancePeriod } from '@/types/finance'
import ReusableTable from '@/components/shared/ReusableTable'
import { getFinanceSetupColumns } from './FinanceColumns'

type PeriodTableProps = {
  periods: FinancePeriod[]
  loading?: boolean
}

export default function PeriodTable({ periods = [], loading = false }: PeriodTableProps) {
  const columns = getFinanceSetupColumns()

  return (
    <div className="w-full overflow-x-auto">
      <ReusableTable columns={columns} data={periods} rowKey="id" loading={loading} />
    </div>
  )
}
