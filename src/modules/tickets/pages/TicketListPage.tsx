import { useState } from "react";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import { PageLayout } from "@/shared/components/ui/layout";
import { AppButton } from "@/shared/components/ui/button";
import { LoadingScreen, ErrorState } from "@/shared/components/ui/feedback";
import {
  TicketStatsHeader,
  TicketTable,
  TicketDetailsDrawer,
  TicketCreateDrawer,
} from "../components";
import { useTickets } from "../hooks/useTickets";
import { useNavigate } from "react-router-dom";

export default function TicketListPage() {
  const navigate = useNavigate();
  const { data: tickets = [], isLoading, isError, refetch } = useTickets();

  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleOpenDetails = (ticketId: number) => {
    setSelectedTicketId(ticketId);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedTicketId(null);
  };

  if (isLoading) {
    return (
      <PageLayout
        title="Support Tickets & Helpdesk"
        subtitle="Manage customer queries, employee requests, and live communications"
      >
        <LoadingScreen message="Loading support tickets..." />
      </PageLayout>
    );
  }

  if (isError) {
    return (
      <PageLayout
        title="Support Tickets & Helpdesk"
        subtitle="Manage customer queries, employee requests, and live communications"
      >
        <ErrorState
          title="Unable to Load Tickets"
          message="Failed to fetch support tickets from backend services."
          onRetry={refetch}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Support Tickets & Helpdesk"
      subtitle="Manage customer queries, employee requests, and live communications"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard", onClick: () => navigate("/dashboard") },
        { label: "Support Tickets" },
      ]}
      actions={
        <AppButton
          appVariant="primary"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={() => setIsCreateOpen(true)}
        >
          Create Ticket
        </AppButton>
      }
    >
      <Box sx={{ display: "grid", gap: 3 }}>
        <TicketStatsHeader />
        <TicketTable
          tickets={tickets}
          onSelectTicket={handleOpenDetails}
          onCreateTicket={() => setIsCreateOpen(true)}
        />
      </Box>

      {/* Ticket Details & Live Chat Drawer */}
      <TicketDetailsDrawer
        ticketId={selectedTicketId}
        open={isDetailsOpen}
        onClose={handleCloseDetails}
      />

      {/* Ticket Create Drawer */}
      <TicketCreateDrawer
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </PageLayout>
  );
}
