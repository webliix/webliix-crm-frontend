import { http } from "@/shared/services/http";

export interface ExtendedUserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  bio?: string;
  timezone?: string;
  language?: string;
  twoFactorEnabled?: boolean;
  enabled?: boolean;
  roles?: string[];
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiTokenRecord {
  id: number;
  userId: number;
  name: string;
  tokenKey: string;
  scope: string;
  createdAt: string;
  expiresAt: string;
}

export const profileApi = {
  async getProfile(): Promise<ExtendedUserProfile> {
    const res = await http.get("/api/v1/auth/me");
    return res.data?.data;
  },

  async updateProfile(payload: Partial<ExtendedUserProfile>): Promise<ExtendedUserProfile> {
    const res = await http.put("/api/v1/auth/profile", payload);
    return res.data?.data;
  },

  async getApiTokens(): Promise<ApiTokenRecord[]> {
    const res = await http.get("/api/v1/api-tokens");
    return res.data?.data ?? [];
  },

  async createApiToken(payload: { name: string; scope: string }): Promise<ApiTokenRecord> {
    const res = await http.post("/api/v1/api-tokens", payload);
    return res.data?.data;
  },

  async deleteApiToken(id: number | string): Promise<void> {
    await http.delete(`/api/v1/api-tokens/${id}`);
  },

  async getUserAuditLogs(userId?: number): Promise<any[]> {
    try {
      const endpoint = userId ? `/api/v1/users/${userId}/activity` : "/api/v1/audit";
      const res = await http.get(endpoint);
      return res.data?.content ?? res.data ?? [];
    } catch {
      return [];
    }
  },
};
