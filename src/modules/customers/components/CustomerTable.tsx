import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { AppDataTable, type DataTableColumn } from "@/shared/components/ui/table/AppDataTable";
import { AppTextField } from "@/shared/components/ui/form";
import { AppStatusChip, EmptyState } from "@/shared/components/ui/feedback";
import { AppButton } from "@/shared/components/ui/button";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import { tokens } from "@/theme/tokens";
import type { CustomerResponse } from "../types/customer.types";

interface CustomerTableProps {
  customers: CustomerResponse[];
  onSelectCustomer: (customerId: number) => void;
  onCreateCustomer: () => void;
}

export function CustomerTable({
  customers,
  onSelectCustomer,
  onCreateCustomer,
}: CustomerTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        search === "" ||
        c.companyName?.toLowerCase().includes(search.toLowerCase()) ||
        c.customerCode?.toLowerCase().includes(search.toLowerCase()) ||
        c.contactPerson?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && c.active !== false) ||
        (statusFilter === "INACTIVE" && c.active === false);

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  const handleWhatsApp = (e: React.MouseEvent, phone?: string, name?: string) => {
    e.stopPropagation();
    if (!phone) return;
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      `Hello ${name || ""}, connecting from Webliix regarding your client account and projects.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  const columns: DataTableColumn<CustomerResponse>[] = [
    {
      field: "companyName",
      headerName: "Company / Client Code",
      render: (_: any, row: CustomerResponse) => (
        <Box>
          <Typography
            variant="body2"
            fontWeight={700}
            color={tokens.colors.primary.main}
            sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
            onClick={() => onSelectCustomer(row.id)}
          >
            {row.companyName}
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            {row.customerCode || `#CUST-${row.id}`}
          </Typography>
        </Box>
      ),
    },
    {
      field: "contactPerson",
      headerName: "Contact & Email",
      render: (_: any, row: CustomerResponse) => (
        <Box>
          <Typography variant="body2" fontWeight={600} color={tokens.colors.secondary[900]} noWrap>
            {row.contactPerson || "Primary Contact"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.email || "-"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "phone",
      headerName: "Phone",
      render: (_: any, row: CustomerResponse) => (
        <Typography variant="body2" color={tokens.colors.secondary[800]}>
          {row.phone || "-"}
        </Typography>
      ),
    },
    {
      field: "lifetimeValue",
      headerName: "Lifetime Value",
      render: (_: any, row: CustomerResponse) => (
        <Typography variant="body2" fontWeight={700} color={tokens.colors.secondary[900]}>
          {row.lifetimeValue ? formatCurrency(row.lifetimeValue) : "₹0"}
        </Typography>
      ),
    },
    {
      field: "active",
      headerName: "Status",
      render: (_: any, row: CustomerResponse) => (
        <AppStatusChip
          status={row.active !== false ? "ACTIVE" : "INACTIVE"}
          statusType={row.active !== false ? "success" : "neutral"}
          sx={{ height: 22, fontSize: "0.7rem" }}
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Onboarded",
      render: (_: any, row: CustomerResponse) => (
        <Typography variant="caption" color="text.secondary">
          {formatDate(row.createdAt)}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      align: "right",
      render: (_: any, row: CustomerResponse) => (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          {row.phone && (
            <AppButton
              appVariant="secondary"
              appSize="sm"
              startIcon={<WhatsAppIcon sx={{ fontSize: 16, color: "#25D366" }} />}
              onClick={(e) => handleWhatsApp(e, row.phone, row.contactPerson || row.companyName)}
            >
              WhatsApp
            </AppButton>
          )}

          <AppButton
            appVariant="primary"
            appSize="sm"
            startIcon={<VisibilityOutlinedIcon sx={{ fontSize: 16 }} />}
            onClick={() => onSelectCustomer(row.id)}
          >
            Manage
          </AppButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      {/* Search & Filter Bar */}
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
            placeholder="Search clients by name, code, contact..."
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

        <Box sx={{ display: "flex", gap: 1 }}>
          {(["ALL", "ACTIVE", "INACTIVE"] as const).map((status) => (
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
      {filteredCustomers.length === 0 ? (
        <EmptyState
          title="No Clients Found"
          message={
            search || statusFilter !== "ALL"
              ? "No customer accounts match your selected filter."
              : "No clients registered in the hub yet. Create your first client account."
          }
          actionText="Add Client"
          onAction={onCreateCustomer}
        />
      ) : (
        <AppDataTable
          columns={columns}
          rows={filteredCustomers}
          totalRows={filteredCustomers.length}
        />
      )}
    </Box>
  );
}
