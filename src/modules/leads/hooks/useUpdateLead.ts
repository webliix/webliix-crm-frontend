import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leadService } from "@/modules/leads/services/lead.service";
import { leadQueryKeys } from "@/modules/leads/constants/queryKeys";

export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof leadService.update>[1] }) =>
      leadService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.detail(variables.id) });
    },
  });
}
