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
      headerName: "Inquirer / Company",
      flex: 1.3,
      render: (_val, row) => {
        const primaryName = row.contactPerson || row.companyName || "Website Inquiry";
        const secondaryInfo = row.companyName && row.contactPerson ? row.companyName : null;

        return (
          <Box>
            <Typography variant="body2" fontWeight={600} color={tokens.colors.secondary[900]}>
              {primaryName}
            </Typography>
            {secondaryInfo && (
              <Typography variant="caption" color="text.secondary">
                {secondaryInfo}
              </Typography>
            )}
          </Box>
        );
      },
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
      render: (val) => {
        const sourceStr = val ? String(val).replace(/_/g, " ") : "WEBSITE";
        const isWebsite = String(val).toUpperCase() === "WEBSITE";
        return (
          <Typography
            variant="caption"
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: tokens.borderRadius.sm,
              fontWeight: 600,
              bgcolor: isWebsite ? tokens.colors.primary[50] : tokens.colors.secondary[100],
              color: isWebsite ? tokens.colors.primary[700] : tokens.colors.secondary[700],
              border: `1px solid ${isWebsite ? tokens.colors.primary[200] : tokens.colors.secondary[200]}`,
              display: "inline-block",
            }}
          >
            {sourceStr}
          </Typography>
        );
      },
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
