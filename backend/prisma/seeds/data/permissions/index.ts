import { financePermissions } from "./finance.js";
import { inventoryPermissions } from "./inventory.js";
import { organizationPermissions } from "./organization.js";
import { securitiesPermissions } from "./securities.js";
import { utilitiesPermissions } from "./utilities.js";

export {
  financePermissions,
  inventoryPermissions,
  organizationPermissions,
  securitiesPermissions,
  utilitiesPermissions,
};

export const allPermissions = [
  ...organizationPermissions,
  ...financePermissions,
  ...securitiesPermissions,
  ...utilitiesPermissions,
  ...inventoryPermissions,
];
