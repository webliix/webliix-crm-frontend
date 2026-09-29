import { http } from "@/shared/services/http";

export interface NewsletterSubscriber {
  id: number;
  email: string;
  sourcePage: string;
  subscribedAt: string;
  active: boolean;
  unsubscribedAt?: string;
}

export interface NewsletterBroadcastRequest {
  subject: string;
  content: string;
}

export const newsletterApi = {
  getSubscribers(page = 0, size = 20) {
    return http.get("/api/v1/newsletter/subscribers", { params: { page, size } });
  },

  sendBroadcast(data: NewsletterBroadcastRequest) {
    return http.post("/api/v1/newsletter/broadcast", data);
  },

  toggleStatus(id: number) {
    return http.put(`/api/v1/newsletter/subscribers/${id}/toggle-status`);
  },

  deleteSubscriber(id: number) {
    return http.delete(`/api/v1/newsletter/subscribers/${id}`);
  },
};
