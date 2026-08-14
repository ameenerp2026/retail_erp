import { useQuery } from '@tanstack/react-query'
import DetailPanel, { type DetailRow } from '@/components/shared/DetailPanel'
import StatusTag from '@/components/shared/StatusTags'
import type { FinancePeriod } from '@/types/finance'
import { financeService } from '@/services/admin/organization/financeService'

type Props = {
  period: FinancePeriod
  onClose: () => void
}

export default function PeriodDetailPanel({ period, onClose }: Props) {
 const { data: activityItems = [] } = useQuery({
  queryKey: ['finance-activity', period.periodId],
  queryFn: () => financeService.getActivity(period.periodId),
})

  const rows: DetailRow[] = [
    { label: 'Finance Status', type: 'badge', value: period.financeStatus, badgeComponent: <StatusTag status={period.financeStatus} /> },
    //{ label: 'Transactions', type: 'number', value: period.transactions.toLocaleString(), numberColor: 'text-[#043793]' },
    //{ label: 'Last Closed By', type: 'text', value: period.lastClosedBy ?? '—', textColor: 'text-[#1A2332]' },
    { label: 'Last Updated', type: 'text', value: period.lastUpdated, textColor: 'text-[#1A2332]' },
  ]

  return (
    <DetailPanel
      title={period.period}
      sectionTitle="Month Details"
      rows={rows}
      activityItems={activityItems}
      onClose={onClose}
    />
  )
}
