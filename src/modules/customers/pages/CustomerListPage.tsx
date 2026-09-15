import { useState } from "react";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import { PageLayout } from "@/shared/components/ui/layout";
import { AppButton } from "@/shared/components/ui/button";
import { LoadingScreen, ErrorState } from "@/shared/components/ui/feedback";
import {
  CustomerStatsHeader,
  CustomerTable,
  CustomerDetailsDrawer,
  CustomerCreateDrawer,
  CustomerEditDrawer,
} from "../components";
import { useCustomers } from "../hooks/useCustomers";
import { useNavigate } from "react-router-dom";
import type { CustomerResponse } from "../types/customer.types";

export default function CustomerListPage() {
  const navigate = useNavigate();
  const { data: customers = [], isLoading, isError, refetch } = useCustomers();

  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<CustomerResponse | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleOpenDetails = (customerId: number) => {
    setSelectedCustomerId(customerId);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedCustomerId(null);
  };

  const handleOpenEdit = (customer: CustomerResponse) => {
    setEditingCustomer(customer);
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setEditingCustomer(null);
  };

  if (isLoading) {
    return (
      <PageLayout
        title="Client Accounts & Portfolio"
        subtitle="Manage client relationships, active project delivery, invoices, and communications"
      >
        <LoadingScreen message="Loading client accounts..." />
      </PageLayout>
    );
  }

  if (isError) {
    return (
      <PageLayout
        title="Client Accounts & Portfolio"
        subtitle="Manage client relationships, active project delivery, invoices, and communications"
      >
        <ErrorState
          title="Unable to Load Clients"
          message="Failed to fetch client records from backend services."
          onRetry={refetch}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Client Accounts & Portfolio"
      subtitle="Manage client relationships, active project delivery, invoices, and communications"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard", onClick: () => navigate("/dashboard") },
        { label: "Clients" },
      ]}
      actions={
        <AppButton
          appVariant="primary"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={() => setIsCreateOpen(true)}
        >
          Onboard Client
        </AppButton>
      }
    >
      <Box sx={{ display: "grid", gap: 3 }}>
        <CustomerStatsHeader />
        <CustomerTable
          customers={customers}
          onSelectCustomer={handleOpenDetails}
          onCreateCustomer={() => setIsCreateOpen(true)}
        />
      </Box>

      {/* Customer Details Drawer */}
      <CustomerDetailsDrawer
        customerId={selectedCustomerId}
        open={isDetailsOpen}
        onClose={handleCloseDetails}
        onEdit={handleOpenEdit}
      />

      {/* Customer Create Drawer */}
      <CustomerCreateDrawer
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* Customer Edit Drawer */}
      <CustomerEditDrawer
        customer={editingCustomer}
        open={isEditOpen}
        onClose={handleCloseEdit}
      />
    </PageLayout>
  );
}
