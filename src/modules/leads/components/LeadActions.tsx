import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { AppButton } from "@/shared/components/ui/button";
import { ActionGuard } from "@/shared/components/rbac/ActionGuard";
import { permissions } from "@/shared/rbac/permissions";
import type { LeadResponse } from "@/api/generated";
import { useNavigate } from "react-router-dom";
import { useDeleteLead } from "@/modules/leads/hooks/useDeleteLead";
import { useConvertLead } from "@/modules/leads/hooks/useConvertLead";

interface Props {
  lead: LeadResponse;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onConvert?: (id: number) => void;
}

export function LeadActions({ lead, onView, onEdit, onDelete, onConvert }: Props) {
  const navigate = useNavigate();
  const deleteMutation = useDeleteLead();
  const convertMutation = useConvertLead();

  const isConverted = Boolean((lead as any).converted);

  const handleView = () => {
    if (onView) return onView(lead.id as number);
    navigate(`/leads/${lead.id}`);
  };

  const handleEdit = () => {
    if (onEdit) return onEdit(lead.id as number);
    navigate(`/leads/${lead.id}/edit`);
  };

  const handleDelete = () => {
    if (onDelete) return onDelete(lead.id as number);
    const leadLabel = lead.contactPerson || lead.companyName || `#${lead.id}`;
    if (window.confirm(`Are you sure you want to permanently delete lead "${leadLabel}"?`)) {
      deleteMutation.mutate(lead.id as number);
    }
  };

  const handleConvert = () => {
    if (onConvert) return onConvert(lead.id as number);
    const leadLabel = lead.contactPerson || lead.companyName || `#${lead.id}`;
    if (window.confirm(`Convert lead "${leadLabel}" into an active customer account?`)) {
      convertMutation.mutate(lead.id as number);
    }
  };

  const handleWhatsApp = () => {
    if (!lead.phone) return;
    const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      `Hello ${lead.contactPerson || lead.companyName || ""}, thank you for contacting Webliix! We are reaching out regarding your project requirements.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="flex-end" alignItems="center">
      {lead.phone && (
        <AppButton
          appSize="sm"
          appVariant="secondary"
          startIcon={<WhatsAppIcon sx={{ fontSize: 15, color: "#25D366" }} />}
          onClick={handleWhatsApp}
        >
          WhatsApp
        </AppButton>
      )}

      <AppButton appSize="sm" appVariant="outlined" onClick={handleView}>
        View
      </AppButton>

      <ActionGuard permission={permissions.leads.edit}>
        <AppButton appSize="sm" appVariant="outlined" onClick={handleEdit}>
          Edit
        </AppButton>
      </ActionGuard>

      <ActionGuard permission={permissions.leads.delete}>
        <AppButton
          appSize="sm"
          appVariant="danger"
          onClick={handleDelete}
          loading={deleteMutation.isPending}
        >
          Delete
        </AppButton>
      </ActionGuard>

      {isConverted ? (
        <Chip
          icon={<CheckCircleIcon sx={{ fontSize: "14px !important" }} />}
          label="Converted"
          size="small"
          color="success"
          variant="outlined"
          sx={{ fontWeight: 600, height: 26, fontSize: "0.75rem" }}
        />
      ) : (
        <ActionGuard permission={permissions.leads.convert}>
          <AppButton
            appSize="sm"
            appVariant="primary"
            onClick={handleConvert}
            loading={convertMutation.isPending}
          >
            Convert
          </AppButton>
        </ActionGuard>
      )}
    </Stack>
  );
}
