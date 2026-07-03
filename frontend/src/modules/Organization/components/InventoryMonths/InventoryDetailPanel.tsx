
import DetailPanel, { type DetailRow, type ActivityItem } from '@/components/shared/DetailPanel'
import StatusTag from '@/components/shared/StatusTags'
import type { InventoryPeriod } from '@/types/inventory'
import { Activity, AlertTriangle, CheckCircle, CheckSquare, FileText } from 'lucide-react'

type Props = {
  period: InventoryPeriod
  onClose: () => void
}

const activityItems: ActivityItem[] = [
  { id: 1, title: "Inventory Opened",    date: "01 Apr 2026 08:00", user: "Admin",  bgColor: "bg-[#ECFDF5]",  iconColor: "text-[#009966]",  icon:  <CheckSquare size={16} className="text-blue-500" />},
  { id: 2, title: "COGS Calculation Started",  date: "12 Jun 2026 09:14", user: "System",    bgColor: "bg-[#EFF6FF]",   iconColor: "text-[#155DFC]",   icon:  <Activity size={16} className="text-blue-500" />},
  { id: 3, title: "Finance Month Opened", date: "01 Apr 2026 08:05", user: "Finance Team", bgColor: "bg-[#FFFBEB]", iconColor: "text-[#E17100]", icon:<FileText size={16} className="text-slate-400" />},
  { id: 4, title: "Documents Verified",    date: "10 Jun 2026 14:30", user: "Reviewer",        bgColor: "bg-[#ECFDF5]", iconColor: "text-[#009966]", icon: <CheckCircle size={16} className="text-green-500" /> },
  { id: 5, title: "Month Closure Pending",   date: "12 Jun 2026 09:00", user: "System",        bgColor: "bg-[#FFF7ED]",    iconColor: "text-[#FF6900]",    icon: <AlertTriangle size={16} className="text-orange-500" />},
]

export default function InventoryDetailPanel({ period, onClose }: Props) {
  const rows: DetailRow[] = [
    { label: "InventoryStatus",    type: "badge",  value: period.invStatus, badgeComponent: <StatusTag status={period.invStatus} /> },
    { label: "Finance Status",  type: "badge",    value: period.financeStatus,     badgeComponent: <StatusTag status={period.financeStatus} />     },
    { label: "COGS Status",       type: "badge",  value: period.cogsStatus,    badgeComponent: <StatusTag status={period.cogsStatus} />    },
    { label: "Last COGS Run", type: "text",   value: period.lastModified,textColor: "text-[#1A2332]"                                                               },
    { label: "Modified By", type: "text",   value: period.modifiedBy,textColor: "text-[#1A2332]"                                                               },
    { label: "Modified Time", type: "text",   value: period.lastModified,textColor: "text-[#6B7A99]"                                                               },
   
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
