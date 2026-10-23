interface RoleWizardData {
  roleName: string;
  description: string;
  roleType: string;
  priority: number;
  permissions: string[];
}

interface ReviewConfirmProps {
  roleData: RoleWizardData;
  onBack: () => void;
  onEditStep: (step: number) => void;
  onCreate?: () => void;
}

const permissionGroups = [
  {
    module: "Organization",
    permissions: [
      "ORG_GROUP_VIEW",
      "ORG_UNIT_CREATE",
      "ORG_UNIT_EDIT",
      "ORG_UNIT_DELETE",
      "GSTIN_MANAGE",
      "GSTIN_VIEW",
    ],
  },
  {
    module: "Finance",
    permissions: [
      "LEDGER_VIEW",
      "LEDGER_CREATE",
      "LEDGER_EDIT",
      "LEDGER_DELETE",
      "ACCOUNT_GROUP_MANAGE",
      "CURRENCY_VIEW",
      "EXCHANGE_RATE_UPDATE",
    ],
  },
  {
    module: "Securities",
    permissions: [
      "ROLE_VIEW",
      "ROLE_CREATE",
      "ROLE_EDIT",
      "ROLE_DELETE",
      "USER_MANAGE",
      "USER_LOG_VIEW",
      "AUDIT_LOG_EXPORT",
    ],
  },
  {
    module: "Utilities",
    permissions: [
      "DATA_IMPORT",
      "E_INVOICE_GENERATE",
      "E_WAY_BILL_GENERATE",
      "REPORT_EXPORT",
      "IMPORT_LOG_VIEW",
    ],
  },
];

function ReviewConfirm({
  roleData,
  onBack,
  onEditStep,
  onCreate,
}: ReviewConfirmProps) {
  const selectedPermissions = roleData.permissions ?? [];

  const totalPermissions = selectedPermissions.length;

  /*
   * Calculate permissions selected per module
   */
  const moduleCounts = permissionGroups.map((group) => {
    const count = group.permissions.filter((permissionId) =>
      selectedPermissions.includes(permissionId)
    ).length;

    return {
      module: group.module,
      count,
      total: group.permissions.length,
    };
  });

  const hasPermissions = totalPermissions > 0;

  return (
    <div className="w-full">
      {/* =====================================================
          REVIEW CARD
      ====================================================== */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Header */}
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-[#123B63]">
            Review & Confirm
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Review the role details and permissions before creating the role.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4 p-5">

          {/* =================================================
              ROLE INFORMATION
          ================================================== */}
          <div className="rounded-xl border border-slate-200 bg-white">

            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h3 className="text-xs font-semibold text-slate-700">
                Role Information
              </h3>

              <button
                type="button"
                onClick={() => onEditStep(1)}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Edit
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">

              {/* Role Name */}
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  Role Name
                </p>

                <p className="mt-1 text-sm font-semibold text-[#123B63]">
                  {roleData.roleName || "Untitled Role"}
                </p>
              </div>

              {/* Role Type */}
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  Role Type
                </p>

                <span className="mt-1 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-600">
                  {roleData.roleType || "Standard"}
                </span>
              </div>

              {/* Description */}
              {roleData.description && (
                <div className="md:col-span-2">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    Description
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {roleData.description}
                  </p>
                </div>
              )}

              {/* Priority */}
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  Priority
                </p>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  {roleData.priority || 0}
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              PERMISSIONS
          ================================================== */}
          <div className="rounded-xl border border-slate-200 bg-white">

            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div>
                <h3 className="text-xs font-semibold text-slate-700">
                  Permissions
                </h3>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  {totalPermissions} permissions selected
                </p>
              </div>

              <button
                type="button"
                onClick={() => onEditStep(2)}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Edit
              </button>
            </div>

            <div className="p-4">

              {hasPermissions ? (
            
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

                  {moduleCounts.map((module) => (
                    <div
                      key={module.module}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3"
                    >
                      <p className="text-xs font-medium text-slate-600">
                        {module.module}
                      </p>

                      <p className="mt-1 text-lg font-semibold text-[#123B63]">
                        {module.count}
                      </p>

                      <p className="text-[10px] text-slate-400">
                        of {module.total} permissions
                      </p>
                    </div>
                  ))}

                </div>
              ) : (
                <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3">
                  <p className="text-xs font-medium text-red-600">
                    No permissions selected
                  </p>

                  <p className="mt-1 text-[11px] text-red-500">
                    Go back to the Permissions step and assign at least one
                    permission.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =================================================
            FOOTER
        ================================================== */}
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
            disabled={!hasPermissions}
            onClick={onCreate}
            className="rounded-lg bg-emerald-500 px-5 py-2 text-xs font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Create Role
          </button>

        </div>
      </div>
    </div>
  );
}

export default ReviewConfirm;