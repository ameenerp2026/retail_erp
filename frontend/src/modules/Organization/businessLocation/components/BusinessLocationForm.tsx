import { useForm, Controller  } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import toast from 'react-hot-toast' 
import FormInput from '../../../../components/forms/FormInput'
import { Save} from "lucide-react"
import { businessLocationSchema, type businessLocationFormData } from '../../../../components/forms/validate.schema'
import { useOrganizationUnits }  from '../../../../hooks/useOrganizationUnits'
import {
  getCountries,
  getStates,
  getCities,
} from "@/services/location.service";




function BusinessLocation (){



  
  const {
    register,
    control,
   handleSubmit,
    watch,
   formState: { errors },
    getValues
  } = useForm<businessLocationFormData>({
    resolver: zodResolver(businessLocationSchema),
    defaultValues: {
      locationName: '',
      locationCode: '',
      parentOrganizationUnit: '',
      locationType: '',
      businessCategory: '',
      addressLine1: '',
      addressLine2:'',
      landmark:'',
      city:'',
      email: '',
      phoneNumber: '',
      emergencyContact: '',
      linkedGSTIN: '',
      registrationType: "",
      country: '',
      pinCode: '',
      defaultBillingLocation:false,
      defaultStockLocation:false,
      allowSales:false,
      allowInventory:false,
      allowPOS:false,
      allowPurchase:false,
       allowDispatch:false,
       status:false,
       defaultWarehouse:'',
       parentWarehouse:''
    }
  })
const country = watch("country");
const state = watch("state");

const countries = getCountries();
const states = country ? getStates(country) : [];
const cities = country && state ? getCities(country, state) : [];
const {
  data: organizationUnits = [],
} = useOrganizationUnits();
 const onSave = async (data: businessLocationFormData) => {
    try { 
      console.log('businessLocationFormData',data)
    }
    catch (err) {
      console.error(err)
      toast.error('Failed to save')
    }
 }
return(
    <form onSubmit={handleSubmit(onSave, (errors) => {
      console.log(errors);
    })} className="page-shell">
          <div className="page-header">
        <div>
          <h2 className="page-title">
           Business Location
          </h2>
          <p className="page-subtitle">Configure operational branches, stores and warehouses under each Organization Unit.</p>
        </div>
        <div className="page-actions">
          

          <button
            type='submit'
            className="flex h-10 items-center gap-2 rounded-xl bg-[linear-gradient(#093055,#043793)] px-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 sm:px-4"
          >
            <Save size={14} /><span>Save </span>
          </button>
        </div>
      </div>
      <fieldset className="space-y-4 disabled:opacity-60 sm:space-y-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-2">
                    <div className="section-card h-full">
              <h4 className="section-title text-[#043793]">Location Summary</h4>
              {/* <div className="flex items-center justify-center my-4"> */}
                <FormInput
                    label='Location Code'
                    required
                   // placeholder='company name'
                    ///{...register('companyName')}
                   // error={errors.companyName?.message}
                  />
                  <FormInput
                    label='Location Type'
                    required
                //  placeholder='L12345AB2024PTC123456'
                  //  {...register('cinNumber')}
                    //error={errors.cinNumber?.message}
                  />
              
              <FormInput
                    label='Parent Org Unit'
                    required
                  //  placeholder='L12345AB2024PTC123456'
                  //  {...register('cinNumber')}
                    //error={errors.cinNumber?.message}
                  />
                  <FormInput
                    label='Linked GSTIN'
                     required
                    //placeholder='L12345AB2024PTC123456'
                  //  {...register('cinNumber')}
                    //error={errors.cinNumber?.message}
                  />
                 < FormInput
                    label='Created Date'
                    required
                  // placeholder='L12345AB2024PTC123456'
                  //  {...register('cinNumber')}
                    //error={errors.cinNumber?.message}
                  />
                  <FormInput
                    label='Last Modified'
                    required
                    //placeholder='L12345AB2024PTC123456'
                  //  {...register('cinNumber')}
                    //error={errors.cinNumber?.message}
                  />
            {/* //  </div> */}
            </div>
            </div>
               <div className="lg:col-span-10">
                 <div className="section-card h-full">
              <div >
                <p className="section-title text-[#043793]">Business Location Details</p>
               
                <p className="section-title text-[#043793]">Basic Information</p>
                 {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                     <div className="flex flex-col gap-3"> */}
                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput
                    label='Location Name'
                    required
                    placeholder='Location Name'
                    {...register('locationName')}
                    error={errors.locationName?.message}
                  />
                     <FormInput
                    label='Location Code'
                    required
                    placeholder='Location Code'
                    {...register('locationCode')}
                    error={errors.locationCode?.message}
                  />
                   <FormInput
                    label="Parent organization unit"
                    type='select'
                    required
                     options={organizationUnits.map((unit: any) => ({
    label: unit.organizationUnit,
    value: String(unit.id),
  }))}
                    {...register('parentOrganizationUnit')}
                    error={errors.parentOrganizationUnit?.message}
                  />
                    <FormInput
                    label="Location Type"
                    type='select'
                    required
                    options={[
                      { label: "India", value: "IN" },
                      { label: "USA", value: "US" },
                      { label: "UAE", value: "AE" }
                    ]}
                    {...register('locationType')}
                    error={errors.locationType?.message}
                  />
                  <FormInput
                    label="Business Category"
                    type='select'
                    required
                    options={[
                      { label: "India", value: "IN" },
                      { label: "USA", value: "US" },
                      { label: "UAE", value: "AE" }
                    ]}
                    {...register('businessCategory')}
                    error={errors.businessCategory?.message}
                  />

                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 mt-4">
                      <p className="section-title text-[#043793]">Address Information</p>
                      <FormInput
                    label=' Address Line 1'
                    type="textarea"
                    required
                    placeholder='Enter Address'
                    {...register('addressLine1')}
                    error={errors.addressLine1?.message}
                  />
                  <FormInput
                    label=' Address Line 2'
                    type="textarea"
                    required
                    placeholder='Enter Address'
                    {...register('addressLine2')}
                    error={errors.addressLine2?.message}
                  />
                      
                  </div>



                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput
                    label='Area/Landmark'
                    required
                    placeholder='Landmark'
                    {...register('landmark')}
                    error={errors.landmark?.message}
                  />
                   <FormInput
                    label="Country"
                    type='select'
                    required
                      options={countries.map(c => ({
                      label: c.name,
                      value: c.isoCode,
                                  }))}
                     {...register('country')}
                    error={errors.country?.message}
                  />
                   <FormInput
                    label="State"
                    type='select'
                    required
                    options={states.map(s => ({
                    label: s.name,
                    value: s.isoCode,
                    }))}
                    {...register('state')}
                    error={errors.state?.message}
                  />
                     <FormInput
                    label='City'
                      type='select'
                    required
                    placeholder='City'
                      options={cities.map(c => ({
                      label: c.name,
                           value: c.name,
  }))}
                    {...register('city')}
                    error={errors.city?.message}
                  />
                  
                   
                  <FormInput
                    label='Pincode'
                    required
                    placeholder='Pincode'
                    {...register('pinCode')}
                    error={errors.pinCode?.message}
                  />
                    </div>


{/* Contact Information */}
                           <p className="section-title text-[#043793] mt-4">Contact Information</p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
                    
                      <FormInput
                    label='Contact Person'
                    required
                    placeholder='Full Name'
                    {...register('contactPerson')}
                    error={errors.contactPerson?.message}
                  />
                  <FormInput
                    label='Phone Number'
                    required
                    placeholder='+91 00000 00000'
                    {...register('phoneNumber')}
                    error={errors.phoneNumber?.message}
                  />
                    <FormInput
                    label='Email'
                    required
                    placeholder='email@example.com'
                    {...register('email')}
                    error={errors.email?.message}
                  />
                  <FormInput
                    label='Emergency Contact'
                    required
                    placeholder='+91 00000 00000'
                    {...register('emergencyContact')}
                    error={errors.emergencyContact?.message}
                  />
                      
                  </div>


                  {/* GST Information */}
                           <p className="section-title text-[#043793] mt-4">GST Information</p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
                      <FormInput
                    label="Linked GSTIN"
                    type='select'
                    required
                    options={[
                      { label: "India", value: "IN" },
                      { label: "USA", value: "US" },
                      { label: "UAE", value: "AE" }
                    ]}
                    {...register('linkedGSTIN')}
                    error={errors.linkedGSTIN?.message}
                  />
                  <FormInput
                    label="GST Registration Type"
                    type='select'
                    required
                    options={[
                      { label: "India", value: "IN" },
                      { label: "USA", value: "US" },
                      { label: "UAE", value: "AE" }
                    ]}
                    {...register('registrationType')}
                    error={errors.registrationType?.message}
                  />

                     {/* <FormInput
                    label='Contact Person'
                    required
                    placeholder='Full Name'
                    {...register('contactPerson')}
                    error={errors.contactPerson?.message}
                  /> */}

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

{/* Opertaional Settings */}


                  <p className="section-title text-[#043793] mt-4">Operational Settings</p>
 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
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

 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
                   <FormInput
                    label="Default Warehouse"
                    type='select'
                    required
                    options={[
                      { label: "India", value: "IN" },
                      { label: "USA", value: "US" },
                      { label: "UAE", value: "AE" }
                    ]}
                    {...register('defaultWarehouse')}
                    error={errors.defaultWarehouse?.message}
                  />

                  <FormInput
                    label="Parent Warehouse"
                    type='select'
                    required
                    options={[
                      { label: "India", value: "IN" },
                      { label: "USA", value: "US" },
                      { label: "UAE", value: "AE" }
                    ]}
                    {...register('parentWarehouse')}
                    error={errors.parentWarehouse?.message}
                  />


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
                {/* </div>
                </div> */}
                </div>
                </div>
               </div>
        </div>
        </fieldset>
    </form>
)
}
export default  BusinessLocation