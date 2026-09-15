import Box from "@mui/material/Box";
import { PageLayout } from "@/shared/components/ui/layout";
import {
  DashboardWelcome,
  DashboardStats,
  DashboardOperationsOverview,
  DashboardRecentLeads,
  DashboardActivity,
  DashboardQuickActions,
} from "@/modules/dashboard/components";

export default function DashboardPage() {
  return (
    <PageLayout
      title="Enterprise Dashboard"
      subtitle="Comprehensive CRM, finance, project delivery, and operational analytics"
    >
      <Box sx={{ display: "grid", gap: 3 }}>
        <DashboardWelcome />
        <DashboardStats />
        <DashboardOperationsOverview />
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1.1fr 0.9fr" }, gap: 3 }}>
          <DashboardRecentLeads />
          <DashboardQuickActions />
        </Box>
        <DashboardActivity />
      </Box>
    </PageLayout>
  );
}
