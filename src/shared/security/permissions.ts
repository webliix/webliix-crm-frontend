export const permissions = {
  dashboard: {
    view: "DASHBOARD_VIEW",
  },
  leads: {
    view: "LEADS_VIEW",
    create: "LEADS_CREATE",
    edit: "LEADS_EDIT",
    delete: "LEADS_DELETE",
    convert: "LEADS_CONVERT",
  },
  clients: {
    view: "CLIENTS_VIEW",
    create: "CLIENTS_CREATE",
    edit: "CLIENTS_EDIT",
    delete: "CLIENTS_DELETE",
  },
  customers: {
    view: "CLIENTS_VIEW",
    create: "CLIENTS_CREATE",
    edit: "CLIENTS_EDIT",
    delete: "CLIENTS_DELETE",
  },
  blogs: {
    view: "BLOGS_VIEW",
    create: "BLOGS_CREATE",
    edit: "BLOGS_EDIT",
    delete: "BLOGS_DELETE",
  },
  projects: {
    view: "PROJECTS_VIEW",
    create: "PROJECTS_CREATE",
    edit: "PROJECTS_EDIT",
    delete: "PROJECTS_DELETE",
  },
  tickets: {
    view: "TICKETS_VIEW",
    create: "TICKETS_CREATE",
    edit: "TICKETS_EDIT",
    delete: "TICKETS_DELETE",
  },
  invoices: {
    view: "INVOICES_VIEW",
    create: "INVOICES_CREATE",
    edit: "INVOICES_EDIT",
    delete: "INVOICES_DELETE",
  },
  reports: {
    view: "REPORTS_VIEW",
  },
  subscribers: {
    view: "REPORTS_VIEW",
  },
  reviews: {
    view: "REPORTS_VIEW",
  },
  users: {
    view: "USERS_MANAGE",
    create: "USERS_MANAGE",
    edit: "USERS_MANAGE",
    delete: "USERS_DELETE",
  },
  settings: {
    view: "SETTINGS_VIEW",
  },
} as const;

export type Permissions = typeof permissions;
export type PermissionValue = Permissions[keyof Permissions][keyof Permissions[keyof Permissions]];
