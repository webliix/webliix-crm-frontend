import { authApi } from "@/modules/auth/api/auth.api";
import { sessionService } from "@/shared/security/session.service";
import type { UpdateProfilePayload, ChangePasswordPayload } from "../types/auth.types";

export const authService = {
  async login(payload: unknown) {
    const response = await authApi.login(payload);
    return response.data;
  },

  async register(payload: unknown) {
    const response = await authApi.register(payload);
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await authApi.forgotPassword(email);
    return response.data;
  },

  async verifyResetOtp(email: string, otp: string) {
    const response = await authApi.verifyResetOtp(email, otp);
    return response.data?.data ? response.data.data : response.data;
  },

  async resetPassword(payload: { email: string; resetToken: string; newPassword: string }) {
    const response = await authApi.resetPassword(payload);
    return response.data;
  },

  async verifyEmail(email: string, otp: string) {
    const response = await authApi.verifyEmail(email, otp);
    return response.data;
  },

  async resendVerificationOtp(email: string) {
    const response = await authApi.resendVerificationOtp(email);
    return response.data;
  },

  async me() {
    const response = await authApi.me();
    return response.data?.data ? response.data.data : response.data;
  },

  async updateProfile(payload: UpdateProfilePayload) {
    const response = await authApi.updateProfile(payload);
    return response.data?.data ? response.data.data : response.data;
  },

  async changePassword(payload: ChangePasswordPayload) {
    const response = await authApi.changePassword(payload);
    return response.data;
  },

  logout() {
    sessionService.clearSession();
  },
};
