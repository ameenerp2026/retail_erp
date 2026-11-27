import { X, Check } from 'lucide-react'

interface BusinessLocationFilterProps {
  selectedStatus: string
  onChangeStatus: (status: string) => void
  selectedState: string
  onChangeState: (state: string) => void
  availableStates: string[]
  onReset: () => void
  onClose: () => void
}

export default function BusinessLocationFilter({
  selectedStatus,
  onChangeStatus,
  selectedState,
  onChangeState,
  availableStates,
  onReset,
  onClose,
}: BusinessLocationFilterProps) {
  const statusOptions = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
  ]

  const hasFilters = selectedStatus !== 'ALL' || selectedState !== 'ALL'

  return (
    <div className="absolute left-0 top-12 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
      <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
        <h4 className="text-xs font-semibold text-slate-800">Filter Locations</h4>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button
              type="button"
              onClick={onReset}
              className="text-[11px] font-medium text-[#043793] hover:underline"
            >
              Reset
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Status */}
        <div>
          <label className="mb-1.5 block text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Status
          </label>
          <div className="flex flex-wrap gap-1.5">
            {statusOptions.map((opt) => {
              const active = selectedStatus === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChangeStatus(opt.value)}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    active
                      ? 'bg-[#093055] text-white'
                      : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {active && <Check size={12} />}
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* State */}
        <div>
          <label className="mb-1.5 block text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            State
          </label>
          <select
            value={selectedState}
            onChange={(e) => onChangeState(e.target.value)}
            className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-[#043793]"
          >
            <option value="ALL">All States</option>
            {availableStates.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl bg-[#093055] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[#072440] transition"
        >
          Done
        </button>
      </div>
    </div>
  )
}
