import { http } from "@/shared/services/http";

export interface InvoiceItem {
  id: number;
  invoiceNumber: string;
  customerId?: number;
  customerName?: string;
  customerCompanyName?: string;
  projectId?: number;
  projectName?: string;
  projectCode?: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  status: "PAID" | "PENDING" | "OVERDUE" | "DRAFT" | "CANCELLED" | "PARTIALLY_PAID" | "SENT" | string;
  issueDate?: string;
  dueDate?: string;
  notes?: string;
  customer?: {
    id: number;
    companyName: string;
    contactPerson: string;
    email?: string;
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

export interface InvoiceDashboardData {
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
}

function normalizeInvoice(raw: any): InvoiceItem {
  const total = Number(raw.totalAmount) || 0;
  const paid = Number(raw.paidAmount) || 0;
  const pending = raw.pendingAmount !== undefined && raw.pendingAmount !== null
    ? Number(raw.pendingAmount)
    : Math.max(0, total - paid);

  const customerCompanyName = raw.customerCompanyName || raw.customer?.companyName || "";
  const customerName = raw.customerName || raw.customer?.contactPerson || raw.customer?.name || "";
  const customerId = raw.customerId || raw.customer?.id;

  const projectName = raw.projectName || raw.project?.projectName || raw.project?.name || "";
  const projectCode = raw.projectCode || raw.project?.projectCode || "";
  const projectId = raw.projectId || raw.project?.id;

  return {
    ...raw,
    totalAmount: total,
    paidAmount: paid,
    pendingAmount: pending,
    customerId,
    customerName,
    customerCompanyName,
    projectId,
    projectName,
    projectCode,
    customer: raw.customer || (customerId ? {
      id: customerId,
      companyName: customerCompanyName || customerName || "Direct Client",
      contactPerson: customerName || customerCompanyName || "Authorized Contact",
      email: raw.customerEmail || raw.customer?.email || "",
    } : undefined),
    project: raw.project || (projectId ? {
      id: projectId,
      projectName: projectName || "General Service",
      projectCode: projectCode || "",
    } : undefined),
  };
}

export const invoiceApi = {
  async getInvoices(
    page = 0,
    size = 20,
    projectId?: number,
    customerId?: number
  ): Promise<{ content: InvoiceItem[]; totalElements: number }> {
    try {
      const params: Record<string, any> = { page, size };
      if (projectId !== undefined && projectId !== null && projectId !== (("" as unknown) as number)) {
        params.projectId = projectId;
      }
      if (customerId !== undefined && customerId !== null && customerId !== (("" as unknown) as number)) {
        params.customerId = customerId;
      }

      const res = await http.get(`/api/v1/invoices`, { params });
      const raw = res.data;
      let list: any[] = [];
      let total = 0;

      if (Array.isArray(raw)) {
        list = raw;
        total = raw.length;
      } else if (Array.isArray(raw?.data)) {
        list = raw.data;
        total = raw.data.length;
      } else if (Array.isArray(raw?.data?.content)) {
        list = raw.data.content;
        total = raw.data.totalElements ?? list.length;
      } else if (Array.isArray(raw?.content)) {
        list = raw.content;
        total = raw.totalElements ?? list.length;
      }

      let normalizedList = list.map(normalizeInvoice);

      // Resilient Fallback: If no invoices returned and no specific filters given,
      // try collecting invoices from projects to guarantee visibility even if global list query is restricted
      if (normalizedList.length === 0 && !projectId && !customerId) {
        try {
          const projRes = await http.get(`/api/v1/projects`, { params: { page: 0, size: 50 } });
          const projRaw = projRes.data;
          const projList: any[] = Array.isArray(projRaw) ? projRaw : (projRaw?.data?.content || projRaw?.content || projRaw?.data || []);
          if (projList.length > 0) {
            const projectInvoicesPromises = projList.map((p) =>
              http.get(`/api/v1/projects/${p.id}/invoices`).then((r) => {
                const data = r.data?.data ?? r.data;
                return Array.isArray(data) ? data : (data?.content || []);
              }).catch(() => [])
            );
            const settled = await Promise.all(projectInvoicesPromises);
            const collected = settled.flat();
            if (collected.length > 0) {
              const uniqueMap = new Map<number, any>();
              collected.forEach((inv) => {
                if (inv && inv.id && !uniqueMap.has(inv.id)) {
                  uniqueMap.set(inv.id, inv);
                }
              });
              normalizedList = Array.from(uniqueMap.values()).map(normalizeInvoice);
              total = normalizedList.length;
            }
          }
        } catch {
          // ignore fallback error
        }
      }

      return {
        content: normalizedList,
        totalElements: total || normalizedList.length,
      };
    } catch (err) {
      console.warn("Failed to fetch invoices, attempting project-based recovery:", err);
      try {
        const projRes = await http.get(`/api/v1/projects`, { params: { page: 0, size: 50 } });
        const projRaw = projRes.data;
        const projList: any[] = Array.isArray(projRaw) ? projRaw : (projRaw?.data?.content || projRaw?.content || projRaw?.data || []);
        if (projList.length > 0) {
          const settled = await Promise.all(
            projList.map((p) =>
              http.get(`/api/v1/projects/${p.id}/invoices`).then((r) => {
                const data = r.data?.data ?? r.data;
                return Array.isArray(data) ? data : (data?.content || []);
              }).catch(() => [])
            )
          );
          const collected = settled.flat();
          const uniqueMap = new Map<number, any>();
          collected.forEach((inv) => {
            if (inv && inv.id && !uniqueMap.has(inv.id)) {
              uniqueMap.set(inv.id, inv);
            }
          });
          const recovered = Array.from(uniqueMap.values()).map(normalizeInvoice);
          return { content: recovered, totalElements: recovered.length };
        }
      } catch {
        // ignore
      }
      return { content: [], totalElements: 0 };
    }
  },

  async getInvoice(id: number | string): Promise<InvoiceItem | null> {
    try {
      const res = await http.get(`/api/v1/invoices/${id}`);
      const raw = res.data?.data ?? res.data;
      return raw ? normalizeInvoice(raw) : null;
    } catch {
      return null;
    }
  },

  async createInvoice(payload: CreateInvoicePayload): Promise<InvoiceItem | null> {
    const res = await http.post(`/api/v1/invoices`, payload);
    const raw = res.data?.data ?? res.data;
    return raw ? normalizeInvoice(raw) : null;
  },

  async recordPayment(invoiceId: number | string, payload: RecordPaymentPayload): Promise<any> {
    const res = await http.post(`/api/v1/invoices/${invoiceId}/payments`, payload);
    return res.data?.data ?? res.data ?? null;
  },

  async getProjectBilling(projectId: number | string): Promise<ProjectBillingSummary | null> {
    try {
      const res = await http.get(`/api/v1/projects/${projectId}/billing`);
      const raw = res.data?.data ?? res.data;
      if (raw) {
        const rawInvoices = Array.isArray(raw.invoices) ? raw.invoices : [];
        return {
          ...raw,
          invoices: rawInvoices.map(normalizeInvoice),
          budget: Number(raw.budget) || 0,
          totalBilled: Number(raw.totalBilled) || 0,
          totalPaid: Number(raw.totalPaid) || 0,
          pendingDueOnInvoices: Number(raw.pendingDueOnInvoices) || 0,
          remainingProjectBalance: Number(raw.remainingProjectBalance) || 0,
          unbilledContractAmount: Number(raw.unbilledContractAmount) || 0,
          paymentSubmissions: Array.isArray(raw.paymentSubmissions) ? raw.paymentSubmissions : [],
        };
      }
    } catch (err) {
      console.warn("getProjectBilling failed, falling back to getProjectInvoices:", err);
    }

    // Resilient Fallback: fetch project invoices directly
    try {
      const invList = await invoiceApi.getProjectInvoices(projectId);
      if (invList && invList.length > 0) {
        const totalBilled = invList.reduce((sum, i) => sum + (i.totalAmount || 0), 0);
        const totalPaid = invList.reduce((sum, i) => sum + (i.paidAmount || 0), 0);
        const pendingDue = invList.reduce((sum, i) => sum + (i.pendingAmount || 0), 0);
        return {
          projectId: Number(projectId),
          projectCode: invList[0]?.projectCode || "",
          projectName: invList[0]?.projectName || "",
          customerId: invList[0]?.customerId || 0,
          customerName: invList[0]?.customerName || "",
          customerCompanyName: invList[0]?.customerCompanyName || "",
          budget: 0,
          totalBilled,
          totalPaid,
          pendingDueOnInvoices: pendingDue,
          remainingProjectBalance: pendingDue,
          unbilledContractAmount: 0,
          invoices: invList,
          paymentSubmissions: [],
        };
      }
    } catch {
      // ignore
    }

    return null;
  },

  async getProjectInvoices(projectId: number | string): Promise<InvoiceItem[]> {
    try {
      const res = await http.get(`/api/v1/projects/${projectId}/invoices`);
      const raw = res.data?.data ?? res.data;
      const list = Array.isArray(raw) ? raw : (raw?.content || []);
      return list.map(normalizeInvoice);
    } catch {
      return [];
    }
  },

  async updateInvoice(
    id: number | string,
    payload: Partial<CreateInvoicePayload> & { status?: string; paidAmount?: number }
  ): Promise<InvoiceItem | null> {
    const res = await http.put(`/api/v1/invoices/${id}`, payload);
    const raw = res.data?.data ?? res.data;
    return raw ? normalizeInvoice(raw) : null;
  },

  async deleteInvoice(id: number | string): Promise<boolean> {
    try {
      await http.delete(`/api/v1/invoices/${id}`);
      return true;
    } catch {
      return false;
    }
  },

  async getDashboard(): Promise<InvoiceDashboardData | null> {
    try {
      const res = await http.get(`/api/v1/invoices/dashboard`);
      const raw = res.data?.data ?? res.data;
      if (!raw) return null;
      const totalAmount = Number(raw.totalAmount ?? raw.totalRevenue) || 0;
      const paidAmount = Number(raw.paidAmount) || 0;
      const pendingAmount = raw.pendingAmount !== undefined && raw.pendingAmount !== null
        ? Number(raw.pendingAmount)
        : Math.max(0, totalAmount - paidAmount);

      return {
        totalInvoices: Number(raw.totalInvoices) || 0,
        paidInvoices: Number(raw.paidInvoices) || 0,
        pendingInvoices: Number(raw.pendingInvoices) || 0,
        overdueInvoices: Number(raw.overdueInvoices) || 0,
        totalAmount,
        paidAmount,
        pendingAmount,
      };
    } catch {
      return null;
    }
  },
};
