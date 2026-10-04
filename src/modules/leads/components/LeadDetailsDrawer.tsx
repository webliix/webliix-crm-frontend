import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import { AppDrawer } from "@/shared/components/ui/dialog";
import { AppStatusChip, LoadingScreen, EmptyState } from "@/shared/components/ui/feedback";
import { AppButton } from "@/shared/components/ui/button";
import { useLead } from "@/modules/leads/hooks/useLead";
import { useConvertLead } from "@/modules/leads/hooks/useConvertLead";
import type { LeadResponse } from "@/api/generated";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import { tokens } from "@/theme/tokens";

interface Props {
  id?: number | null;
  open: boolean;
  onClose: () => void;
}

export function LeadDetailsDrawer({ id, open, onClose }: Props) {
  const navigate = useNavigate();
  const convertMutation = useConvertLead();
  const { data, isLoading, isError } = useLead(id ?? 0);
  const lead: (LeadResponse & { converted?: boolean; convertedAt?: string }) | undefined =
    (data as any)?.data ?? ((data as any)?.id ? (data as any) : undefined);

  const isConverted = Boolean(lead?.converted);

  const handleConvert = () => {
    if (!lead?.id) return;
    if (window.confirm(`Convert lead "${lead.contactPerson || lead.companyName || `#${lead.id}`}" into an active client?`)) {
      convertMutation.mutate(lead.id);
    }
  };

  const handleOpenWhatsApp = () => {
    if (!lead?.phone) return;
    const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
    const leadName = lead.contactPerson || lead.companyName || "there";
    const text = encodeURIComponent(
      `Hello ${leadName}, thank you for contacting Webliix! We received your project inquiry regarding "${lead.requirements || "our enterprise solutions"}". We would love to discuss your specific requirements and next steps.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  const handleOpenEmail = () => {
    if (!lead?.email) return;
    const subject = encodeURIComponent(`Webliix Solutions – Regarding your project inquiry`);
    const body = encodeURIComponent(
      `Hello ${lead.contactPerson || lead.companyName || ""},\n\nThank you for reaching out to Webliix regarding:\n"${lead.requirements || ""}"\n\nOur solutions team is reviewing your project details. When would be a good time for a quick 15-minute discovery call to discuss your exact requirements?\n\nBest regards,\nWebliix Team\nhttps://webliix.in`
    );
    window.location.href = `mailto:${lead.email}?subject=${subject}&body=${body}`;
  };

  return (
    <AppDrawer
      open={open}
      onClose={onClose}
      title={lead?.contactPerson || lead?.companyName || "Lead Details"}
      subtitle={
        lead?.companyName && lead?.contactPerson
          ? `Company: ${lead.companyName}`
          : `Lead Source: ${lead?.source || "WEBSITE"}`
      }
      width="md"
    >
      {isLoading ? (
        <LoadingScreen message="Loading lead profile..." />
      ) : isError || !lead ? (
        <EmptyState title="Lead Not Found" message="The requested lead profile could not be loaded." />
      ) : (
        <Box sx={{ display: "grid", gap: 2.5 }}>
          {/* Header Status Bar */}
          <Box
            sx={{
              p: 2,
              borderRadius: tokens.borderRadius.md,
              backgroundColor: tokens.colors.secondary[50],
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Current Status
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <AppStatusChip status={String(lead.status || "NEW")} />
              </Box>
            </Box>

            <Box sx={{ textAlign: "right" }}>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Estimated Value
              </Typography>
              <Typography variant="subtitle1" fontWeight={700} color={tokens.colors.secondary[900]}>
                {lead.estimatedValue ? formatCurrency(lead.estimatedValue) : "N/A"}
              </Typography>
            </Box>
          </Box>

          {/* Converted Alert if converted */}
          {isConverted && (
            <Alert
              icon={<CheckCircleOutlineIcon fontSize="inherit" />}
              severity="success"
              action={
                <AppButton
                  appSize="sm"
                  appVariant="primary"
                  onClick={() => {
                    onClose();
                    navigate("/customers");
                  }}
                >
                  View Clients
                </AppButton>
              }
            >
              Converted into an active Client Account{lead.convertedAt ? ` on ${formatDate(lead.convertedAt)}` : ""}.
            </Alert>
          )}

          {/* Quick Connect Actions */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
            <AppButton
              appVariant="primary"
              startIcon={<WhatsAppIcon sx={{ fontSize: 18 }} />}
              onClick={handleOpenWhatsApp}
              disabled={!lead.phone}
              sx={{
                bgcolor: "#25D366 !important",
                color: "#ffffff !important",
                "&:hover": { bgcolor: "#1EBE5D !important" },
              }}
            >
              Chat on WhatsApp
            </AppButton>

            <AppButton
              appVariant="secondary"
              startIcon={<EmailOutlinedIcon sx={{ fontSize: 18 }} />}
              onClick={handleOpenEmail}
              disabled={!lead.email}
            >
              Send Email
            </AppButton>
          </Box>

          {/* Direct Convert Action if not yet converted */}
          {!isConverted && (
            <AppButton
              appVariant="primary"
              fullWidth
              startIcon={<PersonAddOutlinedIcon sx={{ fontSize: 18 }} />}
              onClick={handleConvert}
              loading={convertMutation.isPending}
            >
              Convert Lead to Active Client Account
            </AppButton>
          )}

          {/* Contact Details */}
          <Box>
            <Typography variant="subtitle2" fontWeight={700} color={tokens.colors.secondary[900]} sx={{ mb: 1.5 }}>
              Contact Information
            </Typography>
            <Box sx={{ display: "grid", gap: 1.25 }}>
              <DetailRow label="Contact Person" value={lead.contactPerson} />
              <DetailRow label="Company Name" value={lead.companyName} />
              <DetailRow label="Email" value={lead.email} />
              <DetailRow label="Phone" value={lead.phone} />
              <DetailRow label="Website" value={lead.website} />
              <DetailRow
                label="Lead Source"
                value={lead.source ? String(lead.source).replace(/_/g, " ") : "WEBSITE"}
              />
              <DetailRow
                label="Next Follow-up"
                value={lead.nextFollowUpDate ? formatDate(lead.nextFollowUpDate) : undefined}
              />
              {(lead.city || lead.state || lead.country) && (
                <DetailRow
                  label="Location"
                  value={[lead.city, lead.state, lead.country].filter(Boolean).join(", ")}
                />
              )}
            </Box>
          </Box>

          <Divider />

          {/* Requirements & Notes */}
          <Box>
            <Typography variant="subtitle2" fontWeight={700} color={tokens.colors.secondary[900]} sx={{ mb: 1.5 }}>
              Inquiry & Scope Requirements
            </Typography>
            <Box
              sx={{
                p: 2,
                borderRadius: tokens.borderRadius.md,
                bgcolor: tokens.colors.secondary[50],
                border: `1px solid ${tokens.colors.secondary[200]}`,
              }}
            >
              <Typography variant="body2" color={tokens.colors.secondary[800]} sx={{ lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {lead.requirements || "No specific requirements provided."}
              </Typography>
            </Box>
          </Box>

          {lead.notes && (
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color={tokens.colors.secondary[900]} sx={{ mb: 1 }}>
                Internal Notes
              </Typography>
              <Box
                sx={{
                  p: 2,
                  borderRadius: tokens.borderRadius.md,
                  bgcolor: "#fffbeb",
                  border: "1px solid #fde68a",
                }}
              >
                <Typography variant="body2" color="#92400e" sx={{ lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                  {lead.notes}
                </Typography>
              </Box>
            </Box>
          )}

          <Divider />

          {/* Metadata */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Created Date
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {formatDate(lead.createdAt)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Lead ID
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                #{lead.id}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </AppDrawer>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.5 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} color={tokens.colors.secondary[800]}>
        {value}
      </Typography>
    </Box>
  );
}
