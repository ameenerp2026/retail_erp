import  {
 Lock
} from "lucide-react";




function OrganizationGroup() {
  return (
    <div className='bg-[#F1F5F9] p-6' >
        

        <div className="flex items-start justify-between">
            <div>
                <h2 className="text-[24px] text-[#043793]">
                    Org Group — Company Master
                </h2>
                <p className="text-[13px] text-[#94A3B8]">Core company identity and registration details</p>
            </div>
            <div>
                <button type='button' className="flex items-center bg-[#F1F5F9] rounded-xl"><Lock size={14} /> <span>Lock Record </span></button>
                 <button type='button'>Save Changes  </button>
            </div>
        </div>
    </div>
  )
}

export default OrganizationGroup