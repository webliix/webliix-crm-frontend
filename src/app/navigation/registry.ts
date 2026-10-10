import type { CurrentUser } from "@/modules/auth/types/auth.types";
import type { NavigationItem } from "./types";
import { menuItems } from "./menu";

export function getVisibleNavigationItems(user: CurrentUser | null | undefined): NavigationItem[] {
  if (!user) {
    return menuItems;
  }

  const isAdmin = user.roles?.some((r) => {
    const clean = r.toUpperCase().replace(/^ROLE_/, "");
    return clean === "SUPER_ADMIN" || clean === "ADMIN";
  });

  if (isAdmin || user.permissions?.includes("*")) {
    return menuItems;
  }

  const isClient = user.roles?.some(
    (r) => {
      const clean = r.toUpperCase().replace(/^ROLE_/, "");
      return clean === "CLIENT" || clean === "USER";
    }
  );

  if (isClient) {
    const clientAllowedPaths = ["/dashboard", "/projects", "/invoices", "/tickets"];
    return menuItems.filter((item) => clientAllowedPaths.includes(item.path));
  }

  return menuItems.filter(
    (item) => !item.permission || (user.permissions && user.permissions.includes(item.permission))
  );
}