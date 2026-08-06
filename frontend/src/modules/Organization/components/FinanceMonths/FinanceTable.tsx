import type { FinancePeriod } from '@/types/finance'
import ReusableTable from '@/components/shared/ReusableTable'
import { getFinanceSetupColumns } from './FinanceColumns'

type PeriodTableProps = {
  periods: FinancePeriod[]
  loading?: boolean
  onSelect?: (period: FinancePeriod) => void
}

export default function PeriodTable({ periods = [], loading = false, onSelect }: PeriodTableProps) {
  const columns = getFinanceSetupColumns({ onSelect })

  return (
    <div className="w-full overflow-x-auto">
      <ReusableTable columns={columns} data={periods} rowKey="id" loading={loading} />
    </div>
  )
}
