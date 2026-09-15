import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/modules/dashboard/services/dashboard.service";
import type { DashboardAggregatedData } from "../types/dashboard.types";

export function useDashboard() {
  return useQuery<DashboardAggregatedData>({
    queryKey: ["dashboard", "aggregated"],
    queryFn: () => dashboardService.getDashboardData(),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
