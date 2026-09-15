import { useQuery } from "@tanstack/react-query";
import { leadService } from "@/modules/leads/services/lead.service";
import { leadQueryKeys } from "@/modules/leads/constants/queryKeys";

export function useLead(id: number) {
  return useQuery({
    queryKey: id ? leadQueryKeys.detail(id) : ["lead", "unknown"],
    queryFn: () => leadService.getById(id),
    enabled: !!id,
  });
}
