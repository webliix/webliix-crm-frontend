import { useQuery } from "@tanstack/react-query";
import { leadService } from "@/modules/leads/services/lead.service";
import { leadQueryKeys } from "@/modules/leads/constants/queryKeys";
import { useDataTable } from "@/shared/hooks/useDataTable";
import { mapLeadPage } from "@/modules/leads/utils/mapLeadPage";

export function useLeads() {
  const table = useDataTable();

  const queryKey = leadQueryKeys.list(table.page, table.size, table.search) as readonly unknown[];

  const query = (useQuery as any)({
    queryKey,
    queryFn: () => {
      if (table.search && table.search.trim().length > 0) {
        return leadService.search(table.search, table.page, table.size);
      }

      return leadService.getAll(table.page, table.size);
    },
    keepPreviousData: true,
  }) as any;

  const mapped = mapLeadPage(query.data);

  return {
    ...query,
    ...table,
    rows: mapped.rows,
    total: mapped.total,
    pages: mapped.pages,
  };
}
