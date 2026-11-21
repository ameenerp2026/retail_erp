import { useForm, useWatch, Controller } from 'react-hook-form'
import { useEffect, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Save, ArrowLeft, Info, MapPin, Calendar, Clock } from 'lucide-react'
import {
  businessLocationSchema,
  type businessLocationFormData,
} from '../../../../components/forms/validate.schema'
import { useOrganizationUnits } from '../../../../hooks/admin/organization/useOrganizationUnits'
import { getCountries, getStates } from '@/services/location.service'
import type { BusinessLocationRow } from '../../../../types/admin/organization/businessLocation'
import { useGSTINs } from '../../../../hooks/admin/organization/useGSTIN'
import {
  useCreateBusinessLocation,
  useUpdateBusinessLocation,
} from '@/hooks/admin/organization/useBusinessLocation'

type BusinessLocationFormProps = {
  location?: BusinessLocationRow
  onBack?: () => void
  onSaved?: (data: businessLocationFormData) => void
}

const LOCATION_TYPE_OPTIONS = [
  { label: 'Store', value: 'STORE' },
  { label: 'Warehouse', value: 'WAREHOUSE' },
  { label: 'Branch', value: 'BRANCH' },
  { label: 'Head Office', value: 'HEAD_OFFICE' },
]

const BUSINESS_CATEGORY_OPTIONS = [
  { label: 'Retail', value: 'RETAIL' },
  { label: 'Wholesale', value: 'WHOLESALE' },
  { label: 'Distribution', value: 'DISTRIBUTION' },
  { label: 'Manufacturing', value: 'MANUFACTURING' },
]

const GST_REGISTRATION_OPTIONS = [
  { label: 'Regular', value: 'REGULAR' },
  { label: 'Composition', value: 'COMPOSITION' },
  { label: 'SEZ', value: 'SEZ' },
]

const WAREHOUSE_OPTIONS = [
  { label: 'Central Distribution Hub (WH-01)', value: 'WH-01' },
  { label: 'West Region Depot (WH-02)', value: 'WH-02' },
  { label: 'South Transit Store (WH-03)', value: 'WH-03' },
  { label: 'North Buffer Warehouse (WH-04)', value: 'WH-04' },
]

type ToggleCardProps = {
  label: string
  checked: boolean
  onChange: (val: boolean) => void
  disabled?: boolean
}

function ToggleCard({ label, checked, onChange, disabled }: ToggleCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <label className={`flex items-center gap-2.5 ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
        <span className={`text-xs font-semibold ${checked ? 'text-slate-700' : 'text-slate-400'}`}>
          {checked ? 'Active' : 'Inactive'}
        </span>
        <div className="relative">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only peer"
          />
          <div className="h-6 w-11 rounded-full bg-slate-200 transition-colors peer-checked:bg-[#093055]" />
          <div className="absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white shadow-xs transition-transform peer-checked:translate-x-5" />
        </div>
      </label>
    </div>
  )
}

export default function BusinessLocationForm({
  location,
  onBack,
  onSaved,
}: BusinessLocationFormProps) {
  const isEditMode = !!location

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<businessLocationFormData>({
    resolver: zodResolver(businessLocationSchema),
    defaultValues: {
      locationName: '',
      locationCode: 'BL001',
      parentOrganizationUnit: '',
      locationType: '',
      businessCategory: '',
      addressLine1: '',
      addressLine2: '',
      landmark: '',
      city: '',
      state: 'Maharashtra',
      country: 'IN',
      pinCode: '',
      contactPerson: '',
      phoneNumber: '',
      email: '',
      emergencyContact: '',
      linkedGSTIN: '',
      registrationType: 'REGULAR',
      defaultBillingLocation: true,
      defaultStockLocation: false,
      allowSales: true,
      allowPurchase: true,
      allowInventory: true,
      allowDispatch: false,
      allowPOS: true,
      status: true,
      defaultWarehouse: '',
      parentWarehouse: '',
    },
  })

  useEffect(() => {
    if (!location) return

    reset({
      locationName: location.locationName ?? '',
      locationCode: location.code ?? `BL00${location.id}`,
      parentOrganizationUnit: String(location.parentOrganizationUnitId ?? ''),
      locationType: location.locationType ?? '',
      businessCategory: location.businessCategory ?? '',
      addressLine1: location.addressLine1 ?? '',
      addressLine2: location.addressLine2 ?? '',
      landmark: location.landmark ?? '',
      city: location.city ?? '',
      state: location.state ?? '',
      country: location.country ?? 'IN',
      pinCode: location.pinCode ?? '',
      contactPerson: location.contactPerson ?? '',
      phoneNumber: location.phoneNumber ?? '',
      email: location.email ?? '',
      emergencyContact: location.emergencyContact ?? '',
      linkedGSTIN: String(location.linkedGSTINId ?? ''),
      registrationType: location.registrationType ?? 'REGULAR',
      defaultBillingLocation: location.defaultBillingLocation ?? true,
      defaultStockLocation: location.defaultStockLocation ?? false,
      allowSales: location.allowSales ?? true,
      allowPurchase: location.allowPurchase ?? true,
      allowInventory: location.allowInventory ?? true,
      allowDispatch: location.allowDispatch ?? false,
      allowPOS: location.allowPOS ?? true,
      status: location.status === 'ACTIVE',
      defaultWarehouse: '',
      parentWarehouse: '',
    })
  }, [location, reset])

  const createMutation = useCreateBusinessLocation()
  const updateMutation = useUpdateBusinessLocation()
  const isSaving = createMutation.isPending || updateMutation.isPending

  const watchedCountry = useWatch({ name: 'country', control })
  const watchedLocationName = useWatch({ name: 'locationName', control })
  const watchedCode = useWatch({ name: 'locationCode', control })

  const countries = useMemo(() => {
    const list = getCountries()
    if (list && list.length > 0) return list
    return [{ name: 'India', isoCode: 'IN' }]
  }, [])

  const states = useMemo(() => {
    const list = watchedCountry ? getStates(watchedCountry) : getStates('IN')
    if (list && list.length > 0) return list
    return [
      { name: 'Maharashtra', isoCode: 'MH' },
      { name: 'Delhi', isoCode: 'DL' },
      { name: 'Karnataka', isoCode: 'KA' },
      { name: 'Tamil Nadu', isoCode: 'TN' },
      { name: 'Telangana', isoCode: 'TS' },
      { name: 'Gujarat', isoCode: 'GJ' },
      { name: 'West Bengal', isoCode: 'WB' },
      { name: 'Rajasthan', isoCode: 'RJ' },
      { name: 'Kerala', isoCode: 'KL' },
      { name: 'Punjab', isoCode: 'PB' },
      { name: 'Uttar Pradesh', isoCode: 'UP' },
    ]
  }, [watchedCountry])

  const { data: gstins = [] } = useGSTINs()
  const gstinOptions: Array<{ label: string; value: string }> = useMemo(() => {
    if (gstins && gstins.length > 0) {
      return (gstins as Array<{ id: number; gstin?: string; gstinNumber?: string }>).map((g) => ({
        label: g.gstin || g.gstinNumber || `GSTIN-${g.id}`,
        value: String(g.id),
      }))
    }
    return [
      { label: '27AABCU9603R1ZM (Maharashtra)', value: '1' },
      { label: '07AABCU9603R1ZM (Delhi)', value: '2' },
      { label: '29AABCU9603R1ZM (Karnataka)', value: '3' },
      { label: '33AABCU9603R1ZM (Tamil Nadu)', value: '4' },
      { label: '36AABCU9603R1ZM (Telangana)', value: '5' },
    ]
  }, [gstins])

  const { data: organizationUnits = [] } = useOrganizationUnits()
  const orgUnitOptions: Array<{ label: string; value: string }> = useMemo(() => {
    if (organizationUnits && organizationUnits.length > 0) {
      return (organizationUnits as Array<{ id: number; organizationUnit?: string; name?: string }>).map((u) => ({
        label: u.organizationUnit || u.name || `Unit ${u.id}`,
        value: String(u.id),
      }))
    }
    return [
      { label: 'Retail Operations Unit', value: '1' },
      { label: 'North India Regional Division', value: '2' },
      { label: 'Supply Chain & Logistics Hub', value: '3' },
      { label: 'South Hub Operations', value: '4' },
    ]
  }, [organizationUnits])

  const locationInitials = useMemo(() => {
    if (watchedCode) return watchedCode.slice(0, 3).toUpperCase()
    if (watchedLocationName) {
      const parts = watchedLocationName.trim().split(/\s+/)
      return parts.map((p) => p[0]).join('').slice(0, 3).toUpperCase()
    }
    return 'BL'
  }, [watchedCode, watchedLocationName])

  const onSave = async (data: businessLocationFormData) => {
    try {
      if (isEditMode && location) {
        await updateMutation.mutateAsync({
          id: location.id,
          data,
        })
        toast.success('Business location updated successfully')
      } else {
        await createMutation.mutateAsync(data)
        toast.success('Business location created successfully')
      }
      onSaved?.(data)
    } catch (error) {
      console.error('Business location save failed:', error)
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to save business location'
      )
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSave, (formErrors) => console.log('Validation errors:', formErrors))}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-2xs transition hover:bg-slate-50 hover:text-slate-800"
              title="Back to locations"
            >
              <ArrowLeft size={17} />
            </button>
          )}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Business Location
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Configure operational branches, stores and warehouses under each Organization Unit.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="flex h-10 items-center gap-2 rounded-xl bg-[#093055] px-6 text-sm font-semibold text-white shadow-xs transition hover:bg-[#072440] disabled:opacity-50 cursor-pointer"
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Location Summary & Right Details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN: Location Summary */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-800">
              Location Summary
            </h3>

            {/* Avatar & Initials */}
            <div className="my-3 flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#093055] text-white shadow-sm">
                <MapPin size={24} />
              </div>
              <span className="mt-2 text-xs font-bold tracking-wider text-slate-700">
                {locationInitials}
              </span>
            </div>

            {/* Location Code */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                Location Code
              </label>
              <input
                type="text"
                placeholder="BL001"
                value={watchedCode || ''}
                onChange={(e) => setValue('locationCode', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-[#043793] focus:bg-white"
              />
            </div>

            {/* Location Type */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                Location Type
              </label>
              <select
                {...register('locationType')}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#043793]"
              >
                <option value="">Select Type</option>
                {LOCATION_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Parent Org Unit */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                Parent Org Unit
              </label>
              <select
                {...register('parentOrganizationUnit')}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#043793]"
              >
                <option value="">Select Org Unit</option>
                {orgUnitOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Linked GSTIN */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                Linked GSTIN
              </label>
              <select
                {...register('linkedGSTIN')}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#043793]"
              >
                <option value="">Select GSTIN</option>
                {gstinOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Toggle Card */}
            <div className="pt-1">
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <ToggleCard
                    label="Status"
                    checked={!!field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            {/* Dates at bottom */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div>
                <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar size={13} />
                  <span>Created Date</span>
                </div>
                <div className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-600">
                  {location?.createdAt
                    ? new Date(location.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '12 Jan 2024'}
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock size={13} />
                  <span>Last Modified</span>
                </div>
                <div className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-600">
                  {location?.updatedAt
                    ? new Date(location.updatedAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '05 Jul 2026'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Business Location Details */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <h3 className="text-base font-semibold text-slate-900">
              Business Location Details
            </h3>

            {/* 1. BASIC INFORMATION */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#093055]">
                Basic Information
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Location Name */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Location Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chennai Store – T.Nagar"
                    {...register('locationName')}
                    className={`w-full rounded-xl border px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#043793] ${
                      errors.locationName ? 'border-red-500 bg-red-50/40' : 'border-slate-200 bg-white'
                    }`}
                  />
                  {errors.locationName && (
                    <p className="mt-1 text-xs text-red-500">{errors.locationName.message}</p>
                  )}
                </div>

                {/* Location Code */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Location Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BL001"
                    {...register('locationCode')}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#043793]"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">Location Code must be unique.</p>
                </div>

                {/* Parent Org Unit */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Parent Organization Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('parentOrganizationUnit')}
                    className={`w-full rounded-xl border px-3.5 py-2 text-sm text-slate-800 outline-none transition focus:border-[#043793] ${
                      errors.parentOrganizationUnit ? 'border-red-500 bg-red-50/40' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <option value="">Select Org Unit</option>
                    {orgUnitOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[11px] text-slate-400">One location belongs to only one Org Unit.</p>
                  {errors.parentOrganizationUnit && (
                    <p className="mt-1 text-xs text-red-500">{errors.parentOrganizationUnit.message}</p>
                  )}
                </div>

                {/* Location Type */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Location Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('locationType')}
                    className={`w-full rounded-xl border px-3.5 py-2 text-sm text-slate-800 outline-none transition focus:border-[#043793] ${
                      errors.locationType ? 'border-red-500 bg-red-50/40' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <option value="">Select Location Type</option>
                    {LOCATION_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Location Type cannot be changed once transactions exist.
                  </p>
                  {errors.locationType && (
                    <p className="mt-1 text-xs text-red-500">{errors.locationType.message}</p>
                  )}
                </div>

                {/* Business Category */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Business Category
                  </label>
                  <select
                    {...register('businessCategory')}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 outline-none transition focus:border-[#043793]"
                  >
                    <option value="">Select Category</option>
                    {BUSINESS_CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 2. ADDRESS INFORMATION */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#093055]">
                Address Information
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Address Line 1 */}
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Building / Plot number, Street"
                    {...register('addressLine1')}
                    className={`w-full rounded-xl border px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#043793] ${
                      errors.addressLine1 ? 'border-red-500 bg-red-50/40' : 'border-slate-200 bg-white'
                    }`}
                  />
                  {errors.addressLine1 && (
                    <p className="mt-1 text-xs text-red-500">{errors.addressLine1.message}</p>
                  )}
                </div>

                {/* Address Line 2 */}
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    placeholder="Floor, Suite, Apartment"
                    {...register('addressLine2')}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#043793]"
                  />
                </div>

                {/* Area / Landmark */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Area / Landmark
                  </label>
                  <input
                    type="text"
                    placeholder="Nearby landmark"
                    {...register('landmark')}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#043793]"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chennai"
                    {...register('city')}
                    className={`w-full rounded-xl border px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#043793] ${
                      errors.city ? 'border-red-500 bg-red-50/40' : 'border-slate-200 bg-white'
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('state')}
                    className={`w-full rounded-xl border px-3.5 py-2 text-sm text-slate-800 outline-none transition focus:border-[#043793] ${
                      errors.state ? 'border-red-500 bg-red-50/40' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s.isoCode || s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="mt-1 text-xs text-red-500">{errors.state.message}</p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('country')}
                    className={`w-full rounded-xl border px-3.5 py-2 text-sm text-slate-800 outline-none transition focus:border-[#043793] ${
                      errors.country ? 'border-red-500 bg-red-50/40' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <option value="">Select Country</option>
                    {countries.map((c) => (
                      <option key={c.isoCode} value={c.isoCode}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>
                  )}
                </div>

                {/* Pincode */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 600017"
                    {...register('pinCode')}
                    className={`w-full rounded-xl border px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#043793] ${
                      errors.pinCode ? 'border-red-500 bg-red-50/40' : 'border-slate-200 bg-white'
                    }`}
                  />
                  {errors.pinCode && (
                    <p className="mt-1 text-xs text-red-500">{errors.pinCode.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 3. CONTACT DETAILS */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#093055]">
                Contact Details
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="Full name"
                    {...register('contactPerson')}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#043793]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 00000 00000"
                    {...register('phoneNumber')}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#043793]"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-xs text-red-500">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    {...register('email')}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#043793]"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    placeholder="+91 00000 00000"
                    {...register('emergencyContact')}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#043793]"
                  />
                  {errors.emergencyContact && (
                    <p className="mt-1 text-xs text-red-500">{errors.emergencyContact.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 4. GST INFORMATION */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#093055]">
                GST Information
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Linked GSTIN <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('linkedGSTIN')}
                    className={`w-full rounded-xl border px-3.5 py-2 text-sm text-slate-800 outline-none transition focus:border-[#043793] ${
                      errors.linkedGSTIN ? 'border-red-500 bg-red-50/40' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <option value="">Select Linked GSTIN</option>
                    {gstinOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[11px] text-slate-400">Multiple locations can share one GSTIN.</p>
                  {errors.linkedGSTIN && (
                    <p className="mt-1 text-xs text-red-500">{errors.linkedGSTIN.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    GST Registration Type
                  </label>
                  <select
                    {...register('registrationType')}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 outline-none transition focus:border-[#043793]"
                  >
                    <option value="">Select Registration Type</option>
                    {GST_REGISTRATION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Default Billing Location Toggle */}
                <Controller
                  control={control}
                  name="defaultBillingLocation"
                  render={({ field }) => (
                    <ToggleCard
                      label="Default Billing Location"
                      checked={!!field.value}
                      onChange={field.onChange}
                    />
                  )}
                />

                {/* Default Stock Location Toggle */}
                <Controller
                  control={control}
                  name="defaultStockLocation"
                  render={({ field }) => (
                    <ToggleCard
                      label="Default Stock Location"
                      checked={!!field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>

            {/* 5. OPERATIONAL SETTINGS */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#093055]">
                Operational Settings
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                  control={control}
                  name="allowSales"
                  render={({ field }) => (
                    <ToggleCard
                      label="Allow Sales"
                      checked={!!field.value}
                      onChange={field.onChange}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="allowPurchase"
                  render={({ field }) => (
                    <ToggleCard
                      label="Allow Purchase"
                      checked={!!field.value}
                      onChange={field.onChange}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="allowInventory"
                  render={({ field }) => (
                    <ToggleCard
                      label="Allow Inventory"
                      checked={!!field.value}
                      onChange={field.onChange}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="allowDispatch"
                  render={({ field }) => (
                    <ToggleCard
                      label="Allow Dispatch"
                      checked={!!field.value}
                      onChange={field.onChange}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="allowPOS"
                  render={({ field }) => (
                    <ToggleCard
                      label="Allow POS"
                      checked={!!field.value}
                      onChange={field.onChange}
                    />
                  )}
                />

                {/* Empty cell to balance the POS toggle in grid */}
                <div className="hidden sm:block" />

                {/* Default Warehouse */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Default Warehouse
                  </label>
                  <select
                    {...register('defaultWarehouse')}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 outline-none transition focus:border-[#043793]"
                  >
                    <option value="">Select Default Warehouse</option>
                    {WAREHOUSE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Parent Warehouse */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Parent Warehouse
                  </label>
                  <select
                    {...register('parentWarehouse')}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 outline-none transition focus:border-[#043793]"
                  >
                    <option value="">Select Parent Warehouse</option>
                    {WAREHOUSE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 6. STATUS */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#093055]">
                Status
              </h4>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <ToggleCard
                    label="Record Status"
                    checked={!!field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            {/* 7. Business Rules Box */}
            <div className="rounded-2xl border border-blue-100 bg-[#F0F6FE] p-5">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#093055]">
                <Info size={17} className="text-[#155DFC]" />
                <span>Business Rules</span>
              </div>
              <ul className="list-disc space-y-1.5 pl-6 text-xs text-[#0F3F91]">
                <li>Business Location belongs under an Org Unit.</li>
                <li>Multiple Business Locations can map to one GSTIN.</li>
                <li>Used for POS, Inventory, Sales and Dispatch.</li>
                <li>Required before creating warehouses and POS terminals.</li>
                <li>Cannot delete location after transactions are posted.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
