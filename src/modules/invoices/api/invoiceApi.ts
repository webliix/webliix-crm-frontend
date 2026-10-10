import { http } from "@/shared/services/http";

export interface InvoiceItem {
  id: number;
  invoiceNumber: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  status: "PAID" | "PENDING" | "OVERDUE" | "DRAFT" | "CANCELLED" | string;
  issueDate?: string;
  dueDate?: string;
  notes?: string;
  customer?: {
    id: number;
    companyName: string;
    contactPerson: string;
    email: string;
  };
  project?: {
    id: number;
    projectName: string;
    projectCode: string;
  };
  subtotal?: number;
  taxAmount?: number;
  discountAmount?: number;
  items?: {
    id?: number;
    itemName: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    totalPrice?: number;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInvoicePayload {
  customerId?: number;
  projectId?: number;
  issueDate?: string;
  dueDate?: string;
  taxAmount?: number;
  discountAmount?: number;
  notes?: string;
  items: {
    itemName: string;
    description?: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface RecordPaymentPayload {
  amount: number;
  paymentDate?: string;
  paymentMethod?: string;
  referenceNumber?: string;
  notes?: string;
}

export interface ProjectBillingSummary {
  projectId: number;
  projectCode: string;
  projectName: string;
  customerId: number;
  customerName: string;
  customerCompanyName: string;
  budget: number;
  totalBilled: number;
  totalPaid: number;
  pendingDueOnInvoices: number;
  remainingProjectBalance: number;
  unbilledContractAmount: number;
  invoices: InvoiceItem[];
  paymentSubmissions: any[];
}

export const invoiceApi = {
  async getInvoices(page = 0, size = 20, projectId?: number, customerId?: number): Promise<{ content: InvoiceItem[]; totalElements: number }> {
    try {
      const res = await http.get(`/api/v1/invoices`, { params: { page, size, projectId, customerId } });
      const data = res.data?.data;
      if (Array.isArray(data)) {
        return { content: data, totalElements: data.length };
      }
      return {
        content: data?.content ?? [],
        totalElements: data?.totalElements ?? 0,
      };
    } catch {
      return { content: [], totalElements: 0 };
    }
  },

  async getInvoice(id: number | string): Promise<InvoiceItem | null> {
    try {
      const res = await http.get(`/api/v1/invoices/${id}`);
      return res.data?.data ?? null;
    } catch {
      return null;
    }
  },

  async createInvoice(payload: CreateInvoicePayload): Promise<InvoiceItem | null> {
    const res = await http.post(`/api/v1/invoices`, payload);
    return res.data?.data ?? null;
  },

  async recordPayment(invoiceId: number | string, payload: RecordPaymentPayload): Promise<any> {
    const res = await http.post(`/api/v1/invoices/${invoiceId}/payments`, payload);
    return res.data?.data ?? null;
  },

  async getProjectBilling(projectId: number | string): Promise<ProjectBillingSummary | null> {
    try {
      const res = await http.get(`/api/v1/projects/${projectId}/billing`);
      return res.data?.data ?? null;
    } catch {
      return null;
    }
  },

  async getProjectInvoices(projectId: number | string): Promise<InvoiceItem[]> {
    try {
      const res = await http.get(`/api/v1/projects/${projectId}/invoices`);
      const data = res.data?.data;
      if (Array.isArray(data)) return data;
      return data?.content ?? [];
    } catch {
      return [];
    }
  },

  async updateInvoice(
    id: number | string,
    payload: Partial<CreateInvoicePayload> & { status?: string; paidAmount?: number }
  ): Promise<InvoiceItem | null> {
    const res = await http.put(`/api/v1/invoices/${id}`, payload);
    return res.data?.data ?? null;
  },

  async deleteInvoice(id: number | string): Promise<boolean> {
    try {
      await http.delete(`/api/v1/invoices/${id}`);
      return true;
    } catch {
      return false;
    }
  },
};

