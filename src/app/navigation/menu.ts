import type { NavigationItem } from "./types";
import { menuAccess } from "@/shared/security/menu-access";

export const menuItems: NavigationItem[] = [
  menuAccess.dashboard,
  menuAccess.projects,
  menuAccess.invoices,
  menuAccess.tickets,
  menuAccess.leads,
  menuAccess.customers,
  menuAccess.blogs,
  menuAccess.subscribers,
  menuAccess.reviews,
  menuAccess.users,
];
