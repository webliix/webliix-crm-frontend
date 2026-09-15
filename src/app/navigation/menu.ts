import type { NavigationItem } from "./types";
import { menuAccess } from "@/shared/security/menu-access";

export const menuItems: NavigationItem[] = [
  menuAccess.dashboard,
  menuAccess.leads,
  menuAccess.customers,
  menuAccess.blogs,
  menuAccess.tickets,
];
