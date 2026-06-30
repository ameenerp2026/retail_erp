type EmptyStateProps = {
  icon: React.ReactNode
  message: string
}

export default function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-slate-300 mb-3">{icon}</div>
      <p className="text-sm text-[#6B7280]">{message}</p>
    </div>
  )
}