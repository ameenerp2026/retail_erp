import { Pencil, Trash2 ,CheckCircle2, XCircle} from "lucide-react"
import type { OrgUnitFormData } from "@/components/forms/validate.schema"

export interface OrgUnit extends OrgUnitFormData {
  id: string
  subtext: string
  status: 'Active' | 'Inactive'
}

interface OrgUnitTableProps {
  units: OrgUnit[]
  onEdit: (row: OrgUnit) => void // Must match units type
  onDelete: (row: OrgUnit) => void
  loading?: boolean
}
export default function OrgUnitTable({ units,onEdit,onDelete,loading }: OrgUnitTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Unit ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              GSTIN
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Manager
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {units.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                No organization units found
              </td>
            </tr>
          ) : (
            units.map((unit) => (
              <tr key={unit.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm font-mono text-[#1ed2e2] font-bold">
                  {unit.id}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-semibold text-[#043793]">{unit.name}</div>
                  <div className="text-xs text-[#94A3B8]">{unit.subtext}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <span className="px-2.5 py-1 rounded-md bg-blue-50 text-[#043793] text-xs font-medium">
                    {unit.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                  {unit.gstin}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                  {unit.manager}
                </td>
                 <td className="px-4 py-3">
                  {unit.status === 'Active' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700">
                      <CheckCircle2 size={14} />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-red-50 text-[#EF4444]">
                      <XCircle size={14} />
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(unit)}
                      disabled={loading}
                      className="p-1.5 rounded-lg  text-[#1ed2e2] hover:text-[#1ed2e2] transition"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(unit)} 
                      disabled={loading}
                      className="text-[#EF4444] hover:text-[#DC2626] transition"
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