import Box from "@mui/material/Box";
import { AppCard } from "@/shared/components/ui/card";
import { AppSearchInput } from "@/shared/components/ui/form";

interface Props {
  onSearch?: (value: string) => void;
}

export function LeadFilters({ onSearch }: Props) {
  return (
    <AppCard padding="sm" sx={{ p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 1 360px" } }}>
          <AppSearchInput
            placeholder="Search leads by company, contact, or email..."
            onSearchChange={onSearch}
            debounceMs={400}
          />
        </Box>
      </Box>
    </AppCard>
  );
}
