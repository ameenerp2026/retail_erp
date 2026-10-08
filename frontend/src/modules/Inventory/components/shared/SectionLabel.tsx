import type { ReactNode } from 'react'

/** Uppercase small section label used inside drawers, e.g. "TAX IDENTITY", "COMPONENTS". */
export default function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6B7A99]">{children}</p>
  )
}

/** Field label inside drawers, e.g. "Tax Group" (with optional required marker). */
export function FieldLabel({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <span className="text-xs font-medium text-[#314158]">
      {children}
      {required && <span className="ml-0.5 text-[#E7000B]">*</span>}
    </span>
  )
}
