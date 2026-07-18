// components/shared/ActiveInactiveBadge.tsx
type Props = { status: 'Active' | 'Inactive' }

export default function ActiveInactiveBadge({ status }: Props) {
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
      status === 'Active'
        ? 'bg-[#22C55E1A] text-[#22C55E]'
        : 'bg-[#EF44441A] text-[#EF4444]'
    }`}>
      {status}
    </span>
  )
}