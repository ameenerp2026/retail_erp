// components/shared/SimpleStatCard.tsx
type SimpleStatCardProps = {
  count: number
  label: string
  textColor: string
}

export default function SimpleStatCard({ count, label, textColor }: SimpleStatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <p className={`text-2xl font-bold ${textColor}`}>{count}</p>
      <p className="text-xs text-slate-400 mt-1">{label}</p>
    </div>
  )
}