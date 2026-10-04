import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leadService } from "@/modules/leads/services/lead.service";
import { leadQueryKeys } from "@/modules/leads/constants/queryKeys";
import { notificationService } from "@/shared/notifications/notification.service";

export function useConvertLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => leadService.convert(id),
    onSuccess: () => {
      notificationService.success("Lead successfully converted into an active customer account");
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Failed to convert lead";
      notificationService.error(msg);
    },
  });
}
