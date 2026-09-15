import { authApi } from "@/modules/auth/api/auth.api";
import { AuthControllerService } from "@/api/generated";
import { sessionService } from "@/shared/security/session.service";
import type { UpdateProfilePayload, ChangePasswordPayload } from "../types/auth.types";

export const authService = {
  login(payload: unknown) {
    return AuthControllerService.login1(payload as any);
  },

  async me() {
    const response = await authApi.me();
    // response.data can be ApiResponse<UserProfileResponse> or direct payload
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
