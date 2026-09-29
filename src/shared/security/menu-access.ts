import { permissions } from "./permissions";

export const menuAccess = {
  dashboard: {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    permission: permissions.dashboard.view,
  },
  leads: {
    id: "leads",
    label: "Leads",
    path: "/leads",
    permission: permissions.leads.view,
  },
  customers: {
    id: "customers",
    label: "Clients",
    path: "/customers",
    permission: permissions.clients.view,
  },
  blogs: {
    id: "blogs",
    label: "Blog CMS",
    path: "/blogs",
    permission: permissions.blogs.view,
  },
  projects: {
    id: "projects",
    label: "Projects",
    path: "/projects",
    permission: permissions.projects.view,
  },
  tickets: {
    id: "tickets",
    label: "Tickets",
    path: "/tickets",
    permission: permissions.tickets.view,
  },
  subscribers: {
    id: "subscribers",
    label: "Newsletter",
    path: "/subscribers",
    permission: permissions.subscribers.view,
  },
  reviews: {
    id: "reviews",
    label: "Reviews & Feedback",
    path: "/reviews",
    permission: permissions.reviews.view,
  },
  users: {
    id: "users",
    label: "User Accounts",
    path: "/users",
    permission: permissions.users.view,
  },
  reports: {
    id: "reports",
    label: "Reports",
    path: "/reports",
    permission: permissions.reports.view,
  },
} as const;

export type MenuAccessItem = typeof menuAccess[keyof typeof menuAccess];
