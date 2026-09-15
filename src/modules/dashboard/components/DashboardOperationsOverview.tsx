import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import { AppCard } from "@/shared/components/ui/card";
import { AppStatusChip } from "@/shared/components/ui/feedback";
import { useDashboard } from "@/modules/dashboard/hooks/useDashboard";
import { tokens } from "@/theme/tokens";

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
        gap: 2.5,
      }}
    >
      {/* Financial Health */}
      <AppCard
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ReceiptLongOutlinedIcon sx={{ color: tokens.colors.success.main, fontSize: 20 }} />
            <span>Billing & Invoices</span>
          </Box>
        }
        subtitle="Live payment collection & settlement"
        padding="lg"
      >
        <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
              <Typography variant="caption" color="text.secondary">
                Settlement Rate
              </Typography>
              <Typography variant="caption" fontWeight={700} color={tokens.colors.success.main}>
                {invoicePaidPct}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={invoicePaidPct}
              sx={{
                height: 6,
                borderRadius: tokens.borderRadius.full,
                bgcolor: tokens.colors.secondary[100],
                "& .MuiLinearProgress-bar": {
                  bgcolor: tokens.colors.success.main,
                },
              }}
            />
          </Box>

          <Divider />

          <Box sx={{ display: "grid", gap: 1.25 }}>
            <MetricRow label="Paid Invoices" value={paidInvoices} chipType="success" />
            <MetricRow label="Pending Invoices" value={pendingInvoices} chipType="warning" />
            <MetricRow label="Overdue Invoices" value={overdueInvoices} chipType="error" />
            <MetricRow label="Total Invoices" value={totalInvoices} />
          </Box>
        </Box>
      </AppCard>

      {/* Project Execution */}
      <AppCard
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AssignmentTurnedInOutlinedIcon sx={{ color: tokens.colors.info.main, fontSize: 20 }} />
            <span>Project Milestones</span>
          </Box>
        }
        subtitle="Work delivery & task completion"
        padding="lg"
      >
        <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
              <Typography variant="caption" color="text.secondary">
                Completion Rate
              </Typography>
              <Typography variant="caption" fontWeight={700} color={tokens.colors.info.main}>
                {projectCompletedPct}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={projectCompletedPct}
              sx={{
                height: 6,
                borderRadius: tokens.borderRadius.full,
                bgcolor: tokens.colors.secondary[100],
                "& .MuiLinearProgress-bar": {
                  bgcolor: tokens.colors.info.main,
                },
              }}
            />
          </Box>

          <Divider />

          <Box sx={{ display: "grid", gap: 1.25 }}>
            <MetricRow label="In-Progress" value={inProgressProjects} chipType="info" />
            <MetricRow label="Planning" value={planningProjects} chipType="neutral" />
            <MetricRow label="Completed" value={completedProjects} chipType="success" />
            <MetricRow label="Active Milestones" value={proj?.activeMilestones ?? 0} />
          </Box>
        </Box>
      </AppCard>

      {/* Support & SLA */}
      <AppCard
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SupportAgentOutlinedIcon sx={{ color: tokens.colors.warning.main, fontSize: 20 }} />
            <span>Support & Tickets</span>
          </Box>
        }
        subtitle="Customer issues and SLA tracking"
        padding="lg"
      >
        <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="caption" color="text.secondary">
              Open Queue
            </Typography>
            <AppStatusChip
              status={criticalTickets > 0 ? `${criticalTickets} CRITICAL` : "STABLE"}
              statusType={criticalTickets > 0 ? "error" : "success"}
            />
          </Box>

          <Divider />

          <Box sx={{ display: "grid", gap: 1.25 }}>
            <MetricRow label="New / Open" value={openTickets} chipType="info" />
            <MetricRow label="In-Progress" value={inProgressTickets} chipType="warning" />
            <MetricRow label="Resolved" value={resolvedTickets} chipType="success" />
            <MetricRow label="Critical Priority" value={criticalTickets} chipType="error" />
          </Box>
        </Box>
      </AppCard>
    </Box>
  );
}

function MetricRow({
  label,
  value,
  chipType,
}: {
  label: string;
  value: number | string;
  chipType?: "success" | "warning" | "error" | "info" | "neutral" | "primary";
}) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      {chipType ? (
        <AppStatusChip status={String(value)} statusType={chipType} sx={{ minWidth: 28 }} />
      ) : (
        <Typography variant="body2" fontWeight={600} color={tokens.colors.secondary[900]}>
          {value}
        </Typography>
      )}
    </Box>
  );
}
