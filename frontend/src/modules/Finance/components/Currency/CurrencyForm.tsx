import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { X } from 'lucide-react'
import { currencySchema, type CurrencyFormData } from '@/components/forms/validate.schema'
import FormInput from '@/components/forms/FormInput'
import type { CurrencyRecord } from '@/types/currency'

type Props = {
  currency?: CurrencyRecord | null
  onClose: () => void
}

export default function CurrencyForm({ currency, onClose }: Props) {
  const isEdit = Boolean(currency)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CurrencyFormData>({
    resolver: zodResolver(currencySchema),
    defaultValues: {
      code:         currency?.code ?? '',
      name:         currency?.name ?? '',
      symbol:       currency?.symbol ?? '',
      exchangeRate: currency?.exchangeRate ?? 1,
      isBase:       currency?.isBase ?? false,
    },
  })

  const isBase = watch('isBase')

  function onSubmit(data: CurrencyFormData) {
    try {
      console.log('Form data:', data)
      // call your API here
      // isEdit ? await currencyService.update(currency!.id, data) : await currencyService.create(data)
      toast.success(isEdit ? 'Currency updated successfully!' : 'Currency added successfully!')
      onClose()
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">

      {/* Header */}
      <div className="px-6 pt-4 pb-4 border-b border-gray-200 shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#043793]">
              {isEdit ? 'Edit Currency' : 'Add Currency'}
            </h2>
            <p className="text-[#94A3B8] text-sm mt-1">
              {isEdit
                ? 'Update this currency and its exchange rate.'
                : 'Configure a new currency and its exchange rate.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Form */}
      <form
        id="currency-form"
        onSubmit={handleSubmit(onSubmit)}
        className="px-6 py-5 space-y-5 overflow-y-auto"
      >
        <div className="grid grid-cols-2 gap-4">
          {/* Currency Code */}
          <FormInput
            label="Currency Code"
            required
            placeholder="e.g. USD"
            error={errors.code?.message}
            {...register('code')}
          />

          {/* Symbol */}
          <FormInput
            label="Symbol"
            required
            placeholder="e.g. $"
            error={errors.symbol?.message}
            {...register('symbol')}
          />
        </div>

        {/* Currency Name */}
        <FormInput
          label="Currency Name"
          required
          placeholder="e.g. US Dollar"
          error={errors.name?.message}
          {...register('name')}
        />

        {/* Exchange Rate */}
        <FormInput
          label="Exchange Rate (vs INR)"
          required
          type="text"
          inputMode="decimal"
          placeholder="e.g. 83.42"
          error={errors.exchangeRate?.message}
          {...register('exchangeRate', { valueAsNumber: true })}
        />

        {/* Set as base currency */}
        <div>
          <label className="block text-sm text-[#9CA3AF] mb-2">Base Currency</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue('isBase', true, { shouldValidate: true })}
              className={`h-10 px-4 rounded-lg text-sm font-medium border transition ${
                isBase
                  ? 'text-[#21B6A8] bg-[#21B6A826] border-[#21B6A84D]'
                  : 'text-[#9CA3AF] bg-[#F5F7FB] border-[#E5E7EB] hover:bg-slate-100'
              }`}
            >
              Set as Base
            </button>
            <button
              type="button"
              onClick={() => setValue('isBase', false, { shouldValidate: true })}
              className={`h-10 px-4 rounded-lg text-sm font-medium border transition ${
                !isBase
                  ? 'text-[#043793] bg-[#0437931A] border-[#0437934D]'
                  : 'text-[#9CA3AF] bg-[#F5F7FB] border-[#E5E7EB] hover:bg-slate-100'
              }`}
            >
              Standard
            </button>
          </div>
        </div>
      </form>

      {/* Footer */}
      <div className="px-6 py-4 bg-slate-50 border-t border-gray-200 flex justify-end gap-3 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="h-10 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="currency-form"
          disabled={isSubmitting}
          className="h-10 px-4 rounded-lg bg-[linear-gradient(#093055,#043793)] text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {isSubmitting ? (isEdit ? 'Saving...' : 'Adding...') : isEdit ? 'Save Changes' : 'Add Currency'}
        </button>
      </div>

    </div>
  )
}
