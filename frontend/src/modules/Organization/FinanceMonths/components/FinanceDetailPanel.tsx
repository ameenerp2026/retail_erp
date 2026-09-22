import DetailPanel, { type DetailRow } from '@/components/shared/DetailPanel'
import type { FinancePeriod } from '@/types/finance'
import StatusTag, { type StatusType } from '@/components/shared/StatusTags'
import { formatDate, formatDateTime } from '@/utils/dateFormat'
import { useGetFinanceActivity } from '@/hooks/admin/organization/useFinanceService'

type Props = {
  period: FinancePeriod
  onClose: () => void
}

export default function PeriodDetailPanel({ period, onClose }: Props) {
  const { data: activityItems = [] } = useGetFinanceActivity(period.id)

  const formattedStatus = (period.financeStatus
    ? period.financeStatus.charAt(0).toUpperCase() + period.financeStatus.slice(1).toLowerCase()
    : 'Open') as StatusType

  const rows: DetailRow[] = [
    {
      label: 'Finance Status',
      type: 'badge',
      value: period.financeStatus,
      badgeComponent: <StatusTag status={formattedStatus} />,
    },
    {
      label: 'Start Date',
      type: 'text',
      value: period.startDate ? formatDate(period.startDate) : '—',
      textColor: 'text-[#1A2332]',
    },
    {
      label: 'End Date',
      type: 'text',
      value: period.endDate ? formatDate(period.endDate) : '—',
      textColor: 'text-[#1A2332]',
    },
    {
      label: 'Last Updated',
      type: 'text',
      value: period.updatedAt ? formatDateTime(period.updatedAt) : period.lastModified || '—',
      textColor: 'text-[#1A2332]',
    },
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
