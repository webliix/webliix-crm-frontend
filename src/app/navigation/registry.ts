import type { CurrentUser } from "@/modules/auth/types/auth.types";
import type { NavigationItem } from "./types";
import { menuItems } from "./menu";

export function getVisibleNavigationItems(user: CurrentUser | null | undefined): NavigationItem[] {
  if (!user) {
    return menuItems;
  }

  const isSuperAdmin = user.roles?.some(
    (r) => r.toUpperCase() === "SUPER_ADMIN" || r.toUpperCase() === "ROLE_SUPER_ADMIN"
  );

  if (isSuperAdmin || user.permissions?.includes("*")) {
    return menuItems;
  }

  return menuItems.filter(
    (item) => !item.permission || (user.permissions && user.permissions.includes(item.permission))
  );
}