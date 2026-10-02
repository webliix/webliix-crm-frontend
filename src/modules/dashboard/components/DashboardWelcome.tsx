import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { useAppSelector } from "@/shared/hooks/redux";
import { selectUser } from "@/modules/auth/store/selectors";
import { formatDate } from "@/shared/utils/formatters";
import { tokens } from "@/theme/tokens";

export function DashboardWelcome() {
  const user = useAppSelector(selectUser);
  const fullName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email : "Administrator";
  const userRole = user?.roles?.[0] || "SUPER_ADMIN";

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                Welcome back, {fullName}! 👋
              </Typography>
              <Chip
                icon={<AdminPanelSettingsIcon style={{ fontSize: 16 }} />}
                label={userRole.replace("_", " ")}
                color="primary"
                size="small"
                sx={{ fontWeight: "bold" }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Overview of workspace health, leads pipeline, client deliverables, and enterprise operations.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              backgroundColor: "action.hover",
              border: `1px solid ${tokens.colors.secondary[200]}`,
            }}
          >
            <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="caption" fontWeight="bold" color="text.secondary">
              {formatDate(new Date())}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
