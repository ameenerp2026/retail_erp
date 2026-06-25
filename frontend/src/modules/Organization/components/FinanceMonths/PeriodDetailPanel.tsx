
// PeriodDetailPanel.tsx — now just a thin wrapper
import DetailPanel, { type DetailRow, type ActivityItem } from '@/components/shared/DetailPanel'
import StatusTag from './StatusTags'
import type { FinancePeriod } from '@/types/finance'

type Props = {
  period: FinancePeriod
  onClose: () => void
}

const activityItems: ActivityItem[] = [
  { id: 1, title: "Finance Month Opened",    date: "01 Apr 2026 08:05", user: "Finance Team",  bgColor: "bg-green-100",  iconColor: "text-green-600",  icon: "◎" },
  { id: 2, title: "Journal Entries Posted",  date: "05 Apr 2026 14:30", user: "Accountant",    bgColor: "bg-blue-100",   iconColor: "text-blue-600",   icon: "≡" },
  { id: 3, title: "P&L Reconciliation Done", date: "10 May 2026 11:00", user: "Finance Admin", bgColor: "bg-purple-100", iconColor: "text-purple-600", icon: "↗" },
  { id: 4, title: "6 Unposted Documents",    date: "12 Jun 2026 08:00", user: "System",        bgColor: "bg-orange-100", iconColor: "text-orange-500", icon: "⚠" },
  { id: 5, title: "Month Closure Pending",   date: "12 Jun 2026 09:00", user: "System",        bgColor: "bg-red-100",    iconColor: "text-red-500",    icon: "◷" },
]

export default function PeriodDetailPanel({ period, onClose }: Props) {
  const rows: DetailRow[] = [
    { label: "Finance Status",    type: "badge",  value: period.financeStatus, badgeComponent: <StatusTag status={period.financeStatus} /> },
    { label: "Inventory Status",  type: "badge",  value: period.invStatus,     badgeComponent: <StatusTag status={period.invStatus} />     },
    { label: "COGS Status",       type: "badge",  value: period.cogsStatus,    badgeComponent: <StatusTag status={period.cogsStatus} />    },
    { label: "Last Modification", type: "text",   value: period.lastModified,textColor: "text-[#1A2332]"                                                               },
    { label: "Last User",         type: "text",   value: "Finance Admin"        ,textColor: "text-[#1A2332]"                                                               },
    { label: "Pending Invoices",  type: "number", value: 4, numberColor: "text-orange-500"                                                 },
    { label: "Pending Documents", type: "number", value: 6, numberColor: "text-red-500"                                                    },
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
