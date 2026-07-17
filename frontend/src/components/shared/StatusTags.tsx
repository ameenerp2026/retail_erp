import { CheckCircle2, Clock, XCircle, Lock } from 'lucide-react'

export type StatusType =
  | 'Open'
  | 'Closed'
  | 'Provisional'
  | 'Running'
  | 'Completed'
  | 'Pending'
  | 'Failed'
  | 'Verified'
  | 'Future'
  | 'Active'
  | 'Inactive'

const STATUS_STYLES: Record<StatusType, { dot: string; text: string; div_bg: string }> = {
  Open: { dot: 'bg-[#00BC7D]', text: 'text-[#007A55]', div_bg: 'bg-[#ECFDF5]' },
  Closed: { dot: 'bg-[#FB2C36]', text: 'text-[#C10007]', div_bg: 'bg-[#FEF2F2]' },
  Provisional: { dot: 'bg-[#FE9A00]', text: 'text-[#BB4D00]', div_bg: 'bg-[#FFFBEB]' },
  Running: { dot: 'bg-[#2B7FFF]', text: 'text-[#1447E6]', div_bg: 'bg-[#EFF6FF]' },
  Completed: { dot: 'bg-[#00BC7D]', text: 'text-[#007A55]', div_bg: 'bg-[#ECFDF5]' },
  Pending: { dot: 'bg-[#FF8904]', text: 'text-[#CA3500]', div_bg: 'bg-[#FFF7ED]' },
  Failed: { dot: 'bg-[#FB2C36]', text: 'text-[#C10007]', div_bg: 'bg-[#FEF2F2]' },
  Verified: { dot: 'bg-[#00BC7D]', text: 'text-[#007A55]', div_bg: 'bg-[#ECFDF5]' },
  Future: { dot: 'bg-[#94A3B8]', text: 'text-[#64748B]', div_bg: 'bg-[#F1F5F9]' },
  Active: { dot: 'bg-[#00BC7D]', text: 'text-[#007A55]', div_bg: 'bg-[#ECFDF5]' },
  Inactive: { dot: 'bg-[#FB2C36]', text: 'text-[#C10007]', div_bg: 'bg-[#FEF2F2]' },
}

const STATUS_ICONS: Partial<Record<StatusType, React.ReactNode>> = {
  Verified: <CheckCircle2 size={12} />,
  Open: <CheckCircle2 size={12} />,
  Closed: <Lock size={12} />,
  Pending: <Clock size={12} />,
  Failed: <XCircle size={12} />,
  Future: <Clock size={12} />,
}

type StatusTagProps = {
  status: StatusType
  variant?: 'dot' | 'icon'
}

export default function StatusTag({ status, variant = 'dot' }: StatusTagProps) {
  const styles = STATUS_STYLES[status]

  if (!styles) {
    return <span className="text-xs text-slate-400">{status}</span>
  }

  return (
    <div className={`flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 ${styles.div_bg}`}>
      {variant === 'dot' ? (
        <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
      ) : (
        <span className={styles.text}>{STATUS_ICONS[status]}</span>
      )}
      <span className={`text-xs font-medium ${styles.text}`}>{status}</span>
    </div>
  )
}
