import { http } from "@/shared/services/http";
import type {
  CustomerResponse,
  CustomerStatisticsResponse,
  CreateCustomerRequest,
  CustomerContact,
  CustomerNote,
  CustomerProjectSummary,
  CustomerInvoiceSummary,
} from "../types/customer.types";

export const customerService = {
  async getAllCustomers(): Promise<CustomerResponse[]> {
    const res = await http.get("/api/v1/customers", { params: { size: 100 } });
    return res.data?.data?.content ?? res.data?.data ?? [];
  },

  async getCustomer(id: number): Promise<CustomerResponse> {
    const res = await http.get(`/api/v1/customers/${id}`);
    return res.data?.data;
  },

  async createCustomer(payload: CreateCustomerRequest): Promise<CustomerResponse> {
    const res = await http.post("/api/v1/customers", payload);
    return res.data?.data;
  },

  async updateCustomer(id: number, payload: CreateCustomerRequest): Promise<CustomerResponse> {
    const res = await http.put(`/api/v1/customers/${id}`, payload);
    return res.data?.data;
  },

  async deleteCustomer(id: number): Promise<void> {
    await http.delete(`/api/v1/customers/${id}`);
  },

  async getStatistics(): Promise<CustomerStatisticsResponse> {
    const res = await http.get("/api/v1/customers/statistics");
    return res.data?.data;
  },

  async getProjects(customerId: number): Promise<CustomerProjectSummary[]> {
    const res = await http.get(`/api/v1/customers/${customerId}/projects`);
    return res.data?.data ?? [];
  },

  async getInvoices(customerId: number): Promise<CustomerInvoiceSummary[]> {
    const res = await http.get(`/api/v1/customers/${customerId}/invoices`);
    return res.data?.data ?? [];
  },

  async getContacts(customerId: number): Promise<CustomerContact[]> {
    const res = await http.get(`/api/v1/customers/${customerId}/contacts`);
    return res.data?.data ?? [];
  },

  async addContact(customerId: number, contact: CustomerContact): Promise<CustomerContact> {
    const res = await http.post(`/api/v1/customers/${customerId}/contacts`, contact);
    return res.data?.data;
  },

  async getNotes(customerId: number): Promise<CustomerNote[]> {
    const res = await http.get(`/api/v1/customers/${customerId}/notes`);
    return res.data?.data ?? [];
  },

  async addNote(customerId: number, note: CustomerNote): Promise<CustomerNote> {
    const res = await http.post(`/api/v1/customers/${customerId}/notes`, note);
    return res.data?.data;
  },
};
