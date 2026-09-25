import React from 'react'

function ReviewConfirm() {
  return (
    <div className='w-full'>
    <div className='rounded-2xl border border-slate-200 bg-white shadow-sm'>
        <div className='border-b border-slate-100 px-5 py-4'>
            <h2 className='text-sm font-semibold text-[#123B63]'>Review & Confirm</h2>
            <p className='mt-1 text-xs text-slate-500'> Review the role details and permissions before creating the role.</p>
        </div>
         {/* Content */}
        <div className="space-y-4 p-5">

          {/* =================================================
              ROLE INFORMATION
          ================================================== */}
          <div className='rounded-xl border border-slate-200 bg-white'>
            <div>
                <h3> Role Information</h3>
                <button
                type='button'
                >Edit</button>
            </div>
          </div>
          </div>
    </div>
    </div>
  )
}

export default ReviewConfirm