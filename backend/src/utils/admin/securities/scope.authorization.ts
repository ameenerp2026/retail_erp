import { UserScope } from "./scope.helper.js";
import {
  hasGlobalScope,
  hasGroupScope,
  hasUnitScope,
} from "./scope.utils.js";

export const canAccessScope = (
  scopes: UserScope[],
  organizationGroupId: number,
  organizationUnitId?: number
): boolean => {
  return scopes.some((scope) => {
    // Global access
    if (hasGlobalScope(scope)) {
      return true;
    }

    // Accessing a specific organization unit
    if (organizationUnitId !== undefined) {
      // Group-level user can access every unit in their group
      if (
        scope.organizationGroupId === organizationGroupId &&
        scope.organizationUnitId === null
      ) {
        return true;
      }

      // Unit-level user can access only their own unit
      return hasUnitScope(
        scope,
        organizationGroupId,
        organizationUnitId
      );
    }

    // Accessing a group
    return hasGroupScope(
      scope,
      organizationGroupId
    );
  });
};