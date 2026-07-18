import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Save, Upload, Unlock } from "lucide-react"
import { useState } from 'react'
import FormInput from '../../../components/forms/FormInput'
import { organizationSchema, type OrganizationFormData } from '../../../components/forms/validate.schema'
import toast from 'react-hot-toast' // or your toast lib
import apiClient from "../../../services/apiClient";
type RecordStatus = 'DRAFT' | 'LOCKED' | 'ACTIVE'

function OrganizationGroup() {
  const [status, setStatus] = useState<RecordStatus>('DRAFT')
  const isLocked = status === 'LOCKED'
  const {
    register,
    handleSubmit,
    //watch,
    formState: { errors },
    getValues
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      shortName: '',
      financialYear: 'April-March',
      currency: '',
      companyName: '',
      cinNumber: '',
      panNumber: '',
      email: '',
      phoneNumber: '',
      website: '',
      address: '',
      state: "",
      country: '',
      pinCode: '560068'
    }
  })


  // Save Changes - runs validation
  const onSave = async (data: OrganizationFormData) => {
    try {
      const formData = new FormData()
      // Loop all fields and append
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'logo' && value instanceof FileList && value[0]) {
          formData.append('logo', value[0]) // actual file
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value)) // convert other fields to string
        }
      })
      console.log('formData',formData)
      //TODO: replace with API call
      const res =  await apiClient.post('/api/organization/org-group',data) 
       

      if (res.status !== 201) {
  throw new Error("Save failed");
}


      const result = await res.data;
      console.log('API Response:', result)

      setStatus('ACTIVE')
      toast.success('Saved successfully')

    } catch (err) {
      console.error(err)
      toast.error('Failed to save')
    }
  }

  // Lock Record - no validation
  const handleLock = () => {
    const data = getValues()
    console.log('Locking without validation:', data)
    // Optional minimal check
    if (!data.companyName) {
      toast.error('Company Name required to lock')
      return
    }
    // TODO: replace with API call
    // await fetch('/api/company/lock', { method: 'POST', body: JSON.stringify(data) })
    setStatus('LOCKED')
    toast.success('Record locked. Click Unlock to edit.')
  }
  // Unlock Record
  const handleUnlock = () => {
    console.log('Unlocking record')
    // TODO: replace with API call later
    // await fetch('/api/company/unlock', { method: 'POST' })
    setStatus('DRAFT')
    toast.success('Unlocked - you can edit now')
  }
 // const logoFiles = watch('logo')
  //const fileName = logoFiles?.[0]?.name

  return (
    <form onSubmit={handleSubmit(onSave, (errors) => {
      console.log(errors);
    })} className="page-shell">
      <div className="page-header">
        <div>
          <h2 className="page-title">
            Org Group — Company Master
          </h2>
          <p className="page-subtitle">Core company identity and registration details</p>
        </div>
        <div className="page-actions">
          {isLocked ? (
            <button
              type='button'
              onClick={handleUnlock}
              className="flex items-center gap-2 rounded-xl border border-amber-600 bg-amber-500 px-4 py-2.5 text-sm font-medium text-white"
            >
              <Unlock size={14} /> <span>Unlock Record</span>
            </button>
          ) : (
            <button
              type='button'
              onClick={handleLock}
              className="flex h-10 items-center gap-1.5 rounded-lg border border-gray-300 bg-[linear-gradient(#F3F4F6,#E5E7EB)] px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-300 sm:px-4"
            >
              <Lock size={14} /> <span className="hidden sm:inline">Lock Record</span>
            </button>
          )}

          <button
            type='submit'
            disabled={isLocked}
            className="flex h-10 items-center gap-2 rounded-xl bg-[linear-gradient(#093055,#043793)] px-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 sm:px-4"
          >
            <Save size={14} /><span>Save Changes</span>
          </button>
        </div>
      </div>
      <fieldset disabled={isLocked} className="space-y-4 disabled:opacity-60 sm:space-y-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-4">
            <div className="section-card h-full">
              <h4 className="section-title text-[#043793]">Company Identity</h4>
              <div className="flex items-center justify-center my-4">
                <div className="flex justify-center items-center bg-[linear-gradient(#043793,#093055)] w-25 h-25 rounded-2xl">
                  <p className="flex text-center text-[#FFFFFF]">RS</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg"
                    //{...register('logo')}
                  />
                  <div className="flex justify-center items-center gap-2 bg-[#F1F5F9] w-30 h-10 rounded-2xl hover:bg-[#E2E8F0]">
                    <Upload size={14} />
                    <span>Upload</span>
                  </div>
                </label>

                {/* {fileName && (
                  <span className="text-sm text-gray-600 truncate max-w-[200px]">
                    {fileName}
                  </span>
                )} */}
              </div>
              <FormInput
                label='Short Name'
                required
                placeholder='short name'
                {...register('shortName')}
                error={errors.shortName?.message}
              />
              <FormInput
                label='Financial Year'
                readOnly
                {...register('financialYear')}
                error={errors.financialYear?.message}
              />
              <FormInput
                label="Base Currency"
                type='select'
                required
                options={[
                  { label: "INR - Indian Rupee", value: "INR" },
                  { label: "USD - US Dollar", value: "USD" },
                  { label: "EUR - Euro", value: "EUR" },
                  { label: "GBP - British Pound", value: "GBP" },
                  { label: "AED - UAE Dirham", value: "AED" }
                ]}
                {...register('currency')}
                error={errors.currency?.message}
              />
            </div>
          </div>
          <div className="lg:col-span-8">
            <div className="section-card h-full">
              <div className="flex flex-col gap-3">
                <p className="section-title text-[#043793]">Company Details</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput
                    label='Company Name'
                    required
                    placeholder='company name'
                    {...register('companyName')}
                    error={errors.companyName?.message}
                  />
                  <FormInput
                    label='CIN Number'
                    required
                    placeholder='L12345AB2024PTC123456'
                    {...register('cinNumber')}
                    error={errors.cinNumber?.message}
                  />

                  <FormInput
                    label='PAN Number'
                    required
                    placeholder='ABCDE1234F'
                    {...register('panNumber')}
                    error={errors.panNumber?.message}
                  />
                  <FormInput
                    label='Email Address'
                    type="email"
                    required
                    placeholder='email'
                    {...register('email')}
                    error={errors.email?.message}
                  />
                  <FormInput
                    label='Phone Number'
                    required
                    placeholder='Phone Number'
                    {...register('phoneNumber')}
                    error={errors.phoneNumber?.message}
                  />
                  <FormInput
                    label='Website'
                    placeholder='https://example.com'
                    required
                    {...register('website')}
                    error={errors.website?.message}
                  />
                </div>
                <div className="grid grid-cols-1">
                  <FormInput
                    label='Registered Address'
                    type="textarea"
                    required
                    placeholder='Enter Address'
                    {...register('address')}
                    error={errors.address?.message}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput
                    label="State"
                    type='select'
                    required
                    options={[
                      { label: "Karnataka", value: "KA" },
                      { label: "Maharashtra", value: "MH" },
                      { label: "Delhi", value: "DL" }
                    ]}
                    {...register('state')}
                    error={errors.state?.message}
                  />
                  <FormInput
                    label="Country"
                    type='select'
                    required
                    options={[
                      { label: "India", value: "IN" },
                      { label: "USA", value: "US" },
                      { label: "UAE", value: "AE" }
                    ]}
                    {...register('country')}
                    error={errors.country?.message}
                  />
                  <FormInput
                    label='Pin Code'
                    required
                    {...register('pinCode')}
                    error={errors.pinCode?.message}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </fieldset>
    </form>
    
  )
}

export default OrganizationGroup