import React from "react";
import type { RoleWizardData } from "../../pages/RoleWizard";

interface Permission {
  id: string;
  label: string;
}

interface PermissionGroup {
  module: string;
  permissions: Permission[];
}

interface PermissionMatrixProps {
  roledata: RoleWizardData;
  setRoleData: React.Dispatch<React.SetStateAction<RoleWizardData>>;
  onBack: () => void;
  onNext: () => void;
}

const permissionGroups: PermissionGroup[] = [
  {
    module: "Organization",
    permissions: [
      { id: "ORG_GROUP_VIEW", label: "View Org Group" },
      { id: "ORG_GROUP_CREATE", label: "Create Org Group" },
      { id: "ORG_GROUP_EDIT", label: "Edit Org Group" },
      { id: "ORG_GROUP_DELETE", label: "Delete Org Group" },
      { id: "ORG_UNIT_VIEW", label: "View Org Unit" },
      { id: "ORG_UNIT_CREATE", label: "Create Org Unit" },
      { id: "ORG_UNIT_EDIT", label: "Edit Org Unit" },
      { id: "ORG_UNIT_DELETE", label: "Delete Org Unit" },
      { id: "BUSINESS_LOCATION_VIEW", label: "View Business Locations" },
      { id: "BUSINESS_LOCATION_CREATE", label: "Create Business Locations" },
      { id: "BUSINESS_LOCATION_EDIT", label: "Edit Business Locations" },
      { id: "BUSINESS_LOCATION_DELETE", label: "Delete Business Locations" },
      { id: "GSTIN_VIEW", label: "View GST Details" },
      { id: "GSTIN_MANAGE", label: "Manage GSTIN" },
    ],
  },
  {
    module: "Finance",
    permissions: [
      { id: "ACCOUNT_GROUP_VIEW", label: "View Account Groups" },
      { id: "ACCOUNT_GROUP_CREATE", label: "Create Account Groups" },
      { id: "ACCOUNT_GROUP_EDIT", label: "Edit Account Groups" },
      { id: "ACCOUNT_GROUP_DELETE", label: "Delete Account Groups" },
      { id: "ACCOUNT_CLASS_VIEW", label: "View Account Classes" },
      { id: "ACCOUNT_CLASS_CREATE", label: "Create Account Classes" },
      { id: "ACCOUNT_CLASS_EDIT", label: "Edit Account Classes" },
      { id: "ACCOUNT_CLASS_DELETE", label: "Delete Account Classes" },
      { id: "LEDGER_VIEW", label: "View Ledgers" },
      { id: "LEDGER_CREATE", label: "Create Ledgers" },
      { id: "LEDGER_EDIT", label: "Edit Ledgers" },
      { id: "LEDGER_DELETE", label: "Delete Ledgers" },
      { id: "SUB_LEDGER_VIEW", label: "View Sub Ledgers" },
      { id: "SUB_LEDGER_CREATE", label: "Create Sub Ledgers" },
      { id: "SUB_LEDGER_EDIT", label: "Edit Sub Ledgers" },
      { id: "SUB_LEDGER_DELETE", label: "Delete Sub Ledgers" },
      { id: "CURRENCY_VIEW", label: "View Currencies" },
      { id: "CURRENCY_CREATE", label: "Create Currencies" },
      { id: "CURRENCY_EDIT", label: "Edit Currencies" },
      { id: "CURRENCY_DELETE", label: "Delete Currencies" },
    ],
  },
  {
    module: "Securities",
    permissions: [
      { id: "ROLE_VIEW", label: "View Roles" },
      { id: "ROLE_CREATE", label: "Create Roles" },
      { id: "ROLE_EDIT", label: "Edit Roles" },
      { id: "ROLE_DELETE", label: "Delete Roles" },
      { id: "USER_VIEW", label: "View Users" },
      { id: "USER_CREATE", label: "Create Users" },
      { id: "USER_EDIT", label: "Edit Users" },
      { id: "USER_DELETE", label: "Delete Users" },
      { id: "USER_ROLE_ASSIGN", label: "Assign User Roles" },
      { id: "AUDIT_LOG_VIEW", label: "View Audit Logs" },
      { id: "AUDIT_LOG_EXPORT", label: "Export Audit Logs" },
    ],
  },
  {
    module: "Utilities",
    permissions: [
      { id: "DATA_IMPORT", label: "Import Data" },
      { id: "INVOICE_GENERATOR", label: "Generate Invoices" },
      { id: "BILL_GENERATOR", label: "Generate Bills" },
    ],
  },
];

function PermissionMatrix({
  roledata,
  setRoleData,
  onBack,
  onNext,
}: PermissionMatrixProps) {
  const selectedPermissions = roledata.permissions ?? [];
  /*
   * All permission IDs
   */
  const allPermissionIds = permissionGroups.flatMap((group) =>
    group.permissions.map((permission) => permission.id),
  );

  const handlePermissionChange = (permissionId: string) => {
    setRoleData((prev) => {
      const currentPermissions = prev.permissions ?? [];

      const alreadySelected = currentPermissions.includes(permissionId);

      return {
        ...prev,
        permissions: alreadySelected
          ? currentPermissions.filter((id) => id !== permissionId)
          : [...currentPermissions, permissionId],
      };
    });
  };

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
        new Set([...currentPermissions, ...permissionIds]),
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
        (id) => !permissionIds.includes(id),
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
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <h2>Permission Matrix</h2>
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
        {permissionGroups.map((group) => {
          const modulePermissionIds = group.permissions.map(
            (permission) => permission.id,
          );
          const moduleSelectedCount = modulePermissionIds.filter((id) =>
            selectedPermissions.includes(id),
          ).length;

          const moduleFullySelected =
            moduleSelectedCount === modulePermissionIds.length;
          return (
            <div
              key={group.module}
              className="overflow-hidden rounded-xl border border-slate-200"
            >
              {/* Module Header */}
              <div className="flex items-center justify-between bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-700">
                    {group.module}
                  </h3>
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
              <div className="grid grid-cols-1 gap-2 p-3 md:grid-cols-2 xl:grid-cols-3">
                {group.permissions.map((permission) => {
                  const checked = selectedPermissions.includes(permission.id);

                  return (
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
                          type="checkbox"
                          checked={checked}
                          onChange={() => handlePermissionChange(permission.id)}
                          className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>{permission.label}</span>
                      </label>
                    </>
                  );
                })}
              </div>
            </div>
          );
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
  );
}

export default PermissionMatrix;
