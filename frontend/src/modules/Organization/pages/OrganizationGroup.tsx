import { useState } from "react";
import  {
 Lock,
 Save,
 Upload
} from "lucide-react";

import FormInput from '../../../components/forms/FormInput'

 const initialForm={
        shortName :'',
        financialYear :'April-March',
        currency :'',
        componyName:'',
        cinNumber:'',
        panNumber:'',
        email:'',
        phoneNumber:'',
        website:'',
        address:'',
        state:"",
        country:'',
        pinCode:'560068'
    }

function OrganizationGroup() {
   
const [formData, setFormData ]= useState(initialForm)


const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  console.log(e.target.name, e.target.value);
  const {name, value} = e.target
  setFormData((prev)=>({
    ...prev,
    [name]:value
  }))

  console.log('setFormData',formData)
};

// const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     console.log("Submitted data:", formData);

//     // API call here

//     setFormData(initialForm); // clear form after submit
//   };



  return (
    <div className='bg-[#F1F5F9] p-6' >
        

        <div className="flex items-start justify-between">
            <div>
                <h2 className="text-[24px] text-[#043793]">
                    Org Group — Company Master
                </h2>
                <p className="text-[13px] text-[#94A3B8]">Core company identity and registration details</p>
            </div>
            <div className="flex gap-3">
                <button type='button' className="flex items-center bg-[#E2E8F0]
                 rounded-2xl border border-[#F1F5F9] text-[14px] text-[#64748B] gap-2 px-3 py-4 width-120 height-50" ><Lock size={14} /> <span>Lock Record </span></button>
                 <button type='button' className="flex items-center text-[14px] text-[#FFFFFF] gap-2 width-120 height-50 bg-[linear-gradient(#043793,#093055)] rounded-2xl border border-[#043793] px-3 py-4"> <Save size={14} /><span>Save Changes </span> </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3">

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h4 className="text-[15px] text-[#043793] font-bold">Company Identity</h4>
                        <div className="flex items-center justify-center my-4">
                            <div className=" flex justify-center items-center bg-[linear-gradient(#043793,#093055)] w-25 h-25 rounded-2xl">
                             <p className="flex text-center text-[#FFFFFF] ">RS</p>
                        </div>
                       
                        </div>
                        
               
               <div className="flex items-center justify-center">
                    <button type='button' className=" flex justify-center items-center gap-2 bg-[#F1F5F9] w-30 h-10  rounded-2xl"><Upload size={14}/> <span>Upload</span></button>
               </div>
               
                        
                
                
               < FormInput
               label='Short Name'
               name='shortName'
               value={formData.shortName}
               type = "text"
               required 
               placeholder='short name'
               onChange={handleChange}
               />

                < FormInput
               label='Financial Year'
               name='financialYear'
               value={formData.financialYear}
               type = "text"
               readOnly
               onChange={handleChange}
               />
                
                <FormInput
  label="Base Currency"
  name='currency'
  value={formData.currency}
  type='select'
  options={[  { label: "INR - Indian Rupee", value: "INR" },
    { label: "USD - US Dollar", value: "USD" },
    { label: "EUR - Euro", value: "EUR" },
    { label: "GBP - British Pound", value: "GBP" },
    { label: "AED - UAE Dirham", value: "AED" },]}
  placeholder='Select currency'
  onChange={handleChange}
/>
                </div>
            </div>
<div className="lg:col-span-9">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                     <div className="flex flex-col gap-3">

             
                        <p className="text-[#043793] text-[15px] font-bold">Company Details</p>
  
  <div className="grid grid-cols-2 gap-6">
   

               < FormInput
               label='Compony Name'
               name='componyName'
               value={formData.componyName}
               type = "text"
               required 
               placeholder='compony name'
               onChange={handleChange}
               />
                 < FormInput
               label='CIN Number'
               name='cinNumber'
               value={formData.cinNumber}
               type = "text"
               required 
               placeholder='short name'
               onChange={handleChange}
               />

               < FormInput
               label='PAN Number'
               name='panNumber'
               value={formData.panNumber}
               type = "text"
               required 
               placeholder='PAN Number'
               onChange={handleChange}
               />
                 < FormInput
               label='Email'
               name='email'
               value={formData.email}
               type = "email"
               required 
               placeholder='email'
               onChange={handleChange}
               />
               < FormInput
               label='Phone Number'
               name='phoneNumber'
               value={formData.phoneNumber}
               type = "text"
               required 
               placeholder='Phone Number'
               onChange={handleChange}
               />
               < FormInput
               label='Website'
               name='website'
               value={formData.website}
               type = "text"
               required 
               placeholder='Website'
               onChange={handleChange}
               />
               </div>
               <div className="grid grid-cols-1">
                < FormInput
               label='Registered Address'
               name='address'
               value={formData.address}
               type = "textarea"
               required 
               placeholder='Enter Address'
               onChange={handleChange}
               />
               </div>

               <div className="grid grid-cols-2 gap-6">

  <FormInput
  label="State"
  name='state'
  value={formData.state}
  type='select'
  options={[  { label: "INR - Indian Rupee", value: "INR" },
    { label: "USD - US Dollar", value: "USD" },
    { label: "EUR - Euro", value: "EUR" },
    { label: "GBP - British Pound", value: "GBP" },
    { label: "AED - UAE Dirham", value: "AED" },]}
  placeholder='Select currency'
  onChange={handleChange}
/>
  <FormInput
  label="Country"
  name='country'
  value={formData.country}
  type='select'
  options={[  { label: "INR - Indian Rupee", value: "INR" },
    { label: "USD - US Dollar", value: "USD" },
    { label: "EUR - Euro", value: "EUR" },
    { label: "GBP - British Pound", value: "GBP" },
    { label: "AED - UAE Dirham", value: "AED" },]}
  placeholder='Select currency'
  onChange={handleChange}
/>

        < FormInput
               label='Pin Code'
               name='pinCode'
               value={formData.pinCode}
               type = "text"
               required 
             readOnly
               onChange={handleChange}
               />        
  </div>

 
                     </div>
                </div>
</div>

        </div>
    </div>
  )
}

export default OrganizationGroup