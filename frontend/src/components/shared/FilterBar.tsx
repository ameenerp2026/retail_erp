// components/shared/FilterBar.tsx

import { Filter } from "lucide-react"
import { useState } from "react"

export type FilterField = {
  key: string
  placeholder: string
  width: string
}

type FilterBarProps = {
  fields: FilterField[]          // ← dynamic fields
  onApply: (filters: Record<string, string>) => void
}

export default function FilterBar({ fields, onApply }: FilterBarProps) {
  const [values, setValues] = useState<Record<string, string>>(
    // initialize all fields to empty string
    Object.fromEntries(fields.map(f => [f.key, ""]))
  )

  const updateField = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="mb-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:gap-3 sm:p-4">
      <div className="flex shrink-0 items-center gap-2 text-xs font-medium tracking-wide text-[#6B7A99]">
        <Filter size={16} className="shrink-0" />
        <span>FILTERS</span>
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-2 sm:gap-3">
        {fields.map(field => (
          <input
            key={field.key}
            type="text"
            placeholder={field.placeholder}
            value={values[field.key]}
            onChange={(e) => updateField(field.key, e.target.value)}
            style={{ width: field.width }}
            className="h-9 px-4 rounded-full border border-gray-300 text-sm bg-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[120px]"
          />
        ))}

        <button
          onClick={() => onApply(values)}
          className="h-9 px-6 rounded-full bg-[#043793] text-white text-sm font-medium hover:bg-blue-700 whitespace-nowrap shrink-0"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}