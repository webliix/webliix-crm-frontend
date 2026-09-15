export const permissions = {
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
  contracts: {
    view: "CONTRACTS_VIEW",
    create: "CONTRACTS_CREATE",
    edit: "CONTRACTS_EDIT",
    delete: "CONTRACTS_DELETE",
  },
  assets: {
    view: "ASSETS_VIEW",
    create: "ASSETS_CREATE",
    edit: "ASSETS_EDIT",
    delete: "ASSETS_DELETE",
  },
  reports: {
    view: "REPORTS_VIEW",
  },
  settings: {
    view: "SETTINGS_VIEW",
  },
} as const;
