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
  async getNotifications(recipient: string = "admin@webliix.in"): Promise<BackendNotificationItem[]> {
    try {
      const res = await http.get(`/api/v1/notifications/${recipient}`);
      return res.data?.data ?? [];
    } catch {
      const fallbackRes = await http.get("/api/v1/notifications");
      return fallbackRes.data?.data ?? [];
    }
  },

  async markAsRead(id: number | string): Promise<void> {
    await http.put(`/api/v1/notifications/${id}/read`);
  },

  async markAllAsRead(recipient: string = "admin@webliix.in"): Promise<void> {
    await http.put(`/api/v1/notifications/${recipient}/read-all`);
  },

  async deleteNotification(id: number | string): Promise<void> {
    await http.delete(`/api/v1/notifications/${id}`);
  },

  async clearAllNotifications(recipient: string = "admin@webliix.in"): Promise<void> {
    await http.delete(`/api/v1/notifications/clear/${recipient}`);
  },

  async getPreferences(userId: number = 1): Promise<BackendNotificationPreference> {
    const res = await http.get(`/api/v1/notifications/preferences/${userId}`);
    return res.data?.data ?? {};
  },

  async updatePreferences(payload: BackendNotificationPreference): Promise<BackendNotificationPreference> {
    const res = await http.put("/api/v1/notifications/preferences", payload);
    return res.data?.data ?? {};
  },
};
