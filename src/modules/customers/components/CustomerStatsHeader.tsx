import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import BusinessIcon from "@mui/icons-material/Business";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { CardSkeleton } from "@/shared/components/ui/feedback";
import { useCustomerStatistics, useCustomers } from "../hooks/useCustomers";
import { formatCurrency } from "@/shared/utils/formatters";
import { tokens } from "@/theme/tokens";

export function CustomerStatsHeader() {
  const { data: stats, isLoading: isStatsLoading } = useCustomerStatistics();
  const { data: customers = [], isLoading: isListLoading } = useCustomers();

  if (isStatsLoading || isListLoading) {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
          gap: 2,
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

  const statItems = [
    {
      title: "Total Clients",
      value: totalCount,
      subtitle: "Enterprise portfolio accounts",
      icon: <BusinessIcon sx={{ fontSize: 24 }} />,
      bgColor: tokens.colors.primary[50],
      iconColor: tokens.colors.primary.main,
    },
    {
      title: "Active Clients",
      value: activeCount,
      subtitle: "Active contracts & retained",
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 24 }} />,
      bgColor: tokens.colors.success[50],
      iconColor: tokens.colors.success.main,
    },
    {
      title: "Lifetime Billing",
      value: formatCurrency(totalLtv),
      subtitle: "Cumulative account revenue",
      icon: <MonetizationOnOutlinedIcon sx={{ fontSize: 24 }} />,
      bgColor: tokens.colors.warning[50],
      iconColor: tokens.colors.warning.main,
    },
    {
      title: "New Onboarded",
      value: newThisMonth,
      subtitle: "Recently added clients",
      icon: <TrendingUpIcon sx={{ fontSize: 24 }} />,
      bgColor: tokens.colors.info[50],
      iconColor: tokens.colors.info.main,
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
        gap: 2,
      }}
    >
      {statItems.map((item, idx) => (
        <Card
          key={idx}
          variant="outlined"
          sx={{
            borderRadius: 2,
            bgcolor: "background.paper",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: tokens.colors.primary.main,
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
              transform: "translateY(-1px)",
            },
          }}
        >
          <CardContent sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: item.bgColor,
                color: item.iconColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {item.icon}
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="h5" fontWeight={800} color={tokens.colors.secondary[900]} lineHeight={1.2}>
                {item.value}
              </Typography>
              <Typography variant="body2" fontWeight={700} color={tokens.colors.secondary[700]} sx={{ mt: 0.25 }} noWrap>
                {item.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }} noWrap>
                {item.subtitle}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
