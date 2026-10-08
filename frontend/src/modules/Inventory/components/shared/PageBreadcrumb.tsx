import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

type Crumb = { label: string; to?: string }

/** Design breadcrumb: "Inventory > Product Setup > <Tab>" with chevron separators. */
export default function PageBreadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-2 text-xs font-medium">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-2">
          {i > 0 && <ChevronRight size={12} className="text-slate-400" />}
          {item.to ? (
            <Link to={item.to} className="text-[#155DFC] hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-500">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
