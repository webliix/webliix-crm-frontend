import type {
  InvoiceDashboardResponse,
  ProjectDashboardResponse,
  CustomerStatisticsResponse,
  TicketDashboardResponse,
  AuditLogResponse,
  LeadResponse,
} from "@/api/generated";

export interface DashboardAggregatedData {
  invoices: InvoiceDashboardResponse | null;
  projects: ProjectDashboardResponse | null;
  customers: CustomerStatisticsResponse | null;
  tickets: TicketDashboardResponse | null;
  recentLeads: LeadResponse[];
  totalLeads: number;
  recentActivity: AuditLogResponse[];
}
