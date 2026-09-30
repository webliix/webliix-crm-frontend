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
  createdAt?: string;
  updatedAt?: string;
}

export const invoiceApi = {
  async getInvoices(page = 0, size = 20): Promise<{ content: InvoiceItem[]; totalElements: number }> {
    try {
      const res = await http.get(`/api/v1/invoices`, { params: { page, size } });
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
};
