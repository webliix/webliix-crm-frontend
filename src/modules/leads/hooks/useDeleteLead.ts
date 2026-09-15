import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leadService } from "@/modules/leads/services/lead.service";
import { leadQueryKeys } from "@/modules/leads/constants/queryKeys";

export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => leadService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.all });
    },
  });
}
