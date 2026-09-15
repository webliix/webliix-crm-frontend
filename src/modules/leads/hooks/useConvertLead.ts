import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leadService } from "@/modules/leads/services/lead.service";
import { leadQueryKeys } from "@/modules/leads/constants/queryKeys";
import { notificationService } from "@/shared/notifications/notification.service";

export function useConvertLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => leadService.convert(id),
    onSuccess: () => {
      notificationService.success("Lead converted successfully");
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.all });
    },
  });
}
