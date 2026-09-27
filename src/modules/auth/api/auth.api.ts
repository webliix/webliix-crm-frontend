import { http } from "@/shared/services/http";
import type { UpdateProfilePayload, ChangePasswordPayload } from "../types/auth.types";

export const authApi = {
  login(data: unknown) {
    return http.post("/api/v1/auth/login", data);
  },

  register(data: unknown) {
    return http.post("/api/v1/auth/register", data);
  },

  forgotPassword(email: string) {
    return http.post("/api/v1/auth/forgot-password", { email });
  },

  verifyResetOtp(email: string, otp: string) {
    return http.post("/api/v1/auth/verify-reset-otp", { email, otp });
  },

  resetPassword(data: { email: string; resetToken: string; newPassword: string }) {
    return http.post("/api/v1/auth/reset-password", data);
  },

  verifyEmail(email: string, otp: string) {
    return http.post("/api/v1/auth/verify-email", { email, otp });
  },

  resendVerificationOtp(email: string) {
    return http.post("/api/v1/auth/resend-verification-otp", { email });
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
