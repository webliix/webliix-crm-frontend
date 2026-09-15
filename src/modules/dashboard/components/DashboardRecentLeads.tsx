import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { AppCard } from "@/shared/components/ui/card";
import { AppButton } from "@/shared/components/ui/button";
import { AppStatusChip, EmptyState } from "@/shared/components/ui/feedback";
import { useDashboard } from "@/modules/dashboard/hooks/useDashboard";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import { useNavigate } from "react-router-dom";
import { tokens } from "@/theme/tokens";

export function DashboardRecentLeads() {
  const { data } = useDashboard();
  const navigate = useNavigate();

  const leads = data?.recentLeads || [];

  return (
    <AppCard
      title="Recent Pipeline Leads"
      subtitle="Newly registered sales prospects & inquiries"
      padding="lg"
      action={
        <AppButton
          appVariant="ghost"
          appSize="sm"
          endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
          onClick={() => navigate("/leads")}
        >
          View All
        </AppButton>
      }
    >
      {leads.length === 0 ? (
        <EmptyState
          title="No Recent Leads"
          message="No active leads have been created yet. Register a new lead to start tracking opportunities."
          actionText="Create Lead"
          onAction={() => navigate("/leads/create")}
        />
      ) : (
        <Box sx={{ display: "grid", gap: 1.5, mt: 1 }}>
          {leads.slice(0, 5).map((lead) => (
            <Box
              key={lead.id}
              onClick={() => navigate(`/leads`)}
              sx={{
                p: 2,
                borderRadius: tokens.borderRadius.md,
                border: `1px solid ${tokens.colors.secondary[200]}`,
                backgroundColor: tokens.colors.secondary[50],
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 1.5,
                cursor: "pointer",
                transition: tokens.transitions.fast,
                "&:hover": {
                  backgroundColor: tokens.colors.primary[50],
                  borderColor: tokens.colors.primary[300],
                },
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={700} color={tokens.colors.secondary[900]}>
                  {lead.companyName || "Unnamed Opportunity"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Contact: {lead.contactPerson || "N/A"} • {lead.email || lead.phone || "No contact info"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2, alignSelf: { xs: "flex-end", sm: "center" } }}>
                {lead.estimatedValue && (
                  <Typography variant="body2" fontWeight={700} color={tokens.colors.secondary[800]}>
                    {formatCurrency(lead.estimatedValue)}
                  </Typography>
                )}
                <AppStatusChip status={String(lead.status || "NEW")} />
                <Typography variant="caption" color="text.secondary">
                  {formatDate(lead.createdAt)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </AppCard>
  );
}
