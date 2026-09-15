import Box from "@mui/material/Box";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { AppStatCard } from "@/shared/components/ui/card";
import { CardSkeleton, ErrorState } from "@/shared/components/ui/feedback";
import { useDashboard } from "@/modules/dashboard/hooks/useDashboard";
import { formatCurrency } from "@/shared/utils/formatters";
import { useNavigate } from "react-router-dom";

export function DashboardStats() {
  const { data, isLoading, isError, refetch } = useDashboard();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
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

  if (isError || !data) {
    return <ErrorState message="Unable to load operational dashboard metrics" onRetry={refetch} />;
  }

  const revenueValue = data.invoices?.totalRevenue
    ? formatCurrency(data.invoices.totalRevenue)
    : "₹0";
  const paidInvoicesCount = data.invoices?.paidInvoices ?? 0;
  const inProgressProjects = data.projects?.inProgressProjects ?? 0;
  const totalTasks = data.projects?.totalTasks ?? 0;
  const totalCustomers = data.customers?.totalCustomers ?? 0;
  const activeCustomers = data.customers?.activeCustomers ?? 0;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: 2.5,
      }}
    >
      <AppStatCard
        title="Total Revenue"
        value={revenueValue}
        icon={<AccountBalanceWalletOutlinedIcon sx={{ fontSize: 24 }} />}
        color="success"
        subtitle={`${paidInvoicesCount} paid invoices settled`}
      />

      <AppStatCard
        title="Leads Pipeline"
        value={data.totalLeads}
        icon={<PeopleOutlineIcon sx={{ fontSize: 24 }} />}
        color="primary"
        subtitle="Prospects & active inquiries"
        onClick={() => navigate("/leads")}
      />

      <AppStatCard
        title="Active Projects"
        value={inProgressProjects}
        icon={<AssignmentOutlinedIcon sx={{ fontSize: 24 }} />}
        color="info"
        subtitle={`${totalTasks} tasks in delivery`}
      />

      <AppStatCard
        title="Customer Base"
        value={totalCustomers}
        icon={<BusinessOutlinedIcon sx={{ fontSize: 24 }} />}
        color="warning"
        subtitle={`${activeCustomers} active accounts`}
      />
    </Box>
  );
}
