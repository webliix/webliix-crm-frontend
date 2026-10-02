import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Chip from "@mui/material/Chip";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import { useDashboard } from "@/modules/dashboard/hooks/useDashboard";

export function DashboardOperationsOverview() {
  const { data } = useDashboard();

  if (!data) return null;

  const inv = data.invoices;
  const proj = data.projects;
  const tix = data.tickets;

  const totalInvoices = inv?.totalInvoices || 0;
  const paidInvoices = inv?.paidInvoices || 0;
  const pendingInvoices = inv?.pendingInvoices || 0;
  const overdueInvoices = inv?.overdueInvoices || 0;
  const invoicePaidPct = totalInvoices > 0 ? Math.round((paidInvoices / totalInvoices) * 100) : 0;

  const totalProjects = proj?.totalProjects || 0;
  const inProgressProjects = proj?.inProgressProjects || 0;
  const completedProjects = proj?.completedProjects || 0;
  const planningProjects = proj?.planningProjects || 0;
  const projectCompletedPct = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  const openTickets = tix?.openTickets || 0;
  const inProgressTickets = tix?.inProgressTickets || 0;
  const criticalTickets = tix?.criticalTickets || 0;
  const resolvedTickets = tix?.resolvedTickets || 0;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
        gap: 3,
      }}
    >
      {/* Financial Health */}
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardHeader
          avatar={<ReceiptLongOutlinedIcon color="success" />}
          title={<Typography variant="subtitle1" fontWeight="bold">Billing & Invoices</Typography>}
          subheader="Live collection & settlement rate"
          sx={{ pb: 1 }}
        />
        <Divider />
        <CardContent sx={{ display: "grid", gap: 2, pt: 2 }}>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
              <Typography variant="caption" color="text.secondary">
                Settlement Rate
              </Typography>
              <Typography variant="caption" fontWeight="bold" color="success.main">
                {invoicePaidPct}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={invoicePaidPct}
              color="success"
              sx={{ height: 6, borderRadius: 1 }}
            />
          </Box>

          <Divider />

          <Box sx={{ display: "grid", gap: 1.25 }}>
            <MetricRow label="Paid Invoices" value={paidInvoices} color="success" />
            <MetricRow label="Pending Invoices" value={pendingInvoices} color="warning" />
            <MetricRow label="Overdue Invoices" value={overdueInvoices} color="error" />
            <MetricRow label="Total Invoices" value={totalInvoices} />
          </Box>
        </CardContent>
      </Card>

      {/* Project Execution */}
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardHeader
          avatar={<AssignmentTurnedInOutlinedIcon color="info" />}
          title={<Typography variant="subtitle1" fontWeight="bold">Project Milestones</Typography>}
          subheader="Work delivery & phase execution"
          sx={{ pb: 1 }}
        />
        <Divider />
        <CardContent sx={{ display: "grid", gap: 2, pt: 2 }}>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
              <Typography variant="caption" color="text.secondary">
                Completion Rate
              </Typography>
              <Typography variant="caption" fontWeight="bold" color="info.main">
                {projectCompletedPct}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={projectCompletedPct}
              color="info"
              sx={{ height: 6, borderRadius: 1 }}
            />
          </Box>

          <Divider />

          <Box sx={{ display: "grid", gap: 1.25 }}>
            <MetricRow label="In-Progress" value={inProgressProjects} color="info" />
            <MetricRow label="Planning" value={planningProjects} color="default" />
            <MetricRow label="Completed" value={completedProjects} color="success" />
            <MetricRow label="Active Milestones" value={proj?.activeMilestones ?? 0} />
          </Box>
        </CardContent>
      </Card>

      {/* Support & SLA */}
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardHeader
          avatar={<SupportAgentOutlinedIcon color="warning" />}
          title={<Typography variant="subtitle1" fontWeight="bold">Support & Tickets</Typography>}
          subheader="Customer issues and SLA tracking"
          sx={{ pb: 1 }}
        />
        <Divider />
        <CardContent sx={{ display: "grid", gap: 2, pt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Queue Status
            </Typography>
            <Chip
              label={criticalTickets > 0 ? `${criticalTickets} CRITICAL` : "STABLE"}
              color={criticalTickets > 0 ? "error" : "success"}
              size="small"
              sx={{ fontWeight: "bold" }}
            />
          </Box>

          <Divider />

          <Box sx={{ display: "grid", gap: 1.25 }}>
            <MetricRow label="New / Open" value={openTickets} color="info" />
            <MetricRow label="In-Progress" value={inProgressTickets} color="warning" />
            <MetricRow label="Resolved" value={resolvedTickets} color="success" />
            <MetricRow label="Critical Priority" value={criticalTickets} color="error" />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

function MetricRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color?: "success" | "warning" | "error" | "info" | "default";
}) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      {color ? (
        <Chip label={String(value)} color={color} size="small" sx={{ fontWeight: "bold", minWidth: 28, height: 22 }} />
      ) : (
        <Typography variant="body2" fontWeight="bold" color="text.primary">
          {value}
        </Typography>
      )}
    </Box>
  );
}
