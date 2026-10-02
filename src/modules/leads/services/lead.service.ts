import { http } from "@/shared/services/http";
import type { CreateLeadRequest, ApiResponsePageLeadResponse, ApiResponseLeadResponse, ApiResponseVoid } from "@/api/generated";

export const leadService = {
  async getAll(page = 0, size = 20): Promise<ApiResponsePageLeadResponse> {
    const res = await http.get("/api/v1/leads", { params: { page, size } });
    return res.data;
  },

  async getById(id: number): Promise<ApiResponseLeadResponse> {
    const res = await http.get(`/api/v1/leads/${id}`);
    return res.data;
  },

  async create(data: CreateLeadRequest): Promise<ApiResponseLeadResponse> {
    const res = await http.post("/api/v1/leads", data);
    return res.data;
  },

  async update(id: number, data: CreateLeadRequest): Promise<ApiResponseLeadResponse> {
    const res = await http.put(`/api/v1/leads/${id}`, data);
    return res.data;
  },

  async delete(id: number): Promise<ApiResponseVoid> {
    const res = await http.delete(`/api/v1/leads/${id}`);
    return res.data;
  },

  async search(keyword: string, page = 0, size = 20): Promise<ApiResponsePageLeadResponse> {
    const res = await http.get("/api/v1/leads/search", { params: { keyword, page, size } });
    return res.data;
  },

  async convert(id: number): Promise<ApiResponseVoid> {
    const res = await http.post(`/api/v1/leads/${id}/convert`);
    return res.data;
  },
};

