import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Save, MapPin, ArrowLeft, Info } from 'lucide-react'
import FormInput from '../../../../components/forms/FormInput'
import {
  businessLocationSchema,
  type businessLocationFormData,
} from '../../../../components/forms/validate.schema'
import { useOrganizationUnits } from '../../../../hooks/admin/organization/useOrganizationUnits'
import { getCountries, getStates, getCities } from '@/services/location.service'

type BusinessLocationFormProps = {
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

const GSTIN_OPTIONS = [
  { label: '27AAAAA0000A1Z5', value: '27AAAAA0000A1Z5' },
  { label: '29BBBBB1111B1Z4', value: '29BBBBB1111B1Z4' },
  { label: '07CCCCC2222C1Z3', value: '07CCCCC2222C1Z3' },
]

const GST_REGISTRATION_OPTIONS = [
  { label: 'Regular', value: 'REGULAR' },
  { label: 'Composition', value: 'COMPOSITION' },
  { label: 'SEZ', value: 'SEZ' },
]

const WAREHOUSE_OPTIONS = [
  { label: 'Main Warehouse', value: 'WH-MAIN' },
  { label: 'Secondary Warehouse', value: 'WH-SEC' },
  { label: 'Transit Warehouse', value: 'WH-TRANSIT' },
]

function BusinessLocationForm({ onBack, onSaved }: BusinessLocationFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<businessLocationFormData>({
    resolver: zodResolver(businessLocationSchema),
    defaultValues: {
      locationName: '',
      //locationCode: '',
      parentOrganizationUnit: '',
      locationType: '',
      businessCategory: '',
      addressLine1: '',
      addressLine2: '',
      landmark: '',
      city: '',
      state: '',
      country: '',
      pinCode: '',
      contactPerson: '',
      phoneNumber: '',
      email: '',
      emergencyContact: '',
      linkedGSTIN: '',
      registrationType: '',
      defaultBillingLocation: false,
      defaultStockLocation: false,
      allowSales: false,
      allowInventory: false,
      allowPOS: false,
      allowPurchase: false,
      allowDispatch: false,
      status: true,
      defaultWarehouse: '',
      parentWarehouse: '',
    },
  })

  const country = watch('country')
  const state = watch('state')
 // const locationCode = watch('locationCode')

  const countries = getCountries()
  const states = country ? getStates(country) : []
  const cities = country && state ? getCities(country, state) : []

  const { data: organizationUnits = [] } = useOrganizationUnits()

  const orgUnitOptions = organizationUnits.map((unit: { id: number; organizationUnit: string }) => ({
    label: unit.organizationUnit,
    value: String(unit.id),
  }))

  const onSave = async (data: businessLocationFormData) => {
    try {
      console.log('businessLocationFormData', data)
      toast.success('Business location saved')
      onSaved?.(data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to save')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSave, (formErrors) => console.log(formErrors))}
      className="page-shell"
    >
      {/* Header */}
      <div className="page-header">
        <div className="flex items-start gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50"
              title="Back to list"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <div>
            <h2 className="page-title">Business Location</h2>
            <p className="page-subtitle">
              Configure operational branches, stores and warehouses under each Organization Unit.
            </p>
          </div>
        </div>
        <div className="page-actions">
          <button
            type="submit"
            className="flex h-10 items-center gap-2 rounded-xl bg-[linear-gradient(#093055,#043793)] px-4 text-sm font-medium text-white transition hover:opacity-95"
          >
            <Save size={16} />
            <span>Save</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
        {/* LEFT: Location Summary */}
        <div className="lg:col-span-3">
          <div className="section-card h-full">
            <h4 className="section-title text-[#043793]">Location Summary</h4>

            {/* <div className="my-5 flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[linear-gradient(#093055,#043793)] text-white">
                <MapPin size={26} />
              </div>
              <span className="mt-2 text-sm font-semibold text-[#043793]">
                {locationCode || 'BL'}
              </span>
            </div> */}
{/* 
          //  <FormInput label="Location Code" readOnly {...register('locationCode')} /> */}

            <FormInput
              label="Location Type"
              type="select"
              options={LOCATION_TYPE_OPTIONS}
              {...register('locationType')}
            />

            <FormInput
              label="Parent Org Unit"
              type="select"
              options={orgUnitOptions}
              {...register('parentOrganizationUnit')}
            />

            <FormInput
              label="Linked GSTIN"
              type="select"
              options={GSTIN_OPTIONS}
              {...register('linkedGSTIN')}
            />

            <div className="mt-3">
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <FormInput
                    label="Status"
                    type="toggle"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* RIGHT: Business Location Details */}
        <div className="lg:col-span-9">
          <div className="section-card h-full">
            <p className="mb-4 text-base font-semibold text-[#043793]">
              Business Location Details
            </p>

            {/* BASIC INFORMATION */}
            <p className="section-title mb-3 uppercase tracking-wide text-[#043793]">
              Basic Information
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Location Name"
                required
                placeholder="e.g. Chennai Store – T.Nagar"
                {...register('locationName')}
                error={errors.locationName?.message}
              />
              {/* <FormInput
                label="Location Code"
                required
                placeholder="e.g. BL001"
                hint="Location Code must be unique."
                {...register('locationCode')}
                error={errors.locationCode?.message}
              /> */}
              <FormInput
                label="Parent Organization Unit"
                type="select"
                required
                options={orgUnitOptions}
                hint="One location belongs to only one Org Unit."
                {...register('parentOrganizationUnit')}
                error={errors.parentOrganizationUnit?.message}
              />
              <FormInput
                label="Location Type"
                type="select"
                required
                options={LOCATION_TYPE_OPTIONS}
                hint="Location Type cannot be changed once transactions exist."
                {...register('locationType')}
                error={errors.locationType?.message}
              />
              <FormInput
                label="Business Category"
                type="select"
                options={BUSINESS_CATEGORY_OPTIONS}
                {...register('businessCategory')}
                error={errors.businessCategory?.message}
              />
            </div>

            {/* ADDRESS INFORMATION */}
            <p className="section-title mb-3 mt-6 uppercase tracking-wide text-[#043793]">
              Address Information
            </p>
            <div className="grid grid-cols-1 gap-4">
              <FormInput
                label="Address Line 1"
                required
                placeholder="Building / Plot number, Street"
                {...register('addressLine1')}
                error={errors.addressLine1?.message}
              />
              <FormInput
                label="Address Line 2"
                placeholder="Floor, Suite, Apartment"
                {...register('addressLine2')}
                error={errors.addressLine2?.message}
              />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Area / Landmark"
                placeholder="Nearby landmark"
                {...register('landmark')}
                error={errors.landmark?.message}
              />
              <FormInput
                label="City"
                type="select"
                required
                options={cities.map((c) => ({ label: c.name, value: c.name }))}
                {...register('city')}
                error={errors.city?.message}
              />
              <FormInput
                label="State"
                type="select"
                required
                options={states.map((s) => ({ label: s.name, value: s.isoCode }))}
                {...register('state')}
                error={errors.state?.message}
              />
              <FormInput
                label="Country"
                type="select"
                required
                options={countries.map((c) => ({ label: c.name, value: c.isoCode }))}
                {...register('country')}
                error={errors.country?.message}
              />
              <FormInput
                label="Pincode"
                required
                placeholder="e.g. 600017"
                {...register('pinCode')}
                error={errors.pinCode?.message}
              />
            </div>

            {/* CONTACT DETAILS */}
            <p className="section-title mb-3 mt-6 uppercase tracking-wide text-[#043793]">
              Contact Details
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Contact Person"
                placeholder="Full name"
                {...register('contactPerson')}
                error={errors.contactPerson?.message}
              />
              <FormInput
                label="Phone Number"
                placeholder="+91 00000 00000"
                {...register('phoneNumber')}
                error={errors.phoneNumber?.message}
              />
              <FormInput
                label="Email"
                placeholder="email@example.com"
                {...register('email')}
                error={errors.email?.message}
              />
              <FormInput
                label="Emergency Contact"
                placeholder="+91 00000 00000"
                {...register('emergencyContact')}
                error={errors.emergencyContact?.message}
              />
            </div>

            {/* GST INFORMATION */}
            <p className="section-title mb-3 mt-6 uppercase tracking-wide text-[#043793]">
              GST Information
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Linked GSTIN"
                type="select"
                required
                options={GSTIN_OPTIONS}
                hint="Multiple locations can share one GSTIN."
                {...register('linkedGSTIN')}
                error={errors.linkedGSTIN?.message}
              />
              <FormInput
                label="GST Registration Type"
                type="select"
                options={GST_REGISTRATION_OPTIONS}
                {...register('registrationType')}
                error={errors.registrationType?.message}
              />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 px-4 py-3">
                <Controller
                  control={control}
                  name="defaultBillingLocation"
                  render={({ field }) => (
                    <FormInput
                      label="Default Billing Location"
                      type="toggle"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="rounded-xl border border-gray-200 px-4 py-3">
                <Controller
                  control={control}
                  name="defaultStockLocation"
                  render={({ field }) => (
                    <FormInput
                      label="Default Stock Location"
                      type="toggle"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>

            {/* OPERATIONAL SETTINGS */}
            <p className="section-title mb-3 mt-6 uppercase tracking-wide text-[#043793]">
              Operational Settings
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 px-4 py-3">
                <Controller
                  control={control}
                  name="allowSales"
                  render={({ field }) => (
                    <FormInput
                      label="Allow Sales"
                      type="toggle"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="rounded-xl border border-gray-200 px-4 py-3">
                <Controller
                  control={control}
                  name="allowPurchase"
                  render={({ field }) => (
                    <FormInput
                      label="Allow Purchase"
                      type="toggle"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="rounded-xl border border-gray-200 px-4 py-3">
                <Controller
                  control={control}
                  name="allowInventory"
                  render={({ field }) => (
                    <FormInput
                      label="Allow Inventory"
                      type="toggle"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="rounded-xl border border-gray-200 px-4 py-3">
                <Controller
                  control={control}
                  name="allowDispatch"
                  render={({ field }) => (
                    <FormInput
                      label="Allow Dispatch"
                      type="toggle"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="rounded-xl border border-gray-200 px-4 py-3">
                <Controller
                  control={control}
                  name="allowPOS"
                  render={({ field }) => (
                    <FormInput
                      label="Allow POS"
                      type="toggle"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Default Warehouse"
                type="select"
                options={WAREHOUSE_OPTIONS}
                {...register('defaultWarehouse')}
                error={errors.defaultWarehouse?.message}
              />
              <FormInput
                label="Parent Warehouse"
                type="select"
                options={WAREHOUSE_OPTIONS}
                {...register('parentWarehouse')}
                error={errors.parentWarehouse?.message}
              />
            </div>

            {/* STATUS */}
            <p className="section-title mb-3 mt-6 uppercase tracking-wide text-[#043793]">
              Status
            </p>
            <div className="rounded-xl border border-gray-200 px-4 py-3">
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <FormInput
                    label="Record Status"
                    type="toggle"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            {/* Business Rules */}
            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#043793]">
                <Info size={16} />
                Business Rules
              </div>
              <ul className="list-disc space-y-1 pl-6 text-xs text-[#0F3F91]">
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

export default BusinessLocationForm
