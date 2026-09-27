import axios from "axios";
import { env } from "@/config/env";
import { sessionService } from "@/shared/security/session.service";
import { mapApiError } from "@/shared/errors/mapApiError";
import { errorHandler } from "@/shared/errors/errorHandler";

const cleanBaseUrl = (env.apiBaseUrl || "https://webliix-crm-backend.onrender.com").trim().replace(/\/+$/, "");

export const http = axios.create({
  baseURL: cleanBaseUrl,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = sessionService.getAccessToken();
  if (token) {
    (config.headers as any) = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await sessionService.refresh();
        const token = sessionService.getAccessToken();
        if (token) {
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${token}`,
          };
        }
        return http(originalRequest);
      } catch {
        sessionService.clearSession();
      }
    }

    const appError = mapApiError(error);
    errorHandler.handle(appError);
    return Promise.reject(appError);
  },
);
