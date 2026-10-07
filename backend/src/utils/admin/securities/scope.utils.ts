import { UserScope } from "./scope.helper.js";

export const hasGlobalScope = (scope: UserScope): boolean => {
  return (
    scope.organizationGroupId === null &&
    scope.organizationUnitId === null
  );
};

export const hasGroupScope = (
  scope: UserScope,
  organizationGroupId: number
): boolean => {
  return (
    scope.organizationGroupId === organizationGroupId &&
    scope.organizationUnitId === null
  );
};

export const hasUnitScope = (
  scope: UserScope,
  organizationGroupId: number,
  organizationUnitId: number
): boolean => {
  return (
    scope.organizationGroupId === organizationGroupId &&
    scope.organizationUnitId === organizationUnitId
  );
};