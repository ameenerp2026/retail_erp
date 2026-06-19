import { Trash2 } from "lucide-react"

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  unitName: string
  loading: boolean
}

export default function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  unitName,
  loading 
}: DeleteConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Trash2 className="text-red-500" size={24} />
          </div>
          
            <h3 className="text-lg font-semibold text-[#043793]">
                Delete Org Unit?
            </h3>
          
          <p className="text-sm text-gray-500 mt-1 mb-6">
            This action cannot be undone. All data associated with <span className="font-medium">{unitName}</span> will be permanently deleted.
          </p>
          
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 h-10 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 h-10 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {loading? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}