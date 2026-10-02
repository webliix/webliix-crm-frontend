import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useDashboard } from "@/modules/dashboard/hooks/useDashboard";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import { useNavigate } from "react-router-dom";
import { tokens } from "@/theme/tokens";

export function DashboardRecentLeads() {
  const { data } = useDashboard();
  const navigate = useNavigate();

  const leads = data?.recentLeads || [];

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardHeader
        avatar={<PeopleAltOutlinedIcon color="primary" />}
        title={<Typography variant="subtitle1" fontWeight="bold">Recent Pipeline Leads</Typography>}
        subheader="Newly registered sales prospects & inquiries"
        action={
          <Button
            size="small"
            endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
            onClick={() => navigate("/leads")}
            sx={{ fontWeight: "bold" }}
          >
            View All
          </Button>
        }
        sx={{ pb: 1 }}
      />
      <Divider />
      <CardContent sx={{ pt: 2 }}>
        {leads.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              No active leads registered yet. Add a lead to start tracking opportunities.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => navigate("/leads/create")}
            >
              Create Lead
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "grid", gap: 1.5 }}>
            {leads.slice(0, 5).map((lead) => (
              <Box
                key={lead.id}
                onClick={() => navigate(`/leads`)}
                sx={{
                  p: 1.75,
                  borderRadius: 2,
                  border: `1px solid ${tokens.colors.secondary[200]}`,
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: 1.5,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <Box>
                  <Typography variant="body2" fontWeight="bold" color="text.primary">
                    {lead.companyName || "Unnamed Opportunity"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Contact: {lead.contactPerson || "N/A"} • {lead.email || lead.phone || "No contact info"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, alignSelf: { xs: "flex-end", sm: "center" } }}>
                  {lead.estimatedValue && (
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      {formatCurrency(lead.estimatedValue)}
                    </Typography>
                  )}
                  <Chip
                    label={String(lead.status || "NEW")}
                    size="small"
                    color={String(lead.status).toUpperCase() === "QUALIFIED" || String(lead.status).toUpperCase() === "WON" ? "success" : "primary"}
                    sx={{ fontWeight: "bold" }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(lead.createdAt)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
