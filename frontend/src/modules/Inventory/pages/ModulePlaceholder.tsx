import { Construction } from 'lucide-react'

type Props = {
  title: string
  description?: string
}

/** Stand-in for Inventory sidebar pages that have no Figma screens yet. */
export default function ModulePlaceholder({ title, description }: Props) {
  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          {description && <p className="page-subtitle">{description}</p>}
        </div>
      </div>
      <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF]">
          <Construction size={20} className="text-[#155DFC]" />
        </div>
        <p className="text-sm font-medium text-[#314158]">{title} is coming soon</p>
        <p className="max-w-sm text-center text-xs text-slate-400">
          This page will follow the Enterprise Inventory Module design once its screens are ready.
        </p>
      </div>
    </div>
  )
}
