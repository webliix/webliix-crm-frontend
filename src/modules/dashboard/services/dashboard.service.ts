import { http } from "@/shared/services/http";
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
      http.get("/api/v1/invoices/dashboard"),
      http.get("/api/v1/projects/dashboard"),
      http.get("/api/v1/customers/statistics"),
      http.get("/api/v1/tickets/dashboard"),
      http.get("/api/v1/leads", { params: { page: 0, size: 5 } }),
      http.get("/api/v1/audit/logs", { params: { page: 0, size: 6 } }),
    ]);

    const invoices =
      invoicesResult.status === "fulfilled"
        ? (invoicesResult.value?.data?.data || invoicesResult.value?.data)
        : null;

    const projects =
      projectsResult.status === "fulfilled"
        ? (projectsResult.value?.data?.data || projectsResult.value?.data)
        : null;

    const customers =
      customersResult.status === "fulfilled"
        ? (customersResult.value?.data?.data || customersResult.value?.data)
        : null;

    const tickets =
      ticketsResult.status === "fulfilled"
        ? (ticketsResult.value?.data?.data || ticketsResult.value?.data)
        : null;

    const leadsPayload =
      leadsResult.status === "fulfilled"
        ? (leadsResult.value?.data?.data || leadsResult.value?.data)
        : null;

    const recentLeads = Array.isArray(leadsPayload?.content)
      ? leadsPayload.content
      : Array.isArray(leadsPayload)
      ? leadsPayload
      : [];

    const totalLeads =
      leadsPayload?.totalElements !== undefined
        ? leadsPayload.totalElements
        : recentLeads.length;

    const auditPayload =
      auditResult.status === "fulfilled"
        ? (auditResult.value?.data?.data || auditResult.value?.data)
        : null;

    const recentActivity = Array.isArray(auditPayload?.content)
      ? auditPayload.content
      : Array.isArray(auditPayload)
      ? auditPayload
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
