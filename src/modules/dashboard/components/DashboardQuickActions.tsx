import Stack from "@mui/material/Stack";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import { AppButton } from "@/shared/components/ui/button";
import { AppCard } from "@/shared/components/ui/card";
import { ActionGuard } from "@/shared/components/rbac/ActionGuard";
import { permissions } from "@/shared/rbac/permissions";
import { useNavigate } from "react-router-dom";
import { notificationService } from "@/shared/notifications/notification.service";

export function DashboardQuickActions() {
  const navigate = useNavigate();

  return (
    <AppCard
      title="Quick Actions"
      subtitle="Frequently used actions and workflow shortcuts"
      padding="lg"
    >
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
        <ActionGuard permission={permissions.leads.create}>
          <AppButton
            appVariant="primary"
            startIcon={<PersonAddOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={() => navigate("/leads/create")}
          >
            Create Lead
          </AppButton>
        </ActionGuard>

        <ActionGuard permission={permissions.clients.create}>
          <AppButton
            appVariant="outlined"
            startIcon={<BusinessOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={() => notificationService.info("Customer creation module coming soon")}
          >
            Add Customer
          </AppButton>
        </ActionGuard>

        <ActionGuard permission={permissions.projects.create}>
          <AppButton
            appVariant="outlined"
            startIcon={<AddTaskOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={() => notificationService.info("Project creation module coming soon")}
          >
            New Project
          </AppButton>
        </ActionGuard>

        <AppButton
          appVariant="outlined"
          startIcon={<ReceiptOutlinedIcon sx={{ fontSize: 18 }} />}
          onClick={() => notificationService.info("Invoice generation module coming soon")}
        >
          Create Invoice
        </AppButton>
      </Stack>
    </AppCard>
  );
}
