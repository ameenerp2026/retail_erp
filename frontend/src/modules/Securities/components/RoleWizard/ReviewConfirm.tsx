import React from 'react'
import type { RoleWizardData } from '../../pages/RoleWizard'

interface ReviewConfirmProps {
  roledata: RoleWizardData;
  setRoleData: React.Dispatch<React.SetStateAction<RoleWizardData>>;
  onNext: () => void;
  onBack: () => void;
}

function ReviewConfirm({
  roledata,
  setRoleData: _setRoleData,
  onNext,
  onBack,
}: ReviewConfirmProps) {
  return (
    <div className='w-full'>
      <div className='rounded-2xl border border-slate-200 bg-white shadow-sm'>
        <div className='border-b border-slate-100 px-5 py-4'>
          <h2 className='text-sm font-semibold text-[#123B63]'>Review & Confirm</h2>
          <p className='mt-1 text-xs text-slate-500'>
            Review the role details and permissions before creating the role.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4 p-5">

          {/* =================================================
              ROLE INFORMATION
          ================================================== */}
          <div className='rounded-xl border border-slate-200 bg-white p-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-sm font-semibold text-slate-700'>Role Information</h3>
              <button type='button' className='text-xs font-medium text-blue-600 hover:text-blue-700'>
                Edit
              </button>
            </div>

            <dl className='mt-3 space-y-1 text-xs text-slate-500'>
              <div className='flex justify-between'>
                <dt>Role Name</dt>
                <dd className='font-medium text-slate-700'>{roledata.roleName}</dd>
              </div>
              <div className='flex justify-between'>
                <dt>Access Level</dt>
                <dd className='font-medium text-slate-700'>{roledata.accessLevel}</dd>
              </div>
              <div>
                <dt>Description</dt>
                <dd className='mt-1 text-slate-600'>{roledata.description}</dd>
              </div>
            </dl>
          </div>

          {/* =================================================
              PERMISSIONS
          ================================================== */}
          <div className='rounded-xl border border-slate-200 bg-white p-4'>
            <h3 className='text-sm font-semibold text-slate-700'>
              Permissions ({roledata.permissions.length})
            </h3>
            <div className='mt-2 flex flex-wrap gap-1.5'>
              {roledata.permissions.map((id) => (
                <span
                  key={id}
                  className='rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-600'
                >
                  {id}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-200"
          >
            ← Back
          </button>

          <button
            type="button"
            onClick={onNext}
            className="rounded-lg bg-[#123B63] px-5 py-2 text-xs font-medium text-white transition hover:bg-[#0f3152]"
          >
            Create Role
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReviewConfirm