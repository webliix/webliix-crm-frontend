import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leadService } from "@/modules/leads/services/lead.service";
import { leadQueryKeys } from "@/modules/leads/constants/queryKeys";
import { notificationService } from "@/shared/notifications/notification.service";

export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => leadService.delete(id),
    onSuccess: () => {
      notificationService.success("Lead deleted successfully");
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.all });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Failed to delete lead";
      notificationService.error(msg);
    },
  });
}
