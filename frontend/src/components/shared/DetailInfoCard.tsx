type DetailInfoCardProps = {
  label: string
  value: string
  valueColor: string
}

export default function DetailInfoCard({ label, value, valueColor }: DetailInfoCardProps) {
  return (
    <div className="border border-[#F3F4F6] rounded-xl p-3 bg-[#F9FAFB]">
      <p className="text-xs text-[#6B7280]">{label}</p>
      <p className={`text-sm font-semibold mt-1 ${valueColor}`}>{value}</p>
    </div>
  )
}