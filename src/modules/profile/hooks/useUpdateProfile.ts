import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/modules/auth/services/auth.service";
import { useAppDispatch } from "@/app/store/redux";
import { setUser } from "@/modules/auth/store/authSlice";
import { notificationService } from "@/shared/notifications/notification.service";
import type { UpdateProfilePayload } from "@/modules/auth/types/auth.types";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => authService.updateProfile(payload),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["current-user"], updatedUser);
      dispatch(setUser(updatedUser));
      notificationService.success("Profile updated successfully");
    },
    onError: (err: any) => {
      notificationService.error(err?.message || "Failed to update profile");
    },
  });
}
