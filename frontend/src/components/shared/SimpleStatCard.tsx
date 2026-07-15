// components/shared/SimpleStatCard.tsx
type SimpleStatCardProps = {
  count: number
  label: string
  textColor: string
}

export default function SimpleStatCard({ count, label, textColor }: SimpleStatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <p className={`stat-value ${textColor}`}>{count}</p>
      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </div>
  )
}