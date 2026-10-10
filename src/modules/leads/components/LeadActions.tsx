import { useState } from "react";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
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
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [clientPassword, setClientPassword] = useState("");

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

  const handleConvertClick = () => {
    if (onConvert) return onConvert(lead.id as number);
    setClientPassword("");
    setConvertModalOpen(true);
  };

  const handleConfirmConvert = () => {
    convertMutation.mutate(
      { id: lead.id as number, password: clientPassword.trim() || undefined },
      {
        onSuccess: () => {
          setConvertModalOpen(false);
          setClientPassword("");
        },
      }
    );
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
            onClick={handleConvertClick}
            loading={convertMutation.isPending}
          >
            Convert
          </AppButton>
        </ActionGuard>
      )}

      {/* Convert Lead to Client Account Modal */}
      <Dialog
        open={convertModalOpen}
        onClose={() => !convertMutation.isPending && setConvertModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>
          Convert Lead to Client Account
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Converting <b>{lead.contactPerson || lead.companyName || `#${lead.id}`}</b> into an active customer account will grant them Client Portal access.
          </Typography>
          <TextField
            fullWidth
            label="Client Portal Password (Optional)"
            placeholder="Leave blank to auto-generate password"
            helperText="If blank, a secure random password will be created and emailed to them."
            value={clientPassword}
            onChange={(e) => setClientPassword(e.target.value)}
            disabled={convertMutation.isPending}
            size="small"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <AppButton
            appVariant="ghost"
            onClick={() => setConvertModalOpen(false)}
            disabled={convertMutation.isPending}
          >
            Cancel
          </AppButton>
          <AppButton
            appVariant="primary"
            onClick={handleConfirmConvert}
            loading={convertMutation.isPending}
            loadingText="Converting..."
          >
            Confirm & Convert
          </AppButton>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
