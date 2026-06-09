type Options={
  label:string;
  value:string
}
type FormInputProps={
    label:string;
    name:string;
    value : string;
    type?: "text" | "email" | "password" | "date" | "textarea" | "select";
    required?: boolean;
    readOnly?: boolean;
    options?: Options[] ;
   placeholder?: string;
    onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

function FormInput({ label,
  name,
  value,
  type = "text",
  required,
  readOnly,
  options = [],
  placeholder,
  onChange,} : FormInputProps) {
     const baseClass =
    "w-full h-[50px] rounded-[14px] border border-slate-200 bg-white px-4 text-[15px] text-slate-700 outline-none focus:border-[#043793]";
  
  const labelClass="text-[12px] text-[#94A3B8] font-semiBold block my-3"
    return (
    
    <div className="space-y-2">

          <label className={labelClass}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === 'textarea' ?(
        <textarea  name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={baseClass}></textarea>
      ) : type === 'select'? (
        <>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={baseClass}
        >
        <option 
        value=''>
          Select
        </option>
        {options.map((option)=>{
          return(
          <option
          key={option.value}
          value={option.value}
          >
            {option.value}
          </option>
          )
        })}

        </select>
</>
      ):
      <input 
      type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
           readOnly={readOnly}
          className={baseClass}

        />
    }
      
    </div>
  
    
  )
}

export default FormInput