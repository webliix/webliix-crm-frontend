import { http } from "@/shared/services/http";

export interface BackendNotificationItem {
  id: number;
  title: string;
  message: string;
  recipient: string;
  channel: string;
  status: string;
  referenceType?: string;
  referenceId?: number;
  createdAt: string;
}

export interface BackendNotificationPreference {
  userId?: number;
  emailEnabled?: boolean;
  smsEnabled?: boolean;
  whatsappEnabled?: boolean;
  pushEnabled?: boolean;
  ticketNotifications?: boolean;
  invoiceNotifications?: boolean;
  projectNotifications?: boolean;
  leadNotifications?: boolean;
  payrollNotifications?: boolean;
}

export const userNotificationApi = {
  async getNotifications(recipient?: string): Promise<BackendNotificationItem[]> {
    try {
      const endpoint = recipient ? `/api/v1/notifications/${recipient}` : `/api/v1/notifications`;
      const res = await http.get(endpoint);
      return res.data?.data ?? [];
    } catch {
      const fallbackRes = await http.get("/api/v1/notifications");
      return fallbackRes.data?.data ?? [];
    }
  },

  async markAsRead(id: number | string): Promise<void> {
    await http.put(`/api/v1/notifications/${id}/read`);
  },

  async markAllAsRead(recipient?: string): Promise<void> {
    const endpoint = recipient ? `/api/v1/notifications/${recipient}/read-all` : `/api/v1/notifications/read-all`;
    await http.put(endpoint);
  },

  async deleteNotification(id: number | string): Promise<void> {
    await http.delete(`/api/v1/notifications/${id}`);
  },

  async clearAllNotifications(recipient?: string): Promise<void> {
    const endpoint = recipient ? `/api/v1/notifications/clear/${recipient}` : `/api/v1/notifications/clear`;
    await http.delete(endpoint);
  },

  async getPreferences(userId: number = 1): Promise<BackendNotificationPreference> {
    try {
      const res = await http.get(`/api/v1/notifications/preferences/${userId}`);
      return res.data?.data ?? {
        emailEnabled: true,
        pushEnabled: true,
        leadNotifications: true,
        ticketNotifications: true,
        invoiceNotifications: true,
        projectNotifications: true,
        payrollNotifications: true,
      };
    } catch {
      return {
        emailEnabled: true,
        pushEnabled: true,
        leadNotifications: true,
        ticketNotifications: true,
        invoiceNotifications: true,
        projectNotifications: true,
        payrollNotifications: true,
      };
    }
  },

  async updatePreferences(payload: BackendNotificationPreference): Promise<BackendNotificationPreference> {
    try {
      const res = await http.put("/api/v1/notifications/preferences", payload);
      return res.data?.data ?? payload;
    } catch {
      return payload;
    }
  },
};
