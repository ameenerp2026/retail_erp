type Props = {
  label: string
  colorClass: string  
}

export default function ParentGroupBadge({ label, colorClass }: Props) {
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${colorClass}`}>
      {label}
    </span>
  )
}
