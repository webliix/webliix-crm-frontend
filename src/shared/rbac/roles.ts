// NOTE: role values should be sourced from the backend via the authenticated user object.
// This file contains legacy role names and is not exported from the shared RBAC public API.
export const roles = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
} as const;
