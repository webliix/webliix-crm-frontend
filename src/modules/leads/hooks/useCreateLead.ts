import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leadService } from "@/modules/leads/services/lead.service";
import { leadQueryKeys } from "@/modules/leads/constants/queryKeys";

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof leadService.create>[0]) =>
      leadService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.all });
    },
  });
}
