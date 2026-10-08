type PillVariant = 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'slate' | 'amber'

const PILL_STYLES: Record<PillVariant, { dot: string; text: string; bg: string }> = {
  green: { dot: 'bg-[#00BC7D]', text: 'text-[#007A55]', bg: 'bg-[#ECFDF5]' },
  blue: { dot: 'bg-[#2B7FFF]', text: 'text-[#1447E6]', bg: 'bg-[#EFF6FF]' },
  purple: { dot: 'bg-[#8E4EC6]', text: 'text-[#6D28D9]', bg: 'bg-[#F5F3FF]' },
  orange: { dot: 'bg-[#FF8904]', text: 'text-[#CA3500]', bg: 'bg-[#FFF7ED]' },
  red: { dot: 'bg-[#FB2C36]', text: 'text-[#C10007]', bg: 'bg-[#FEF2F2]' },
  amber: { dot: 'bg-[#FE9A00]', text: 'text-[#BB4D00]', bg: 'bg-[#FFFBEB]' },
  slate: { dot: 'bg-[#94A3B8]', text: 'text-[#64748B]', bg: 'bg-[#F1F5F9]' },
}

export type { PillVariant }

type ModulePillProps = {
  label: string
  variant?: PillVariant
}

/** Small dot + label pill used in Inventory tables (Active, Primary, Alternate, Bundle, Kit...). */
export default function ModulePill({ label, variant = 'green' }: ModulePillProps) {
  const s = PILL_STYLES[variant]
  return (
    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 ${s.bg}`}>
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      <span className={`text-xs font-medium ${s.text}`}>{label}</span>
    </span>
  )
}
