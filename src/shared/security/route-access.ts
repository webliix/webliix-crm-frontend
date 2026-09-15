import { permissions } from "./permissions";

export const routeAccess = {
  "/dashboard": permissions.dashboard.view,
  "/leads": permissions.leads.view,
  "/customers": permissions.clients.view,
  "/blogs": permissions.blogs.view,
  "/projects": permissions.projects.view,
  "/tickets": permissions.tickets.view,
  "/reports": permissions.reports.view,
} as const;

export type RouteAccessPath = keyof typeof routeAccess;
export type RouteAccessPermission = typeof routeAccess[RouteAccessPath];
