import { Trash2 } from 'lucide-react'

type Props = {
  unitName: string
  loading: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteConfirmForm({loading, onClose, onConfirm }: Props) {
  return (
    <div className="px-8 py-6 text-center">
      {/* Icon */}
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 mb-4">
        <Trash2 className="h-6 w-6 text-red-500" />
      </div>

      {/* Title */}
      <h2 className="mb-2 text-base font-semibold text-[#043793]">
        Delete Org Unit?
      </h2>

      {/* Description */}
      <p className="text-sm text-[#94A3B8] mb-6">
        This action cannot be undone. All data associated with
        <br />
        this unit will be permanently deleted.
      </p>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onClose}
          disabled={loading}
          className="flex-1 h-10 rounded-lg bg-gray-100 text-sm font-medium text-gray-600 hover:bg-gray-200 transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 h-10 rounded-lg bg-[#E53E3E] text-white text-sm font-medium hover:bg-red-600 transition disabled:opacity-50"
        >
          {loading? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}