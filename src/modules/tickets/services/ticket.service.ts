import { http } from "@/shared/services/http";
import type {
  TicketResponse,
  TicketCommentResponse,
  TicketDashboardResponse,
  CreateTicketRequest,
  UpdateTicketRequest,
  AssignTicketRequest,
  CreateTicketCommentRequest,
  PublicTicketRequest,
  PublicTicketDetailsResponse,
} from "../types/ticket.types";

export const ticketService = {
  // Authenticated endpoints
  async getAllTickets(params?: { projectId?: number; customerId?: number }): Promise<TicketResponse[]> {
    const res = await http.get("/api/v1/tickets", { params });
    return res.data?.data ?? [];
  },

  async getTicketsByProject(projectId: number): Promise<TicketResponse[]> {
    const res = await http.get(`/api/v1/tickets/project/${projectId}`);
    return res.data?.data ?? [];
  },

  async getTicket(id: number): Promise<TicketResponse> {
    const res = await http.get(`/api/v1/tickets/${id}`);
    return res.data?.data;
  },

  async createTicket(payload: CreateTicketRequest): Promise<TicketResponse> {
    const res = await http.post("/api/v1/tickets", payload);
    return res.data?.data;
  },

  async updateTicket(id: number, payload: UpdateTicketRequest): Promise<TicketResponse> {
    const res = await http.put(`/api/v1/tickets/${id}`, payload);
    return res.data?.data;
  },

  async assignTicket(id: number, payload: AssignTicketRequest): Promise<TicketResponse> {
    const res = await http.put(`/api/v1/tickets/${id}/assign`, payload);
    return res.data?.data;
  },

  async getComments(ticketId: number): Promise<TicketCommentResponse[]> {
    const res = await http.get(`/api/v1/tickets/${ticketId}/comments`);
    return res.data?.data ?? [];
  },

  async addComment(ticketId: number, payload: CreateTicketCommentRequest): Promise<TicketCommentResponse> {
    const res = await http.post(`/api/v1/tickets/${ticketId}/comments`, payload);
    return res.data?.data;
  },

  async getDashboard(): Promise<TicketDashboardResponse> {
    const res = await http.get("/api/v1/tickets/dashboard");
    return res.data?.data;
  },

  // Public Webliix Customer Helpdesk Chat
  async createPublicTicket(payload: PublicTicketRequest): Promise<TicketResponse> {
    const res = await http.post("/api/v1/public/tickets", payload);
    return res.data?.data;
  },

  async getPublicTicket(ticketNumber: string): Promise<PublicTicketDetailsResponse> {
    const res = await http.get(`/api/v1/public/tickets/${ticketNumber}`);
    return res.data?.data;
  },

  async addPublicComment(ticketNumber: string, payload: CreateTicketCommentRequest): Promise<TicketCommentResponse> {
    const res = await http.post(`/api/v1/public/tickets/${ticketNumber}/comments`, payload);
    return res.data?.data;
  },
};
