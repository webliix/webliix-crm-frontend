import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AppCard } from "@/shared/components/ui/card";
import { AppStatusChip } from "@/shared/components/ui/feedback";
import { useAppSelector } from "@/shared/hooks/redux";
import { selectUser } from "@/modules/auth/store/selectors";
import { formatDate } from "@/shared/utils/formatters";
import { tokens } from "@/theme/tokens";

export function DashboardWelcome() {
  const user = useAppSelector(selectUser);
  const fullName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email : "Administrator";
  const userRole = user?.roles?.[0] || "SUPER_ADMIN";

  return (
    <AppCard
      padding="lg"
      sx={{
        backgroundColor: "#ffffff",
        border: `1px solid ${tokens.colors.secondary[200]}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
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
            <Typography variant="h5" fontWeight={700} color={tokens.colors.secondary[900]}>
              Welcome back, {fullName}! 👋
            </Typography>
            <AppStatusChip status={userRole} statusType="primary" />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Here is a summary of your workspace activity and CRM metrics today.
          </Typography>
        </Box>

        <Box
          sx={{
            px: 2,
            py: 1,
            borderRadius: tokens.borderRadius.sm,
            backgroundColor: tokens.colors.secondary[50],
            border: `1px solid ${tokens.colors.secondary[200]}`,
            alignSelf: { xs: "flex-start", sm: "center" },
          }}
        >
          <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[600]}>
            Today: {formatDate(new Date())}
          </Typography>
        </Box>
      </Box>
    </AppCard>
  );
}
