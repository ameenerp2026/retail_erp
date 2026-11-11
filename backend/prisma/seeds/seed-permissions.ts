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
    code: "ACCOUNT_CLASS_UPDATE",
    name: "Update Account Class",
    module: "Finance",
    screen: "Account Classes",
    description: "Update account classes",
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

    // ==========================================
  // INventory PRODUCT SETUP
  // ==========================================
    {
    code: "TAX_VIEW",
    name: "View Tax Configuration",
    description: "View tax configuration",
    module: "Inventory",
    screen: "Tax Configuration",
  },
  {
    code: "UOM_CREATE",
    name: "Create UOM",
    description: "Create unit of measurement",
    module: "Inventory",
    screen: "UOM",
  },
  {
    code: "UOM_EDIT",
    name: "Edit UOM",
    description: "Edit unit of measurement",
    module: "Inventory",
    screen: "UOM",
  },
  {
    code: "UOM_DELETE",
    name: "Delete UOM",
    description: "Delete unit of measurement",
    module: "Inventory",
    screen: "UOM",
  },
  {
    code: "TAX_VIEW",
    name: "View Tax Configuration",
    description: "View tax configuration",
    module: "Inventory",
    screen: "Tax Configuration",
  },
  {
    code: "TAX_CREATE",
    name: "Create Tax Configuration",
    description: "Create tax configuration",
    module: "Inventory",
    screen: "Tax Configuration",
  },
  {
    code: "TAX_EDIT",
    name: "Edit Tax Configuration",
    description: "Edit and activate or deactivate tax configuration",
    module: "Inventory",
    screen: "Tax Configuration",
  },
];