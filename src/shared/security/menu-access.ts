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
  invoices: {
    id: "invoices",
    label: "Invoices & Billing",
    path: "/invoices",
    permission: permissions.invoices.view,
  },
  reports: {
    id: "reports",
    label: "Reports",
    path: "/reports",
    permission: permissions.reports.view,
  },
  automations: {
    id: "automations",
    label: "Automations",
    path: "/automations",
    permission: permissions.automations.view,
  },
  payroll: {
    id: "payroll",
    label: "HR & Payroll",
    path: "/payroll",
    permission: permissions.payroll.view,
  },
  quotations: {
    id: "quotations",
    label: "Quotations & Proposals",
    path: "/quotations",
    permission: permissions.quotations.view,
  },
  auditLogs: {
    id: "auditLogs",
    label: "Audit Logs",
    path: "/audit-logs",
    permission: permissions.auditLogs.view,
  },
  employees: {
    id: "employees",
    label: "Employees",
    path: "/employees",
    permission: permissions.employees.view,
  },
  expenses: {
    id: "expenses",
    label: "Expenses",
    path: "/expenses",
    permission: permissions.expenses.view,
  },
  offers: {
    id: "offers",
    label: "Client Offers",
    path: "/offers",
    permission: permissions.dashboard.view,
  },
  settings: {
    id: "settings",
    label: "Settings",
    path: "/settings",
    permission: permissions.settings.view,
  },
} as const;

export type MenuAccessItem = typeof menuAccess[keyof typeof menuAccess];
