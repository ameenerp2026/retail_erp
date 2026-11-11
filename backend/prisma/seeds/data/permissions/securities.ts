import type { PermissionSeed } from "./types.js";

export const securitiesPermissions: PermissionSeed[] = [
  {
    "code": "ROLE_VIEW",
    "name": "View Roles",
    "module": "Securities",
    "screen": "Roles",
    "description": "View security roles"
  },
  {
    "code": "ROLE_CREATE",
    "name": "Create Role",
    "module": "Securities",
    "screen": "Roles",
    "description": "Create security roles"
  },
  {
    "code": "ROLE_EDIT",
    "name": "Edit Role",
    "module": "Securities",
    "screen": "Roles",
    "description": "Edit security roles"
  },
  {
    "code": "ROLE_DELETE",
    "name": "Delete Role",
    "module": "Securities",
    "screen": "Roles",
    "description": "Delete security roles"
  },
  {
    "code": "USER_VIEW",
    "name": "View Users",
    "module": "Securities",
    "screen": "Users",
    "description": "View users"
  },
  {
    "code": "USER_CREATE",
    "name": "Create User",
    "module": "Securities",
    "screen": "Users",
    "description": "Create users"
  },
  {
    "code": "USER_EDIT",
    "name": "Edit User",
    "module": "Securities",
    "screen": "Users",
    "description": "Edit users"
  },
  {
    "code": "USER_DELETE",
    "name": "Delete User",
    "module": "Securities",
    "screen": "Users",
    "description": "Delete users"
  },
  {
    "code": "USER_ROLE_ASSIGN",
    "name": "Assign User Role",
    "module": "Securities",
    "screen": "Users",
    "description": "Assign roles to users"
  },
  {
    "code": "AUDIT_LOG_VIEW",
    "name": "View Audit Logs",
    "module": "Securities",
    "screen": "User Audit Log",
    "description": "View user audit logs"
  },
  {
    "code": "AUDIT_LOG_EXPORT",
    "name": "Export Audit Logs",
    "module": "Securities",
    "screen": "User Audit Log",
    "description": "Export user audit logs"
  },
];
