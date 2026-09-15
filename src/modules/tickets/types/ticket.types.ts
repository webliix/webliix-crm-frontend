export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | "REOPENED";

export type TicketCategory =
  | "BUG"
  | "FEATURE_REQUEST"
  | "SUPPORT"
  | "BILLING"
  | "TECHNICAL"
  | "GENERAL_INQUIRY";

export interface TicketResponse {
  id: number;
  ticketNumber: string;
  title: string;
  description?: string;
  customerId?: number;
  customerName?: string;
  projectId?: number;
  projectName?: string;
  createdBy?: string;
  assignedToId?: number;
  assignedToName?: string;
  priority: TicketPriority;
  status: TicketStatus;
  category: TicketCategory;
  dueDate?: string;
  closedAt?: string;
  slaHours?: number;
  responseTime?: number;
  resolutionTime?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TicketCommentResponse {
  id: number;
  ticketId: number;
  comment: string;
  commentedBy: string;
  createdAt: string;
}

export interface TicketAttachmentResponse {
  id: number;
  ticketId: number;
  fileName: string;
  filePath: string;
  fileType: string;
  uploadedAt: string;
}

export interface TicketDashboardResponse {
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  criticalTickets: number;
  overdueTickets: number;
}

export interface CreateTicketRequest {
  title: string;
  description?: string;
  customerId?: number;
  projectId?: number;
  createdBy?: string;
  assignedToId?: number;
  priority: TicketPriority;
  status: TicketStatus;
  category: TicketCategory;
  dueDate?: string;
  slaHours?: number;
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  customerId?: number;
  projectId?: number;
  createdBy?: string;
  assignedToId?: number;
  priority?: TicketPriority;
  status?: TicketStatus;
  category?: TicketCategory;
  dueDate?: string;
  slaHours?: number;
}

export interface AssignTicketRequest {
  employeeId: number;
}

export interface CreateTicketCommentRequest {
  comment: string;
  commentedBy: string;
}

export interface PublicTicketRequest {
  name: string;
  email: string;
  phone?: string;
  title: string;
  description: string;
  category?: TicketCategory;
}

export interface PublicTicketDetailsResponse {
  id: number;
  ticketNumber: string;
  title: string;
  description?: string;
  customerName?: string;
  customerEmail?: string;
  createdBy?: string;
  priority: TicketPriority;
  status: TicketStatus;
  category: TicketCategory;
  createdAt: string;
  updatedAt: string;
  comments: TicketCommentResponse[];
}
