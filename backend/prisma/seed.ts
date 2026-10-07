// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ======================================================
// SECURITY PERMISSIONS
// ======================================================

const permissions = [
  // ==========================================
  // ORGANIZATION
  // ==========================================

  {
    code: "ORG_GROUP_VIEW",
    name: "View Organization Group",
    module: "Organization",
    screen: "Organization Group",
    description: "View organization group details",
  },
  {
    code: "ORG_GROUP_CREATE",
    name: "Create Organization Group",
    module: "Organization",
    screen: "Organization Group",
    description: "Create organization groups",
  },
  {
    code: "ORG_GROUP_EDIT",
    name: "Edit Organization Group",
    module: "Organization",
    screen: "Organization Group",
    description: "Edit organization groups",
  },
  {
    code: "ORG_GROUP_DELETE",
    name: "Delete Organization Group",
    module: "Organization",
    screen: "Organization Group",
    description: "Delete organization groups",
  },

  {
    code: "ORG_UNIT_VIEW",
    name: "View Organization Unit",
    module: "Organization",
    screen: "Organization Unit",
    description: "View organization units",
  },
  {
    code: "ORG_UNIT_CREATE",
    name: "Create Organization Unit",
    module: "Organization",
    screen: "Organization Unit",
    description: "Create organization units",
  },
  {
    code: "ORG_UNIT_EDIT",
    name: "Edit Organization Unit",
    module: "Organization",
    screen: "Organization Unit",
    description: "Edit organization units",
  },
  {
    code: "ORG_UNIT_DELETE",
    name: "Delete Organization Unit",
    module: "Organization",
    screen: "Organization Unit",
    description: "Delete organization units",
  },

  {
    code: "BUSINESS_LOCATION_VIEW",
    name: "View Business Locations",
    module: "Organization",
    screen: "Business Location",
    description: "View business locations",
  },
  {
    code: "BUSINESS_LOCATION_CREATE",
    name: "Create Business Location",
    module: "Organization",
    screen: "Business Location",
    description: "Create business locations",
  },
  {
    code: "BUSINESS_LOCATION_EDIT",
    name: "Edit Business Location",
    module: "Organization",
    screen: "Business Location",
    description: "Edit business locations",
  },
  {
    code: "BUSINESS_LOCATION_DELETE",
    name: "Delete Business Location",
    module: "Organization",
    screen: "Business Location",
    description: "Delete business locations",
  },

  {
    code: "GSTIN_VIEW",
    name: "View GST Details",
    module: "Organization",
    screen: "GST Management",
    description: "View GST details",
  },
  {
    code: "GSTIN_MANAGE",
    name: "Manage GST",
    module: "Organization",
    screen: "GST Management",
    description: "Create and manage GST details",
  },

  // ==========================================
  // FINANCE
  // ==========================================

  {
    code: "ACCOUNT_GROUP_VIEW",
    name: "View Account Groups",
    module: "Finance",
    screen: "Account Groups",
    description: "View account groups",
  },
  {
    code: "ACCOUNT_GROUP_CREATE",
    name: "Create Account Group",
    module: "Finance",
    screen: "Account Groups",
    description: "Create account groups",
  },
  {
    code: "ACCOUNT_GROUP_EDIT",
    name: "Edit Account Group",
    module: "Finance",
    screen: "Account Groups",
    description: "Edit account groups",
  },
  {
    code: "ACCOUNT_GROUP_DELETE",
    name: "Delete Account Group",
    module: "Finance",
    screen: "Account Groups",
    description: "Delete account groups",
  },

  {
    code: "ACCOUNT_CLASS_VIEW",
    name: "View Account Classes",
    module: "Finance",
    screen: "Account Classes",
    description: "View account classes",
  },
  {
    code: "ACCOUNT_CLASS_CREATE",
    name: "Create Account Class",
    module: "Finance",
    screen: "Account Classes",
    description: "Create account class",
  },
  {
    code: "ACCOUNT_CLASS_EDIT",
    name: "Edit Account Class",
    module: "Finance",
    screen: "Account Classes",
    description: "Edit account classes",
  },
  {
    code: "ACCOUNT_CLASS_DELETE",
    name: "Delete Account Class",
    module: "Finance",
    screen: "Account Classes",
    description: "Delete account classes",
  },

  {
    code: "LEDGER_VIEW",
    name: "View Ledgers",
    module: "Finance",
    screen: "Ledgers",
    description: "View ledgers",
  },
  {
    code: "LEDGER_CREATE",
    name: "Create Ledger",
    module: "Finance",
    screen: "Ledgers",
    description: "Create ledgers",
  },
  {
    code: "LEDGER_EDIT",
    name: "Edit Ledger",
    module: "Finance",
    screen: "Ledgers",
    description: "Edit ledgers",
  },
  {
    code: "LEDGER_DELETE",
    name: "Delete Ledger",
    module: "Finance",
    screen: "Ledgers",
    description: "Delete ledgers",
  },

  {
    code: "SUB_LEDGER_VIEW",
    name: "View Sub Ledgers",
    module: "Finance",
    screen: "Sub Ledgers",
    description: "View sub ledgers",
  },
  {
    code: "SUB_LEDGER_CREATE",
    name: "Create Sub Ledger",
    module: "Finance",
    screen: "Sub Ledgers",
    description: "Create sub ledgers",
  },
  {
    code: "SUB_LEDGER_EDIT",
    name: "Edit Sub Ledger",
    module: "Finance",
    screen: "Sub Ledgers",
    description: "Edit sub ledgers",
  },
  {
    code: "SUB_LEDGER_DELETE",
    name: "Delete Sub Ledger",
    module: "Finance",
    screen: "Sub Ledgers",
    description: "Delete sub ledgers",
  },

  {
    code: "CURRENCY_VIEW",
    name: "View Currencies",
    module: "Finance",
    screen: "Currencies",
    description: "View currencies",
  },
  {
    code: "CURRENCY_CREATE",
    name: "Create Currency",
    module: "Finance",
    screen: "Currencies",
    description: "Create currencies",
  },
  {
    code: "CURRENCY_EDIT",
    name: "Edit Currency",
    module: "Finance",
    screen: "Currencies",
    description: "Edit currencies",
  },
  {
    code: "CURRENCY_DELETE",
    name: "Delete Currency",
    module: "Finance",
    screen: "Currencies",
    description: "Delete currencies",
  },

  // ==========================================
  // SECURITIES
  // ==========================================

  {
    code: "ROLE_VIEW",
    name: "View Roles",
    module: "Securities",
    screen: "Roles",
    description: "View security roles",
  },
  {
    code: "ROLE_CREATE",
    name: "Create Role",
    module: "Securities",
    screen: "Roles",
    description: "Create security roles",
  },
  {
    code: "ROLE_EDIT",
    name: "Edit Role",
    module: "Securities",
    screen: "Roles",
    description: "Edit security roles",
  },
  {
    code: "ROLE_DELETE",
    name: "Delete Role",
    module: "Securities",
    screen: "Roles",
    description: "Delete security roles",
  },

  {
    code: "USER_VIEW",
    name: "View Users",
    module: "Securities",
    screen: "Users",
    description: "View users",
  },
  {
    code: "USER_CREATE",
    name: "Create User",
    module: "Securities",
    screen: "Users",
    description: "Create users",
  },
  {
    code: "USER_EDIT",
    name: "Edit User",
    module: "Securities",
    screen: "Users",
    description: "Edit users",
  },
  {
    code: "USER_DELETE",
    name: "Delete User",
    module: "Securities",
    screen: "Users",
    description: "Delete users",
  },
  {
    code: "USER_ROLE_ASSIGN",
    name: "Assign User Role",
    module: "Securities",
    screen: "Users",
    description: "Assign roles to users",
  },

  {
    code: "AUDIT_LOG_VIEW",
    name: "View Audit Logs",
    module: "Securities",
    screen: "User Audit Log",
    description: "View user audit logs",
  },
  {
    code: "AUDIT_LOG_EXPORT",
    name: "Export Audit Logs",
    module: "Securities",
    screen: "User Audit Log",
    description: "Export user audit logs",
  },

  // ==========================================
  // UTILITIES
  // ==========================================

  {
    code: "DATA_IMPORT",
    name: "Import Data",
    module: "Utilities",
    screen: "Data Import",
    description: "Import application data",
  },
  {
    code: "INVOICE_GENERATOR",
    name: "E Invoice Generator",
    module: "Utilities",
    screen: "E Invoice Generator",
    description: "Generates invoices",
  },
  {
    code: "BILL_GENERATOR",
    name: "E Bill Generator",
    module: "Utilities",
    screen: "E Bill Generator",
    description: "Generates E bills",
  },
];

// ======================================================
// MAIN
// ======================================================

async function main() {
  // ====================================================
  // 1. ACCOUNTING GROUPS
  // ====================================================

  const assets = await prisma.group.upsert({
    where: {
      groupCode: "AG001",
    },
    update: {},
    create: {
      groupName: "Assets",
      groupCode: "AG001",
    },
  });

  const liabilities = await prisma.group.upsert({
    where: {
      groupCode: "AG010",
    },
    update: {},
    create: {
      groupName: "Liabilities",
      groupCode: "AG010",
    },
  });

  const income = await prisma.group.upsert({
    where: {
      groupCode: "AG016",
    },
    update: {},
    create: {
      groupName: "Income",
      groupCode: "AG016",
    },
  });

  // ====================================================
  // 2. SUB GROUPS
  // ====================================================

  const currentAssets = await prisma.subGroup.upsert({
    where: {
      subGroupCode: "AG002",
    },
    update: {},
    create: {
      subGroupName: "Current Assets",
      subGroupCode: "AG002",
      groupId: assets.id,
    },
  });

  const fixedAssets = await prisma.subGroup.upsert({
    where: {
      subGroupCode: "AG003",
    },
    update: {},
    create: {
      subGroupName: "Fixed Assets",
      subGroupCode: "AG003",
      groupId: assets.id,
    },
  });

  const currentLiabilities = await prisma.subGroup.upsert({
    where: {
      subGroupCode: "AG011",
    },
    update: {},
    create: {
      subGroupName: "Current Liabilities",
      subGroupCode: "AG011",
      groupId: liabilities.id,
    },
  });

  await prisma.subGroup.upsert({
    where: {
      subGroupCode: "AG012",
    },
    update: {},
    create: {
      subGroupName: "Long-term Liabilities",
      subGroupCode: "AG012",
      groupId: liabilities.id,
    },
  });

  const revenue = await prisma.subGroup.upsert({
    where: {
      subGroupCode: "AG017",
    },
    update: {},
    create: {
      subGroupName: "Revenue",
      subGroupCode: "AG017",
      groupId: income.id,
    },
  });

  // ====================================================
  // 3. ACCOUNT GROUPS
  // ====================================================

  const accountGroups = [
    {
      rootGroupName: "Cash & Cash Equivalents",
      groupCode: "AG005",
      groupId: assets.id,
      subGroupId: currentAssets.id,
    },
    {
      rootGroupName: "Bank Accounts",
      groupCode: "AG006",
      groupId: assets.id,
      subGroupId: currentAssets.id,
    },
    {
      rootGroupName: "Accounts Receivable",
      groupCode: "AG007",
      groupId: assets.id,
      subGroupId: currentAssets.id,
    },
    {
      rootGroupName: "Land & Building",
      groupCode: "AG008",
      groupId: assets.id,
      subGroupId: fixedAssets.id,
    },
    {
      rootGroupName: "Plant & Machinery",
      groupCode: "AG009",
      groupId: assets.id,
      subGroupId: fixedAssets.id,
    },
    {
      rootGroupName: "Accounts Payable",
      groupCode: "AG014",
      groupId: liabilities.id,
      subGroupId: currentLiabilities.id,
    },
    {
      rootGroupName: "GST Payable",
      groupCode: "AG015",
      groupId: liabilities.id,
      subGroupId: currentLiabilities.id,
    },
    {
      rootGroupName: "Sales - Retail",
      groupCode: "AG019",
      groupId: income.id,
      subGroupId: revenue.id,
    },
    {
      rootGroupName: "Service Income",
      groupCode: "AG020",
      groupId: income.id,
      subGroupId: revenue.id,
    },
  ];

  for (const ag of accountGroups) {
    await prisma.accountGroup.upsert({
      where: {
        groupCode: ag.groupCode,
      },
      update: {},
      create: ag,
    });
  }

  console.log("Seeded groups, sub-groups, and account groups");

  // ====================================================
  // 4. SUB LEDGER TYPES
  // ====================================================

  const subLedgerTypes = [
    "Customer",
    "Vendor",
    "Employee",
  ];

  for (const typeName of subLedgerTypes) {
    await prisma.subLedgerType.upsert({
      where: {
        typeName,
      },
      update: {},
      create: {
        typeName,
      },
    });
  }

  console.log(
    "Seeded sub ledger types: Customer, Vendor, Employee"
  );

  // ====================================================
  // 5. SECURITY PERMISSIONS
  // ====================================================

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        code: permission.code,
      },
      update: {
        name: permission.name,
        module: permission.module,
        screen: permission.screen,
        description: permission.description,
      },
      create: permission,
    });
  }

  console.log(
    `Seeded ${permissions.length} security permissions`
  );

  // ====================================================
  // 6. FIND ORGANIZATION GROUP
  // ====================================================

  const organizationGroup =
    await prisma.organizationGroup.findFirst();

  if (!organizationGroup) {
    throw new Error(
      "Cannot seed security roles: no OrganizationGroup exists."
    );
  }

  // ====================================================
  // 7. DEFAULT ADMINISTRATOR ROLE
  // ====================================================

  const adminRole = await prisma.role.upsert({
    where: {
      organizationGroupId_name: {
        organizationGroupId: organizationGroup.id,
        name: "Administrator",
      },
    },

    update: {
      description: "Administrative access",
      roleType: "ADMIN",
      scope: "GROUP",
      priority: 80,
      status: "ACTIVE",
    },

    create: {
      name: "Administrator",
      description: "Administrative access",
      roleType: "ADMIN",
      scope: "GROUP",
      priority: 80,
      status: "ACTIVE",
      organizationGroupId: organizationGroup.id,
    },
  });

  console.log(
    `Administrator role ready: ${adminRole.id}`
  );

  // ====================================================
  // 8. ASSIGN ALL PERMISSIONS TO ADMINISTRATOR
  // ====================================================

  const allPermissions =
    await prisma.permission.findMany();

  await prisma.rolePermission.createMany({
    data: allPermissions.map((permission) => ({
      roleId: adminRole.id,
      permissionId: permission.id,
    })),
    skipDuplicates: true,
  });

  console.log(
    `Assigned ${allPermissions.length} permissions to Administrator`
  );

  // ====================================================
  // 9. ASSIGN ADMINISTRATOR TO APPLICATION ADMIN
  // ====================================================
// ====================================================
// 9. ASSIGN GLOBAL ADMINISTRATOR
// ====================================================

const adminUser = await prisma.user.findUnique({
  where: {
    email: "admin@streamys.in",
  },
});

if (!adminUser) {
  throw new Error(
    "Global admin user admin@streamys.in not found."
  );
}

const existingAdminRole = await prisma.userRole.findFirst({
  where: {
    userId: adminUser.id,
    roleId: adminRole.id,
    organizationGroupId: null,
    organizationUnitId: null,
  },
});

if (!existingAdminRole) {
  await prisma.userRole.create({
    data: {
      userId: adminUser.id,
      roleId: adminRole.id,

      // Global admin
      organizationGroupId: null,
      organizationUnitId: null,
    },
  });

  console.log(
    `Global Administrator assigned to ${adminUser.email}`
  );
} else {
  console.log(
    `Global Administrator already assigned to ${adminUser.email}`
  );
}

  // ====================================================
  // COMPLETE
  // ====================================================

  console.log("==========================================");
  console.log("Database seed completed successfully");
  console.log("==========================================");
}

// ======================================================
// RUN SEED
// ======================================================

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });