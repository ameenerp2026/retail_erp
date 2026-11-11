import type { PermissionSeed } from "./types.js";

export const utilitiesPermissions: PermissionSeed[] = [
  {
    "code": "DATA_IMPORT",
    "name": "Import Data",
    "module": "Utilities",
    "screen": "Data Import",
    "description": "Import application data"
  },
  {
    "code": "INVOICE_GENERATOR",
    "name": "E Invoice Generator",
    "module": "Utilities",
    "screen": "E Invoice Generator",
    "description": "Generates invoices"
  },
  {
    "code": "BILL_GENERATOR",
    "name": "E Bill Generator",
    "module": "Utilities",
    "screen": "E Bill Generator",
    "description": "Generates E bills"
  },
];
