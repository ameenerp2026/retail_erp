import { Pencil, Trash2 } from 'lucide-react'
import type { BusinessLocationRow } from '@/types/admin/organization/businessLocation'

interface BusinessLocationTableProps {
  locations: BusinessLocationRow[]
  onEdit: (row: BusinessLocationRow) => void
  onDelete: (row: BusinessLocationRow) => void
  loading?: boolean
}

export default function BusinessLocationTable({
  locations,
  onEdit,
  onDelete,
  loading,
}: BusinessLocationTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th className="px-4 py-3">Location Name</th>
            {/* <th className="px-4 py-3">Code</th> */}
            <th className="px-4 py-3">Address</th>
            <th className="px-4 py-3">City</th>
            <th className="px-4 py-3">State</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {locations.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                No business locations found
              </td>
            </tr>
          ) : (
            locations.map((row) => (
              <tr key={row.id} className="text-sm transition-colors hover:bg-slate-50">
                <td className="px-4 py-4 font-semibold text-slate-800">{row.locationName}</td>
               {/* // <td className="px-4 py-4 text-slate-500">{row.code}</td> */}
                <td className="px-4 py-4 text-slate-600">{row.addressLine2}</td>
                <td className="px-4 py-4 text-slate-600">{row.city}</td>
                <td className="px-4 py-4 text-slate-600">{row.state}</td>
                <td className="px-4 py-4">
                  {row.status === 'ACTIVE' ? (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => onEdit(row)}
                      disabled={loading}
                      className="text-slate-400 transition hover:text-[#043793]"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(row)}
                      disabled={loading}
                      className="text-red-500 transition hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
