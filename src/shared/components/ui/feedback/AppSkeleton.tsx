import Skeleton, { type SkeletonProps } from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { AppCard } from "@/shared/components/ui/card";
import { tokens } from "@/theme/tokens";

export function AppSkeleton(props: SkeletonProps) {
  return (
    <Skeleton
      animation="wave"
      sx={{
        borderRadius: tokens.borderRadius.xs,
        backgroundColor: tokens.colors.secondary[100],
        ...props.sx,
      }}
      {...props}
    />
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <Box sx={{ display: "flex", gap: 2, p: 2, bgcolor: tokens.colors.secondary[50], borderBottom: 1, borderColor: "divider" }}>
        {Array.from({ length: cols }).map((_, i) => (
          <AppSkeleton key={`th-${i}`} variant="text" width={`${100 / cols}%`} height={24} />
        ))}
      </Box>
      {Array.from({ length: rows }).map((_, r) => (
        <Box key={`tr-${r}`} sx={{ display: "flex", gap: 2, p: 2, borderBottom: 1, borderColor: "divider" }}>
          {Array.from({ length: cols }).map((_, c) => (
            <AppSkeleton key={`td-${r}-${c}`} variant="text" width={`${100 / cols}%`} height={20} />
          ))}
        </Box>
      ))}
    </Box>
  );
}

export function CardSkeleton() {
  return (
    <AppCard>
      <AppSkeleton variant="text" width="40%" height={20} />
      <AppSkeleton variant="text" width="60%" height={40} sx={{ my: 1 }} />
      <AppSkeleton variant="text" width="30%" height={16} />
    </AppCard>
  );
}

export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <AppCard padding="lg">
      <AppSkeleton variant="text" width="30%" height={28} sx={{ mb: 3 }} />
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2.5 }}>
        {Array.from({ length: fields }).map((_, i) => (
          <Box key={`f-${i}`}>
            <AppSkeleton variant="text" width="25%" height={16} sx={{ mb: 1 }} />
            <AppSkeleton variant="rounded" height={40} />
          </Box>
        ))}
      </Box>
    </AppCard>
  );
}
