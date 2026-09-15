import Box from "@mui/material/Box";
import BusinessIcon from "@mui/icons-material/Business";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { AppStatCard } from "@/shared/components/ui/card";
import { CardSkeleton } from "@/shared/components/ui/feedback";
import { useCustomerStatistics, useCustomers } from "../hooks/useCustomers";
import { formatCurrency } from "@/shared/utils/formatters";

export function CustomerStatsHeader() {
  const { data: stats, isLoading: isStatsLoading } = useCustomerStatistics();
  const { data: customers = [], isLoading: isListLoading } = useCustomers();

  if (isStatsLoading || isListLoading) {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
          gap: 2.5,
        }}
      >
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </Box>
    );
  }

  const totalCount = stats?.totalCustomers ?? customers.length;
  const activeCount =
    stats?.activeCustomers ?? customers.filter((c) => c.active !== false).length;
  const totalLtv =
    stats?.totalLifetimeValue ??
    customers.reduce((acc, c) => acc + (c.lifetimeValue || 0), 0);
  const newThisMonth = stats?.newCustomersThisMonth ?? customers.length;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
        gap: 2.5,
      }}
    >
      <AppStatCard
        title="Total Clients"
        value={totalCount}
        icon={<BusinessIcon sx={{ fontSize: 24 }} />}
        color="primary"
        subtitle="Registered enterprise accounts"
      />

      <AppStatCard
        title="Active Clients"
        value={activeCount}
        icon={<CheckCircleOutlineIcon sx={{ fontSize: 24 }} />}
        color="success"
        subtitle="Engaged & in production"
      />

      <AppStatCard
        title="Total Lifetime Value"
        value={formatCurrency(totalLtv)}
        icon={<MonetizationOnOutlinedIcon sx={{ fontSize: 24 }} />}
        color="warning"
        subtitle="Cumulative client billing"
      />

      <AppStatCard
        title="Recent Additions"
        value={newThisMonth}
        icon={<TrendingUpIcon sx={{ fontSize: 24 }} />}
        color="info"
        subtitle="New accounts onboarded"
      />
    </Box>
  );
}
