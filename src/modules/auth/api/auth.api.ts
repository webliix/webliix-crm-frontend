import { http } from "@/shared/services/http";
import type { UpdateProfilePayload, ChangePasswordPayload } from "../types/auth.types";

export const authApi = {
  login(data: unknown) {
    return http.post("/api/v1/auth/login", data);
  },

  me() {
    return http.get("/api/v1/auth/me");
  },

  updateProfile(data: UpdateProfilePayload) {
    return http.put("/api/v1/auth/profile", data);
  },

  changePassword(data: ChangePasswordPayload) {
    return http.put("/api/v1/auth/change-password", data);
  },
};
