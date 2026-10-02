import type { NavigationItem } from "./types";
import { menuAccess } from "@/shared/security/menu-access";

export const menuItems: NavigationItem[] = [
  menuAccess.dashboard,
  menuAccess.portal,
  menuAccess.leads,
  menuAccess.customers,
  menuAccess.projects,
  menuAccess.invoices,
  menuAccess.quotations,
  menuAccess.tickets,
  menuAccess.employees,
  menuAccess.payroll,
  menuAccess.expenses,
  menuAccess.reports,
  menuAccess.automations,
  menuAccess.auditLogs,
  menuAccess.blogs,
  menuAccess.subscribers,
  menuAccess.reviews,
  menuAccess.users,
  menuAccess.settings,
];
