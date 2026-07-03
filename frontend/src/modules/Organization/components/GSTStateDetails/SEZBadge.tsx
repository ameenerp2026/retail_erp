// components/GSTStateDetails/SEZBadge.tsx
export default function SEZBadge({ value }: { value: boolean }) {
  if (!value) return <span className="text-slate-300">—</span>

  return (
    <span className="bg-orange-50 text-orange-600 text-[10px] font-semibold px-2 py-0.5 rounded">
      SEZ
    </span>
  )
}