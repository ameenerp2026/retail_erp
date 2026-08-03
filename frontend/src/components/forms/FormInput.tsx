import { forwardRef } from 'react'

type Options = {
  label: string
  value: string
}

type FormInputProps = {
  label: string
  error?: string
  type?: "text" | "email" | "password" | "date" | "textarea" | "select"|"file" | "toggle"
  required?: boolean
  readOnly?: boolean
  options?: Options[]
  buttonText?: string
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, 'name'>

const FormInput = forwardRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, FormInputProps>(
  ({ 
 label,
    error,
    type = "text",
    required,
    readOnly,
    options = [],
    buttonText = "Choose File",
    checked,
    onCheckedChange,

    ...rest},
   ref) => {
    
    const baseClass = `w-full border rounded-xl px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#043793] disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 ${
      error ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
    }`
    
    const labelClass = "text-[12px] text-[#94A3B8] font-semibold block my-1"
    // File input with custom button
    if (type === 'file') {
      return (
        <div className="space-y-1">
          <label className={labelClass}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>

          <label className="cursor-pointer">
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              type="file"
              className="hidden" // hide default input
              {...rest}
            />
            <div className={`${baseClass} flex items-center justify-between`}>
              <span className="text-gray-500">
                {(rest as any).value?.[0]?.name || 'No file chosen'}
              </span>
              <span className="bg-[#043793] text-white px-4 py-1 rounded-lg text-xs">
                {buttonText}
              </span>
            </div>
          </label>

          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      )
    }
    
    return (
      <div className="space-y-1">
        <label className={labelClass}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {type === 'textarea' ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            readOnly={readOnly}
            className={baseClass}
            {...rest}
          />
        ) : type === 'select' ? (
          <select
            ref={ref as React.Ref<HTMLSelectElement>}
            className={baseClass}
            {...rest}
          >
            <option value=''>Select</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) :type === 'toggle' ?(
        <label className="flex items-center justify-between w-full cursor-pointer">
    <span className="text-sm text-slate-600">
      {checked ? "Active" : "Inactive"}
    </span>

    <div className="relative">
      <input
        ref={ref as React.Ref<HTMLInputElement>}
        type="checkbox"
          checked={checked}
  onChange={(e) => onCheckedChange?.(e.target.checked)}
        className="sr-only peer"
        disabled={readOnly}
      />

      <div
        className="
          w-12
          h-6
          rounded-full
          bg-gray-300
          peer-checked:bg-[#043793]
          transition-colors
          duration-300
        "
      />

      <div
        className="
          absolute
          top-[2px]
          left-[2px]
          w-5
          h-5
          rounded-full
          bg-white
          shadow-md
          transition-transform
          duration-300
          peer-checked:translate-x-6
        "
      />
    </div>
  </label>
        ) :(
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            type={type}
            readOnly={readOnly}
            className={baseClass}
            {...rest}
          />
        )}
        
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'
export default FormInput