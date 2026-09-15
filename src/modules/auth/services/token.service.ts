import { sessionService } from "@/shared/security/session.service";

export const tokenService = {
  getAccessToken() {
    return sessionService.getAccessToken();
  },

  setAccessToken(token: string) {
    sessionService.setAccessToken(token);
  },

  clear() {
    sessionService.clearSession();
  },
};
