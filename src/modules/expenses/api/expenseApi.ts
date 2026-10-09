import { http } from "@/shared/services/http";

export interface ExpenseItem {
  id: number;
  expenseNumber: string;
  title: string;
  category: "SALARY" | "HOSTING" | "SOFTWARE" | "MARKETING" | "OFFICE" | "TRAVEL" | "HARDWARE" | "OTHER" | string;
  description?: string;
  amount: number;
  expenseDate: string;
  paymentMethod: "CASH" | "BANK_TRANSFER" | "UPI" | "CHEQUE" | "CREDIT_CARD" | "DEBIT_CARD" | "PAYPAL" | "OTHER" | string;
  vendor?: string;
  status: "APPROVED" | "PENDING" | "REJECTED" | "PAID" | string;
  notes?: string;
  referenceNumber?: string;
  receiptUrl?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExpensePayload {
  title: string;
  category: string;
  description?: string;
  amount: number;
  expenseDate?: string;
  paymentMethod?: string;
  vendor?: string;
  status?: string;
  notes?: string;
  referenceNumber?: string;
  receiptUrl?: string;
}

export interface ExpenseStatistics {
  totalExpenses: number;
  monthToDateExpenses: number;
  approvedExpenses: number;
  pendingExpenses: number;
  totalCount: number;
  categoryBreakdown: Record<string, number>;
}

export const expenseApi = {
  async getExpenses(params?: {
    category?: string;
    status?: string;
    keyword?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
  }): Promise<{ content: ExpenseItem[]; totalElements: number }> {
    try {
      const res = await http.get("/api/v1/expenses", { params: { page: 0, size: 50, ...params } });
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

  async getExpense(id: number | string): Promise<ExpenseItem | null> {
    try {
      const res = await http.get(`/api/v1/expenses/${id}`);
      return res.data?.data ?? null;
    } catch {
      return null;
    }
  },

  async createExpense(payload: CreateExpensePayload): Promise<ExpenseItem | null> {
    const res = await http.post("/api/v1/expenses", payload);
    return res.data?.data ?? null;
  },

  async updateExpense(id: number | string, payload: Partial<CreateExpensePayload>): Promise<ExpenseItem | null> {
    const res = await http.put(`/api/v1/expenses/${id}`, payload);
    return res.data?.data ?? null;
  },

  async deleteExpense(id: number | string): Promise<boolean> {
    try {
      await http.delete(`/api/v1/expenses/${id}`);
      return true;
    } catch {
      return false;
    }
  },

  async updateExpenseStatus(id: number | string, status: string): Promise<ExpenseItem | null> {
    const res = await http.patch(`/api/v1/expenses/${id}/status`, { status });
    return res.data?.data ?? null;
  },

  async getExpenseStatistics(): Promise<ExpenseStatistics | null> {
    try {
      const res = await http.get("/api/v1/expenses/statistics");
      return res.data?.data ?? null;
    } catch {
      return null;
    }
  },
};
