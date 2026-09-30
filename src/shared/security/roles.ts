export const roles = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
  CLIENT: "ROLE_CLIENT",
  USER: "ROLE_USER",
} as const;

export type Role = typeof roles[keyof typeof roles];
