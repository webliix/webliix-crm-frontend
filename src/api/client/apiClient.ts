import { OpenAPI } from "@/api/generated";
import { env } from "@/config/env";
import { sessionService } from "@/shared/security/session.service";

OpenAPI.BASE = env.apiBaseUrl;
OpenAPI.TOKEN = async () => {
  if (sessionService.isExpired()) {
    try {
      await sessionService.refresh();
    } catch {
      sessionService.clearSession();
      return "";
    }
  }

  return sessionService.getAccessToken() ?? "";
};
