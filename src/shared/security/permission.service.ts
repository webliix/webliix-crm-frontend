import type { CurrentUser } from "@/modules/auth/types/auth.types";

export const permissionService = {
  can(user: CurrentUser | null | undefined, permission?: string): boolean {
    if (!permission) return true;
    if (!user) return false;

    const isSuperAdmin = user.roles?.some(
      (r) => r.toUpperCase() === "SUPER_ADMIN" || r.toUpperCase() === "ROLE_SUPER_ADMIN"
    );

    if (isSuperAdmin || user.permissions?.includes("*")) {
      return true;
    }

    return Boolean(user.permissions?.includes(permission));
  },

  hasRole(user: CurrentUser | null | undefined, role: string): boolean {
    if (!user) return false;

    const isSuperAdmin = user.roles?.some(
      (r) => r.toUpperCase() === "SUPER_ADMIN" || r.toUpperCase() === "ROLE_SUPER_ADMIN"
    );

    if (isSuperAdmin) {
      return true;
    }

    const cleanRole = role.toUpperCase().replace(/^ROLE_/, "");
    return Boolean(
      user.roles?.some((r) => {
        const userClean = r.toUpperCase().replace(/^ROLE_/, "");
        return userClean === cleanRole;
      })
    );
  },
};
