import { errorHandler } from "./errorHandler";
import type { AppDispatch } from "@/app/store";
import { logout } from "@/modules/auth/store/authSlice";
import { sessionService } from "@/shared/security/session.service";

export function handleUnauthorized(dispatch: AppDispatch, navigate?: (path: string) => void): void {
  sessionService.clearSession();

  dispatch(logout());

  if (navigate) {
    navigate("/login");
  }

  errorHandler.handle("Session expired. Please log in again.");
}
