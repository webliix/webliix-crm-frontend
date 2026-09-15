import Box from "@mui/material/Box";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { AppStatCard } from "@/shared/components/ui/card";
import { CardSkeleton } from "@/shared/components/ui/feedback";
import { useTicketDashboard, useTickets } from "../hooks/useTickets";

export function TicketStatsHeader() {
  const { data: dashboard, isLoading: isDashLoading } = useTicketDashboard();
  const { data: tickets, isLoading: isTicketsLoading } = useTickets();

  if (isDashLoading || isTicketsLoading) {
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

  const allTickets = tickets || [];
  const openCount = dashboard?.openTickets ?? allTickets.filter((t) => t.status === "OPEN").length;
  const inProgressCount =
    dashboard?.inProgressTickets ?? allTickets.filter((t) => t.status === "IN_PROGRESS").length;
  const criticalCount =
    dashboard?.criticalTickets ?? allTickets.filter((t) => t.priority === "CRITICAL").length;
  const resolvedCount =
    dashboard?.resolvedTickets ?? allTickets.filter((t) => t.status === "RESOLVED").length;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
        gap: 2.5,
      }}
    >
      <AppStatCard
        title="Open Tickets"
        value={openCount}
        icon={<SupportAgentIcon sx={{ fontSize: 24 }} />}
        color="primary"
        subtitle="Awaiting response & triage"
      />

      <AppStatCard
        title="In Progress"
        value={inProgressCount}
        icon={<HourglassEmptyIcon sx={{ fontSize: 24 }} />}
        color="warning"
        subtitle="Under investigation"
      />

      <AppStatCard
        title="Critical Priority"
        value={criticalCount}
        icon={<ReportProblemOutlinedIcon sx={{ fontSize: 24 }} />}
        color="error"
        subtitle="Urgent SLA resolution"
      />

      <AppStatCard
        title="Resolved"
        value={resolvedCount}
        icon={<CheckCircleOutlineIcon sx={{ fontSize: 24 }} />}
        color="success"
        subtitle="Successfully closed issues"
      />
    </Box>
  );
}
