import React from 'react'
import type { RoleWizardData} from '../../pages/RoleWizard'

 interface Permission {
    id : string,
    label : string
}

interface PermissionGroup{

    module : string,
    permissions : Permission[];
}

interface PermissionMatrixProps {
    roledata : RoleWizardData,
    setRoleData: React.Dispatch<React.SetStateAction<RoleWizardData>>
     onBack: () => void;
  onNext: () => void;
}

const permissionGroups: PermissionGroup[] = [
  {
    module: "Organization",
    permissions: [
      { id: "ORG_GROUP_VIEW", label: "View Org Group" },
      { id: "ORG_UNIT_CREATE", label: "Create Org Unit" },
      { id: "ORG_UNIT_EDIT", label: "Edit Org Unit" },
      { id: "ORG_UNIT_DELETE", label: "Delete Org Unit" },
      { id: "GSTIN_MANAGE", label: "Manage GSTIN" },
      { id: "GSTIN_VIEW", label: "View GST Details" },
    ],
  },

  {
    module: "Finance",
    permissions: [
      { id: "LEDGER_VIEW", label: "View Ledger" },
      { id: "LEDGER_CREATE", label: "Create Ledger" },
      { id: "LEDGER_EDIT", label: "Edit Ledger" },
      { id: "LEDGER_DELETE", label: "Delete Ledger" },
      { id: "ACCOUNT_GROUP_MANAGE", label: "Manage Account Groups" },
      { id: "CURRENCY_VIEW", label: "View Currencies" },
      { id: "EXCHANGE_RATE_UPDATE", label: "Update Exchange Rates" },
    ],
  },

  {
    module: "Securities",
    permissions: [
      { id: "ROLE_VIEW", label: "View Roles" },
      { id: "ROLE_CREATE", label: "Create Roles" },
      { id: "ROLE_EDIT", label: "Edit Roles" },
      { id: "ROLE_DELETE", label: "Delete Roles" },
      { id: "USER_MANAGE", label: "Manage Users" },
      { id: "USER_LOG_VIEW", label: "View User Logs" },
      { id: "AUDIT_LOG_EXPORT", label: "Export Audit Logs" },
    ],
  },

  {
    module: "Utilities",
    permissions: [
      { id: "DATA_IMPORT", label: "Import Data" },
      { id: "E_INVOICE_GENERATE", label: "Generate E-Invoice" },
      { id: "E_WAY_BILL_GENERATE", label: "Generate E-Way Bill" },
      { id: "REPORT_EXPORT", label: "Export Reports" },
      { id: "IMPORT_LOG_VIEW", label: "View Import Logs" },
    ],
  },
];

function PermissionMatrix({
      roledata,
    setRoleData,
     onBack,
     onNext
}:PermissionMatrixProps) {

    const selectedPermissions =roledata.permissions ?? [];
    /*
   * All permission IDs
   */
    const allPermissionIds = permissionGroups.flatMap((group)=>
    group.permissions.map((permission)=>permission.id)
    )

    const handlePermissionChange=(permissionId:string)=>{
                setRoleData((prev)=>{
                       const currentPermissions = prev.permissions ?? [];

      const alreadySelected =
        currentPermissions.includes(permissionId);

      return {
        ...prev,
        permissions: alreadySelected
          ? currentPermissions.filter((id) => id !== permissionId)
          : [...currentPermissions, permissionId],
      };
                })
    }

     const selectedCount = selectedPermissions.length;





     /*
   * Select ALL permissions
   */
  const handleSelectAll = () => {
    setRoleData((prev) => ({
      ...prev,
      permissions: allPermissionIds,
    }));
  };

  /*
   * Clear ALL permissions
   */
  const handleClearAll = () => {
    setRoleData((prev) => ({
      ...prev,
      permissions: [],
    }));
  };

  /*
   * Select all permissions of a module
   */
  const handleSelectModule = (permissionIds: string[]) => {
    setRoleData((prev) => {
      const currentPermissions = prev.permissions ?? [];

      const mergedPermissions = Array.from(
        new Set([...currentPermissions, ...permissionIds])
      );

      return {
        ...prev,
        permissions: mergedPermissions,
      };
    });
  };

  /*
   * Clear all permissions of a module
   */
  const handleClearModule = (permissionIds: string[]) => {
    setRoleData((prev) => ({
      ...prev,
      permissions: (prev.permissions ?? []).filter(
        (id) => !permissionIds.includes(id)
      ),
    }));
  };

  /*
   * Check if ALL permissions are selected
   */
  const isAllSelected =
    allPermissionIds.length > 0 &&
    selectedPermissions.length === allPermissionIds.length;

  /*
   * Continue to review
   */
  const handleNext = () => {
    onNext();
  };

  return (
    <div className='w-full rounded-2xl border border-slate-200 bg-white shadow-sm'>
    <div className='flex flex-col gap-3 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between'>
        <h2>
            Permission Matrix
        </h2>
        <p> Select the permissions this role should have.</p>
    </div>

<div className="flex flex-wrap items-center gap-2">
          {/* Selected count */}
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600">
            {selectedCount} permissions selected
          </span>

          {/* Select All */}
          <button
            type="button"
            onClick={handleSelectAll}
            disabled={isAllSelected}
            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Select All
          </button>

          {/* Clear All */}
          <button
            type="button"
            onClick={handleClearAll}
            disabled={selectedCount === 0}
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear All
          </button>
        </div>

    <div>
        {permissionGroups.map((group)=>{
            const modulePermissionIds= group.permissions.map(
                (permission)=>permission.id
            )
const moduleSelectedCount =
            modulePermissionIds.filter((id) =>
              selectedPermissions.includes(id)
            ).length;

          const moduleFullySelected =
            moduleSelectedCount === modulePermissionIds.length;
            return(
<div
key={group.module}
  className="overflow-hidden rounded-xl border border-slate-200"
            >
              {/* Module Header */}
                <div className="flex items-center justify-between bg-slate-50 px-4 py-3">
                        <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-700">{group.module}</h3>
                     <span className="text-[11px] font-medium text-slate-400">
                    {moduleSelectedCount}/{modulePermissionIds.length}
                  </span>
                    </div>

                 
                <button
                  type="button"
                  onClick={() =>
                    moduleFullySelected
                      ? handleClearModule(modulePermissionIds)
                      : handleSelectModule(modulePermissionIds)
                  }
                  className="text-xs font-medium text-blue-600 transition hover:text-blue-700"
                >
                  {moduleFullySelected ? "Clear All" : "Select All"}
                </button>
                </div>
                    <div  className="grid grid-cols-1 gap-2 p-3 md:grid-cols-2 xl:grid-cols-3">

                        {group.permissions.map((permission)=>{
                                const checked=selectedPermissions.includes(permission.id)

                                return(
                                    <>
                                    <label
                                    key={permission.id}
                                     className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 transition ${
                        checked
                          ? "border-blue-200 bg-blue-50"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                                    >           
                               
                                    <input
                                    type='checkbox'
                                    checked={checked}
                                    onChange={()=>handlePermissionChange(permission.id)}
                                         className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span>
                                        {permission.label}
                                    </span>
                                         </label>
                                    </>
                                )
                        })}
                        </div>

                    </div>
            )
        })}
    </div>


    {/* =====================================================
          FOOTER
      ====================================================== */}
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
          onClick={handleNext}
          className="rounded-lg bg-[#123B63] px-5 py-2 text-xs font-medium text-white transition hover:bg-[#0f3152]"
        >
          Next →
        </button>
      </div>
    
    </div>


  )
}

export default PermissionMatrix

