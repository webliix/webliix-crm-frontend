import Skeleton, { type SkeletonProps } from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { AppCard } from "@/shared/components/ui/card";

export function AppSkeleton(props: SkeletonProps) {
  return (
    <Skeleton
      animation="wave"
      sx={{
        borderRadius: "4px",
        backgroundColor: "#e2e8f0",
        ...props.sx,
      }}
      {...props}
    />
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <Box sx={{ display: "flex", gap: 2, p: 2, bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton
            key={`th-${i}`}
            variant="rounded"
            width={`${100 / cols}%`}
            height={20}
            sx={{ borderRadius: "4px", bgcolor: "#e2e8f0" }}
          />
        ))}
      </Box>
      {Array.from({ length: rows }).map((_, r) => (
        <Box key={`tr-${r}`} sx={{ display: "flex", gap: 2, p: 2, borderBottom: "1px solid #f1f5f9" }}>
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton
              key={`td-${r}-${c}`}
              variant="rounded"
              width={`${100 / cols}%`}
              height={18}
              sx={{ borderRadius: "4px", bgcolor: "#f1f5f9" }}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
}

export function CardSkeleton() {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: "10px",
        border: "1px solid #e2e8f0",
        bgcolor: "#ffffff",
      }}
    >
      <CardContent sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 2.5 }}>
        <Skeleton
          variant="rounded"
          width={44}
          height={44}
          sx={{ borderRadius: "8px", flexShrink: 0, bgcolor: "#f1f5f9" }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Skeleton variant="text" width="45%" height={30} sx={{ bgcolor: "#f1f5f9" }} />
          <Skeleton variant="text" width="70%" height={18} sx={{ mt: 0.5, bgcolor: "#f1f5f9" }} />
        </Box>
      </CardContent>
    </Card>
  );
}

export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <AppCard padding="lg">
      <Skeleton variant="text" width="30%" height={28} sx={{ mb: 3, bgcolor: "#e2e8f0" }} />
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2.5 }}>
        {Array.from({ length: fields }).map((_, i) => (
          <Box key={`f-${i}`}>
            <Skeleton variant="text" width="25%" height={16} sx={{ mb: 1, bgcolor: "#f1f5f9" }} />
            <Skeleton variant="rounded" height={40} sx={{ borderRadius: "6px", bgcolor: "#f1f5f9" }} />
          </Box>
        ))}
      </Box>
    </AppCard>
  );
}
