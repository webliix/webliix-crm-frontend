import {
  InvoiceControllerService,
  ProjectControllerService,
  CustomerControllerService,
  TicketControllerService,
  LeadControllerService,
  AuditControllerService,
} from "@/api/generated";
import type { DashboardAggregatedData } from "../types/dashboard.types";

export const dashboardService = {
  async getDashboardData(): Promise<DashboardAggregatedData> {
    const [
      invoicesResult,
      projectsResult,
      customersResult,
      ticketsResult,
      leadsResult,
      auditResult,
    ] = await Promise.allSettled([
      InvoiceControllerService.dashboard2(),
      ProjectControllerService.getDashboard1(),
      CustomerControllerService.getStatistics1(),
      TicketControllerService.getDashboard(),
      LeadControllerService.getAllLeads(0, 5),
      AuditControllerService.searchAudit({ page: 0, size: 6 }),
    ]);

    const invoices =
      invoicesResult.status === "fulfilled" && invoicesResult.value?.data
        ? invoicesResult.value.data
        : null;

    const projects =
      projectsResult.status === "fulfilled" && projectsResult.value?.data
        ? projectsResult.value.data
        : null;

    const customers =
      customersResult.status === "fulfilled" && customersResult.value?.data
        ? customersResult.value.data
        : null;

    const tickets =
      ticketsResult.status === "fulfilled" && ticketsResult.value?.data
        ? ticketsResult.value.data
        : null;

    const recentLeads =
      leadsResult.status === "fulfilled" && leadsResult.value?.data?.content
        ? leadsResult.value.data.content
        : [];

    const totalLeads =
      leadsResult.status === "fulfilled" && leadsResult.value?.data?.totalElements !== undefined
        ? leadsResult.value.data.totalElements
        : recentLeads.length;

    const recentActivity =
      auditResult.status === "fulfilled" && auditResult.value?.content
        ? auditResult.value.content
        : [];

    return {
      invoices,
      projects,
      customers,
      tickets,
      recentLeads,
      totalLeads,
      recentActivity,
    };
  },
};
