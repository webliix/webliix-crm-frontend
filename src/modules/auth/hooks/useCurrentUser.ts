import { useQuery } from "@tanstack/react-query";
import { authService } from "@/modules/auth/services/auth.service";
import type { CurrentUser } from "@/modules/auth/types/auth.types";

export function useCurrentUser() {
  return useQuery<CurrentUser>({
    queryKey: ["current-user"],
    queryFn: async () => {
      return await authService.me();
    },
    staleTime: 5 * 60 * 1000,
  });
}
