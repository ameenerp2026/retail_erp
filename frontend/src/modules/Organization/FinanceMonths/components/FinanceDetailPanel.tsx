import DetailPanel, { type DetailRow } from '@/components/shared/DetailPanel'
import type { FinancePeriod } from '@/types/finance'
import StatusTag, { type StatusType } from '@/components/shared/StatusTags'
import { formatDateTime } from '@/utils/dateFormat'

type Props = {
  period: FinancePeriod
  onClose: () => void
}
// const FINANCE_STATUS_TO_STATUS_TAG: Record<FinanceStatType, FinancePeriodStatus> = {
//   open: 'Open',
//   closed: 'Closed',
//   provisional: 'Provisional',
// }

export default function PeriodDetailPanel({ period, onClose }: Props) {
  // const rows: DetailRow[] = [
  //   { label: 'Finance Status', type: 'badge', value: period.financeStatus, badgeComponent: <StatusTag status={FINANCE_STATUS_TO_STATUS_TAG[period.financeStatus]} /> },
  //   //{ label: 'Transactions', type: 'number', value: period.transactions.toLocaleString(), numberColor: 'text-[#043793]' },
  //   //{ label: 'Last Closed By', type: 'text', value: period.lastClosedBy ?? '—', textColor: 'text-[#1A2332]' },
  //   { label: 'Last Updated', type: 'text', value: period.updatedAt, textColor: 'text-[#1A2332]' },
  // ]
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
      value: period.startDate || '—',
      textColor: 'text-[#1A2332]',
    },
    {
      label: 'End Date',
      type: 'text',
      value: period.endDate || '—',
      textColor: 'text-[#1A2332]',
    },
    {
      label: 'Last Updated',
      type: 'text',
      value: period.updatedAt ? formatDateTime(period.updatedAt) : '—',
      textColor: 'text-[#1A2332]',
    },
  ]

  return (
    <DetailPanel
      title={period.period}
      sectionTitle="Month Details"
      rows={rows}
      activityItems={[]}
      onClose={onClose}
    />
  )
}
