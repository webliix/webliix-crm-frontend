import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import SearchIcon from "@mui/icons-material/Search";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import FolderSpecialOutlinedIcon from "@mui/icons-material/FolderSpecialOutlined";
import { AppDataTable, type DataTableColumn } from "@/shared/components/ui/table/AppDataTable";
import { AppTextField } from "@/shared/components/ui/form";
import { AppStatusChip, EmptyState } from "@/shared/components/ui/feedback";
import { AppButton } from "@/shared/components/ui/button";
import { formatDate } from "@/shared/utils/formatters";
import { tokens } from "@/theme/tokens";
import type { TicketResponse } from "../types/ticket.types";

interface TicketTableProps {
  tickets: TicketResponse[];
  onSelectTicket: (ticketId: number) => void;
  onCreateTicket: () => void;
}

export function TicketTable({ tickets, onSelectTicket, onCreateTicket }: TicketTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch =
        search === "" ||
        t.ticketNumber?.toLowerCase().includes(search.toLowerCase()) ||
        t.title?.toLowerCase().includes(search.toLowerCase()) ||
        t.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        t.projectName?.toLowerCase().includes(search.toLowerCase()) ||
        t.assignedToName?.toLowerCase().includes(search.toLowerCase()) ||
        t.createdBy?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tickets, search, statusFilter]);

  const getPriorityColor = (priority: string): "error" | "warning" | "info" | "neutral" => {
    switch (priority) {
      case "CRITICAL":
        return "error";
      case "HIGH":
        return "warning";
      case "MEDIUM":
        return "info";
      default:
        return "neutral";
    }
  };

  const columns: DataTableColumn<TicketResponse>[] = [
    {
      field: "ticketNumber",
      headerName: "Ticket #",
      render: (_: any, row: TicketResponse) => (
        <Typography
          variant="body2"
          fontWeight={700}
          color={tokens.colors.primary.main}
          sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
          onClick={() => onSelectTicket(row.id)}
        >
          {row.ticketNumber}
        </Typography>
      ),
    },
    {
      field: "title",
      headerName: "Subject & Inquirer",
      render: (_: any, row: TicketResponse) => (
        <Box>
          <Typography variant="body2" fontWeight={600} color={tokens.colors.secondary[900]} noWrap>
            {row.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            By: {row.customerName || row.createdBy || "Client Portal User"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "projectName",
      headerName: "Project",
      render: (_: any, row: TicketResponse) =>
        row.projectName ? (
          <Chip
            icon={<FolderSpecialOutlinedIcon sx={{ fontSize: "14px !important" }} />}
            label={row.projectName}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: "0.72rem", height: 24 }}
          />
        ) : (
          <Typography variant="caption" color="text.secondary">
            General
          </Typography>
        ),
    },
    {
      field: "assignedToName",
      headerName: "Assigned To",
      render: (_: any, row: TicketResponse) =>
        row.assignedToName ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <SupportAgentIcon sx={{ fontSize: 16, color: tokens.colors.primary.main }} />
            <Typography variant="body2" fontWeight={600} color={tokens.colors.secondary[800]}>
              {row.assignedToName}
            </Typography>
          </Box>
        ) : (
          <Chip label="Unassigned" size="small" sx={{ height: 22, fontSize: "0.7rem", bgcolor: tokens.colors.secondary[100] }} />
        ),
    },
    {
      field: "priority",
      headerName: "Priority",
      render: (_: any, row: TicketResponse) => (
        <AppStatusChip
          status={row.priority}
          statusType={getPriorityColor(row.priority)}
          sx={{ height: 22, fontSize: "0.7rem" }}
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      render: (_: any, row: TicketResponse) => (
        <AppStatusChip status={row.status} sx={{ height: 22, fontSize: "0.7rem" }} />
      ),
    },
    {
      field: "createdAt",
      headerName: "Submitted",
      render: (_: any, row: TicketResponse) => (
        <Typography variant="caption" color="text.secondary">
          {formatDate(row.createdAt)}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      align: "right",
      render: (_: any, row: TicketResponse) => (
        <AppButton
          appVariant="secondary"
          appSize="sm"
          startIcon={<ChatOutlinedIcon sx={{ fontSize: 16 }} />}
          onClick={() => onSelectTicket(row.id)}
        >
          View & Chat
        </AppButton>
      ),
    },
  ];

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      {/* Search and Quick Status Filter Bar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
        }}
      >
        <Box sx={{ maxWidth: { xs: "100%", sm: 360 } }}>
          <AppTextField
            placeholder="Search tickets by number, project, agent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: tokens.colors.secondary[400] }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: { xs: 1, sm: 0 } }}>
          {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((status) => (
            <AppButton
              key={status}
              appVariant={statusFilter === status ? "primary" : "secondary"}
              appSize="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </AppButton>
          ))}
        </Box>
      </Box>

      {/* Data Table */}
      {filteredTickets.length === 0 ? (
        <EmptyState
          title="No Tickets Found"
          message={
            search || statusFilter !== "ALL"
              ? "No tickets match the selected search or filter criteria."
              : "No customer or project tickets have been registered yet."
          }
          actionText="Create Ticket"
          onAction={onCreateTicket}
        />
      ) : (
        <AppDataTable
          columns={columns}
          rows={filteredTickets}
          totalRows={filteredTickets.length}
        />
      )}
    </Box>
  );
}
