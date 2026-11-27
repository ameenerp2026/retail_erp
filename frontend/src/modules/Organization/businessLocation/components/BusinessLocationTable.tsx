import { SquarePen, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import type { BusinessLocationRow } from '@/types/admin/organization/businessLocation'
import { getStates } from '@/services/location.service'

interface BusinessLocationTableProps {
  locations: BusinessLocationRow[]
  totalCount: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onEdit: (row: BusinessLocationRow) => void
  onDelete: (row: BusinessLocationRow) => void
  loading?: boolean
  error?: string
}

export default function BusinessLocationTable({
  locations,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  loading,
  error,
}: BusinessLocationTableProps) {
  const getStateName = (countryCode: string, stateValue: string) => {
    if (!stateValue) return '—'
    const states = getStates(countryCode || 'IN')
    const state = states.find(
      (s) =>
        s.isoCode.toLowerCase() === stateValue.toLowerCase() ||
        s.name.toLowerCase() === stateValue.toLowerCase()
    )
    return state?.name || stateValue
  }

  const getLocationCode = (row: BusinessLocationRow) => {
    if (row.code) return row.code
    if ((row as any).locationCode) return (row as any).locationCode
    const initials = row.locationName
      ? row.locationName
          .split(' ')
          .map((w) => w[0])
          .join('')
          .toUpperCase()
          .slice(0, 3)
      : 'LOC'
    return `${initials}-${String(row.id).padStart(3, '0')}`
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500">
              <th className="px-6 py-3.5">Location Name</th>
              <th className="px-6 py-3.5">Code</th>
              <th className="px-6 py-3.5">Address</th>
              <th className="px-6 py-3.5">City</th>
              <th className="px-6 py-3.5">State</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-500">
                  <div className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#093055] border-t-transparent" />
                    Loading business locations...
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-rose-500">
                  Failed to load business locations: {error}
                </td>
              </tr>
            ) : locations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-500">
                  No business locations found.
                </td>
              </tr>
            ) : (
              locations.map((row) => {
                const isActive = row.status?.toUpperCase() === 'ACTIVE'
                const displayAddress =
                  [row.addressLine1, row.addressLine2].filter(Boolean).join(', ') || '—'

                return (
                  <tr
                    key={row.id}
                    className="text-sm transition-colors hover:bg-slate-50/60"
                  >
                    {/* Location Name */}
                    <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                      {row.locationName}
                    </td>

                    {/* Code */}
                    <td className="px-6 py-4 text-slate-600 font-medium whitespace-nowrap">
                      {getLocationCode(row)}
                    </td>

                    {/* Address */}
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={displayAddress}>
                      {displayAddress}
                    </td>

                    {/* City */}
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                      {row.city || '—'}
                    </td>

                    {/* State */}
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                      {getStateName(row.country, row.state)}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isActive ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={() => onEdit(row)}
                          disabled={loading}
                          className="text-slate-400 transition hover:text-[#043793]"
                          title="Edit location"
                        >
                          <SquarePen size={17} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(row)}
                          disabled={loading}
                          className="text-rose-400 transition hover:text-rose-600"
                          title="Delete location"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination matching screenshot */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3.5 border-t border-slate-100 bg-white">
        <p className="text-xs text-slate-500">
          Showing {locations.length} of {totalCount} locations
        </p>

        {totalPages > 0 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium transition ${
                  currentPage === page
                    ? 'bg-[#093055] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
