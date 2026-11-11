import type { PermissionSeed } from "./types.js";

export const inventoryPermissions: PermissionSeed[] = [
  {
    "code": "UOM_VIEW",
    "name": "View UOM",
    "module": "Inventory",
    "screen": "UOM",
    "description": "View unit of measurement"
  },
  {
    "code": "UOM_CREATE",
    "name": "Create UOM",
    "module": "Inventory",
    "screen": "UOM",
    "description": "Create unit of measurement"
  },
  {
    "code": "UOM_EDIT",
    "name": "Edit UOM",
    "module": "Inventory",
    "screen": "UOM",
    "description": "Edit unit of measurement"
  },
  {
    "code": "UOM_DELETE",
    "name": "Delete UOM",
    "module": "Inventory",
    "screen": "UOM",
    "description": "Delete unit of measurement"
  },
  {
    "code": "TAX_VIEW",
    "name": "View Tax Configuration",
    "module": "Inventory",
    "screen": "Tax Configuration",
    "description": "View tax configuration"
  },
  {
    "code": "TAX_CREATE",
    "name": "Create Tax Configuration",
    "module": "Inventory",
    "screen": "Tax Configuration",
    "description": "Create tax configuration"
  },
  {
    "code": "TAX_EDIT",
    "name": "Edit Tax Configuration",
    "module": "Inventory",
    "screen": "Tax Configuration",
    "description": "Edit and activate or deactivate tax configuration"
  },
];
