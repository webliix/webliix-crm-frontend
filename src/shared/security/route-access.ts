import { permissions } from "./permissions";

export const routeAccess = {
  "/dashboard": permissions.dashboard.view,
  "/leads": permissions.leads.view,
  "/customers": permissions.clients.view,
  "/blogs": permissions.blogs.view,
  "/projects": permissions.projects.view,
  "/invoices": permissions.invoices.view,
  "/tickets": permissions.tickets.view,
  "/subscribers": permissions.subscribers.view,
  "/reviews": permissions.reviews.view,
  "/users": permissions.users.view,
  "/reports": permissions.reports.view,
  "/automations": permissions.automations.view,
  "/payroll": permissions.payroll.view,
  "/quotations": permissions.quotations.view,
  "/audit-logs": permissions.auditLogs.view,
  "/portal": permissions.dashboard.view,
} as const;

export type RouteAccessPath = keyof typeof routeAccess;
export type RouteAccessPermission = typeof routeAccess[RouteAccessPath];
