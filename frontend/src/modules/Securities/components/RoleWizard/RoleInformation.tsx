import React from 'react'
import type {AccessLevel, RoleWizardData} from '../../pages/RoleWizard'
import { UserRound, Users,Shield, Crown,Info, ArrowLeft, ArrowRight } from 'lucide-react';
import type { OrganizationGroupOption, RoleScope } from '@/services/admin/securities/role.service'


const accessLevels = [
  {
    id: "STANDARD" as AccessLevel,
    title: "Standard",
    description: "Basic access to assigned modules",
    icon: UserRound,
  },
  {
    id: "MANAGER" as AccessLevel,
    title: "Manager",
    description: "Can manage team and modules",
    icon: Users,
  },
  {
    id: "ADMIN" as AccessLevel,
    title: "Admin",
    description: "Administrative access",
    icon: Shield,
  },
  {
    id: "SUPER_ADMIN" as AccessLevel,
    title: "Super Admin",
    description: "Full system access",
    icon: Crown,
  },
];

interface Props{
    roledata: RoleWizardData;
    setRoleData:React.Dispatch<React.SetStateAction<RoleWizardData>>;
    onNext: ()=> void;
    onCancel: () => void;
    organizationGroups: OrganizationGroupOption[];
    groupsLoading: boolean;
    groupsError?: string;
}
function RoleInformation({
   roledata,
   setRoleData,
   onNext,
   onCancel,
   organizationGroups,
   groupsLoading,
   groupsError,

}:Props) {

  const isValid = roledata.roleName.trim().length  > 0;
  const canContinue =
    isValid &&
    roledata.organizationGroupId > 0 &&
    organizationGroups.some((group) => group.id === roledata.organizationGroupId) &&
    organizationGroups.length > 0 &&
    !groupsLoading &&
    !groupsError

  const updateField =<K extends keyof RoleWizardData>(
    field:K,
    value: RoleWizardData[K]
  )=>{
    setRoleData((prev)=>({
      ...prev,
      [field]:value

    }))
  }
  return (
    <div className='bg-white p-6 shadow-sm max-auto max-w-2xl rounded-2xl border border-slate-200'>
        <h2 className='text-lg font-semibold text-[#043793]'>Role Information</h2>

        <div className='mt-5'>
            <label className='mb-2 block text-sm font-medium text-slate-500'>
                Role Name <span className='text-red-500'>*</span>
            </label>
            <input
            value={roledata.roleName}
            onChange={(e)=>{
              updateField("roleName",e.target.value)
            }}
            type='text'
            placeholder='e.g.Branch Manager'
            className='w-full border border-slate-300 px-4 py-3 rounded-xl text-sm outline-none  transition focus:border-[#043793]'
            />
             <p className="mt-2 text-xs text-slate-400">
          Choose a clear and descriptive name for the role.
        </p>
        </div>

        <div className='mt-5 grid gap-4 sm:grid-cols-2'>
          <div>
            <label className='mb-2 block text-sm font-medium text-slate-500'>
              Organization Group <span className='text-red-500'>*</span>
            </label>
            <select
              value={roledata.organizationGroupId || ''}
              onChange={(event) =>
                setRoleData((prev) => ({
                  ...prev,
                  organizationGroupId: Number(event.target.value),
                }))
              }
              disabled={groupsLoading || !!groupsError}
              className='w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#043793] disabled:bg-slate-100'
            >
              <option value=''>
                {groupsLoading ? 'Loading groups...' : 'Select a group'}
              </option>
              {organizationGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.shortName} — {group.companyName}
                </option>
              ))}
            </select>
            {!groupsLoading && !groupsError && organizationGroups.length === 0 && (
              <p className='mt-2 text-xs text-red-600'>
                Create an organization group before adding a role.
              </p>
            )}
            {groupsError && (
              <p role='alert' className='mt-2 text-xs text-red-600'>
                Failed to load organization groups: {groupsError}
              </p>
            )}
          </div>
          <div>
            <label className='mb-2 block text-sm font-medium text-slate-500'>
              Scope <span className='text-red-500'>*</span>
            </label>
            <select
              value={roledata.scope}
              onChange={(event) =>
                setRoleData((prev) => ({
                  ...prev,
                  scope: event.target.value as RoleScope,
                }))
              }
              className='w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#043793]'
            >
              <option value='GROUP'>Organization Group</option>
              <option value='UNIT'>Organization Unit</option>
            </select>
          </div>
        </div>




        <div className='mt-5'>
            <label className='mb-2 block text-sm font-medium text-slate-500'>
              Description<span className='text-red-500'>*</span>
            </label>
            <textarea
               value={roledata.description}
            placeholder="Describe the role's responsibilities..."
            onChange={(e)=>{
              updateField('description',e.target.value)
            }}
          rows={4}
          maxLength={250}

            className='w-full border border-slate-300 px-4 py-3 rounded-xl text-sm outline-none  transition focus:border-[#043793]'
            />
           <div className="mt-1 text-right text-xs text-slate-400">
          {roledata.description.length}/250
        </div>
        </div>


        <div className='mt-5'>
            <label className='mb-3 block text-sm font-medium text-slate-600'>
               Access Level<span>*</span>
            </label>

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                {
                    accessLevels.map((level)=>{
                        const Icon = level.icon
                        const selected = roledata.accessLevel ===level.id
                        return(
                            <div key={level.id}>
                                 <button
                type="button"
                onClick={() =>
                  updateField(
                    "accessLevel",
                    level.id
                  )
                }
                className={`
                  rounded-xl border p-4 text-center transition
                  ${
                    selected
                      ? "border-[#2563EB] bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }
                `}
              >
                <Icon
                  size={22}
                  className="mx-auto mb-2 text-[#043793]"
                />

                <p className="text-sm font-semibold text-slate-700">
                  {level.title}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {level.description}
                </p>
              </button>
                                </div>
                        )
                    })
                }
            </div>
        </div>

         <div className="mt-5 flex gap-3 rounded-xl bg-blue-50 p-4 text-sm text-[#043793]">
        <Info size={18} />

        <p>
          Select an access level that best matches the
          responsibilities of this role.
        </p>
      </div>


<div className='mt-8 flex items-center justify-between'>

    <button
    type='button'
    onClick={onCancel}
    className='flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-slate-500'
    >

        <ArrowLeft
        size={16}
        />
    Cancel
    </button>

     <button
    type='button'
    onClick={onNext}
    disabled={!canContinue}
    className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white
    ${canContinue?
      "bg-[#043793] hover:bg-[#03296e]"
      : "cursor-not-allowed bg-slate-300"
    }
    `}>

        <ArrowRight
        size={16}
        />
    Next
    </button>


</div>
    </div>
  )
}

export default RoleInformation