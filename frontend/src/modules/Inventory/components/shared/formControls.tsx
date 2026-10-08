import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { FieldLabel } from './SectionLabel'

type FieldWrapProps = {
  label: string
  required?: boolean
  children: ReactNode
  className?: string
}

export function FieldWrap({ label, required, children, className = '' }: FieldWrapProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <FieldLabel required={required}>{label}</FieldLabel>
      {children}
    </div>
  )
}

const baseInput =
  'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-[#314158] placeholder:text-slate-400 focus:border-[#155DFC] focus:outline-none focus:ring-2 focus:ring-[#155DFC]/20 disabled:bg-slate-50 disabled:text-slate-400'

export function TextInput({
  placeholder,
  disabled,
  type = 'text',
  value,
  onChange,
}: {
  placeholder?: string
  disabled?: boolean
  type?: string
  value?: string | number
  onChange?: (v: string) => void
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={baseInput}
    />
  )
}

export function SelectInput({
  options,
  placeholder,
  disabled,
  value,
  onChange,
}: {
  options: readonly string[]
  placeholder: string
  disabled?: boolean
  value?: string
  onChange?: (v: string) => void
}) {
  return (
    <div className="relative">
      <select
        value={value ?? ''}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={`${baseInput} appearance-none pr-9 ${value ? '' : 'text-slate-400'}`}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-[#314158]">
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
      />
    </div>
  )
}

export function Toggle({ checked, onChange }: { checked: boolean; onChange?: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
        checked ? 'bg-[#155DFC]' : 'bg-slate-300'
      }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
          checked ? 'left-4.5' : 'left-0.5'
        }`}
      />
    </button>
  )
}

/** Design drawer footer: Cancel (outline) + primary action (blue). */
export function DrawerFooter({
  cancelLabel = 'Cancel',
  primaryLabel = 'Save',
  primaryIcon,
  onCancel,
  onPrimary,
  primaryDisabled,
}: {
  cancelLabel?: string
  primaryLabel?: string
  primaryIcon?: ReactNode
  onCancel: () => void
  onPrimary?: () => void
  primaryDisabled?: boolean
}) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
      <button
        type="button"
        onClick={onCancel}
        className="h-10 rounded-lg border border-slate-200 px-5 text-sm font-medium text-[#314158] transition hover:bg-slate-50"
      >
        {cancelLabel}
      </button>
      <button
        type="button"
        onClick={onPrimary}
        disabled={primaryDisabled}
        className="flex h-10 items-center gap-2 rounded-lg bg-[#155DFC] px-5 text-sm font-medium text-white transition hover:bg-[#1447E6] disabled:opacity-50"
      >
        {primaryIcon}
        {primaryLabel}
      </button>
    </div>
  )
}
