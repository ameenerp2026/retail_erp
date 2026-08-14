// components/shared/ConfirmDialog.tsx
import { AlertTriangle, Trash2 } from 'lucide-react'

type Props = {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  disabled?: boolean
  /** Optional banner shown above the buttons, e.g. explaining why a hard delete isn't allowed */
  warningMessage?: string
  /** 'danger' (default) = red confirm button, red trash icon. 'warning' = orange confirm button, amber banner */
  variant?: 'danger' | 'warning'
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  disabled,
  warningMessage,
  variant = 'danger',
}: Props) {
  if (!isOpen) return null

  const isWarning = variant === 'warning'
  const isDanger = variant === 'danger'

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
        <div
          className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full ${
            isWarning ? 'bg-amber-50' : 'bg-rose-50'
          }`}
        >
          <Trash2 size={18} className="text-rose-500" />
        </div>
        <h3 className="text-base font-bold text-[#043793] mb-2">{title}</h3>
        {isDanger && (
          <div>
          
          <p className="text-sm text-slate-500 mb-4">{message}</p>
          </div>
        )}
        {warningMessage && (
          <div className="mb-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
            <AlertTriangle size={15} className="mt-0.5 flex-shrink-0 text-amber-500" />
            <p className="text-xs font-medium text-amber-700">{warningMessage}</p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={disabled}
            className="h-10 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={disabled}
            className={`h-10 px-4 rounded-lg text-sm font-medium text-white transition disabled:opacity-50 ${
              isWarning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}