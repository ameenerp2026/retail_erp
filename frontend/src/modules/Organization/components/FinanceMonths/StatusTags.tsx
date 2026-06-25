// components/StatusTag.tsx
export type StatusType = "Open" | "Closed" | "Provisional" | "Running" | "Completed" | "Pending"

const STATUS_STYLES: Record<StatusType, { dot: string; text: string,div_bg:string }> = {
  Open: { dot: "bg-[#00BC7D]", text: "text-[#007A55]",div_bg:"bg-[#ECFDF5]" },
  Closed: { dot: "bg-[#FB2C36]", text: "text-[#C10007]",div_bg:"bg-[#FEF2F2]" }, 
  Provisional: { dot: "bg-[#FE9A00]", text: "text-[#BB4D00]",div_bg:"bg-[#FFFBEB]" },
  Running: { dot: "bg-[#2B7FFF]", text: "text-[#1447E6]",div_bg:"bg-[#EFF6FF]" },
  Completed: { dot: "bg-[#00BC7D]", text: "text-[#007A55]",div_bg:"bg-[#ECFDF5]" },
  Pending: { dot: "bg-[#FF8904]", text: "text-[#CA3500]",div_bg:"bg-[#FFF7ED]" }
}

export default function StatusTag({ status }: { status: StatusType }) {
  const styles = STATUS_STYLES[status]
  
  return (
    <div className={`rounded-full ${styles.div_bg} flex items-center gap-1.5`}>
      <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
      <span className={`${styles.text} text-sm`}>{status}</span>
    </div>
  )
}