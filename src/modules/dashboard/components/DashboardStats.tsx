import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
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
          gap: 3,
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
        gap: 3,
      }}
    >
      <Card
        variant="outlined"
        sx={{
          borderRadius: 2,
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": { borderColor: "success.main", boxShadow: 1, transform: "translateY(-2px)" },
        }}
        onClick={() => navigate("/invoices")}
      >
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2.5, p: 2.5 }}>
          <AccountBalanceWalletOutlinedIcon color="success" sx={{ fontSize: 38 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold" color="success.main">
              {revenueValue}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Total Revenue ({paidInvoicesCount} paid)
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Card
        variant="outlined"
        sx={{
          borderRadius: 2,
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": { borderColor: "primary.main", boxShadow: 1, transform: "translateY(-2px)" },
        }}
        onClick={() => navigate("/leads")}
      >
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2.5, p: 2.5 }}>
          <PeopleOutlineIcon color="primary" sx={{ fontSize: 38 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold" color="primary.main">
              {data.totalLeads ?? 0}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Leads Pipeline & Prospects
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Card
        variant="outlined"
        sx={{
          borderRadius: 2,
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": { borderColor: "info.main", boxShadow: 1, transform: "translateY(-2px)" },
        }}
        onClick={() => navigate("/projects")}
      >
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2.5, p: 2.5 }}>
          <AssignmentOutlinedIcon color="info" sx={{ fontSize: 38 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold" color="info.main">
              {inProgressProjects}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Active Projects ({totalTasks} tasks)
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Card
        variant="outlined"
        sx={{
          borderRadius: 2,
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": { borderColor: "warning.main", boxShadow: 1, transform: "translateY(-2px)" },
        }}
        onClick={() => navigate("/customers")}
      >
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2.5, p: 2.5 }}>
          <BusinessOutlinedIcon color="warning" sx={{ fontSize: 38 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold" color="warning.main">
              {totalCustomers}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Customer Base ({activeCustomers} active)
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
