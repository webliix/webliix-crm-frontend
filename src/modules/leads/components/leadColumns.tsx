import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import type { DataTableColumn } from "@/shared/components/ui/table";
import type { LeadResponse } from "@/api/generated";
import { AppStatusChip } from "@/shared/components/ui/feedback";
import { LeadActions } from "./LeadActions";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import { tokens } from "@/theme/tokens";

export function createLeadColumns(handlers?: {
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onConvert?: (id: number) => void;
}): DataTableColumn<LeadResponse>[] {
  return [
    {
      field: "companyName",
      headerName: "Company",
      flex: 1.2,
      render: (val, row) => (
        <Box>
          <Typography variant="body2" fontWeight={600} color={tokens.colors.secondary[900]}>
            {val || "Unnamed Lead"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.contactPerson || "-"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Contact Details",
      flex: 1.2,
      render: (_val, row) => (
        <Box>
          <Typography variant="body2" color={tokens.colors.secondary[800]}>
            {row.email || "-"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.phone || "-"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      render: (_value, row) => <AppStatusChip status={String(row.status || "NEW")} />,
    },
    {
      field: "source",
      headerName: "Source",
      flex: 0.8,
      render: (val) => (
        <Typography variant="body2" color="text.secondary">
          {val ? String(val).replace(/_/g, " ") : "-"}
        </Typography>
      ),
    },
    {
      field: "estimatedValue",
      headerName: "Est. Value",
      flex: 0.9,
      render: (val) => (
        <Typography variant="body2" fontWeight={600} color={tokens.colors.secondary[900]}>
          {val ? formatCurrency(val) : "-"}
        </Typography>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      flex: 0.9,
      render: (val) => (
        <Typography variant="caption" color="text.secondary">
          {formatDate(val)}
        </Typography>
      ),
    },
    {
      field: "id",
      headerName: "Actions",
      flex: 1,
      align: "right",
      render: (_value, row) => (
        <LeadActions
          lead={row}
          onView={handlers?.onView}
          onEdit={handlers?.onEdit}
          onDelete={handlers?.onDelete}
          onConvert={handlers?.onConvert}
        />
      ),
    },
  ];
}
