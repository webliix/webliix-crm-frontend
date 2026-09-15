import { useState } from "react";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import { PageLayout } from "@/shared/components/ui/layout";
import { AppButton } from "@/shared/components/ui/button";
import { LeadFilters } from "@/modules/leads/components/LeadFilters";
import { LeadTable } from "@/modules/leads/components/LeadTable";
import { useLeads } from "@/modules/leads/hooks/useLeads";
import { LeadDetailsDrawer } from "@/modules/leads/components/LeadDetailsDrawer";
import { useNavigate } from "react-router-dom";
import { ActionGuard } from "@/shared/components/rbac/ActionGuard";
import { permissions } from "@/shared/rbac/permissions";

export default function LeadListPage() {
  const { rows, total, page, size, setPage, setSize, setSearch, isLoading } = useLeads();
  const leads = rows ?? [];
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleView = (id: number) => {
    setSelectedId(id);
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setSelectedId(null);
    setDrawerOpen(false);
  };

  const handleEdit = (id: number) => {
    navigate(`/leads/${id}/edit`);
  };

  return (
    <PageLayout
      title="Leads Pipeline"
      subtitle="Manage, qualify, and convert potential client opportunities"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard", onClick: () => navigate("/dashboard") },
        { label: "Leads" },
      ]}
      actions={
        <ActionGuard permission={permissions.leads.create}>
          <AppButton
            appVariant="primary"
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            onClick={() => navigate("/leads/create")}
          >
            Create New Lead
          </AppButton>
        </ActionGuard>
      }
    >
      <Box sx={{ display: "grid", gap: 2.5 }}>
        <LeadFilters onSearch={setSearch} />

        <LeadTable
          leads={leads}
          total={total}
          page={page}
          pageSize={size}
          loading={isLoading}
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(s) => setSize(s)}
          onView={handleView}
          onEdit={handleEdit}
        />
      </Box>

      <LeadDetailsDrawer id={selectedId ?? undefined} open={drawerOpen} onClose={handleClose} />
    </PageLayout>
  );
}
