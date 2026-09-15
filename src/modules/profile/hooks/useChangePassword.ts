import { useMutation } from "@tanstack/react-query";
import { authService } from "@/modules/auth/services/auth.service";
import { notificationService } from "@/shared/notifications/notification.service";
import type { ChangePasswordPayload } from "@/modules/auth/types/auth.types";

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => authService.changePassword(payload),
    onSuccess: () => {
      notificationService.success("Password changed successfully");
    },
    onError: (err: any) => {
      notificationService.error(err?.message || "Failed to change password");
    },
  });
}
