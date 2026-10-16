import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SendIcon from "@mui/icons-material/Send";
import { AppDialog } from "@/shared/components/ui/dialog";
import { AppButton } from "@/shared/components/ui/button";
import { AppTextField } from "@/shared/components/ui/form";
import { customerService } from "../services/customer.service";
import { tokens } from "@/theme/tokens";

interface SendCustomerEmailDialogProps {
  open: boolean;
  onClose: () => void;
  customer?: {
    id: number;
    companyName?: string;
    contactPerson?: string;
    email?: string;
  } | null;
  onSuccess?: () => void;
}

export function SendCustomerEmailDialog({
  open,
  onClose,
  customer,
  onSuccess,
}: SendCustomerEmailDialogProps) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    if (customer && open) {
      setRecipientEmail(customer.email || "");
      const recipientName = customer.contactPerson || customer.companyName || "Valued Client";
      setSubject(`Update regarding your Webliix account - ${customer.companyName || ""}`.trim());
      setMessage(`Dear ${recipientName},\n\nWe are writing to provide an update on your projects and account with Webliix.\n\n`);
      setError(null);
      setSentSuccess(false);
    }
  }, [customer, open]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer?.id) return;

    if (!recipientEmail.trim()) {
      setError("Recipient email address is required.");
      return;
    }
    if (!subject.trim()) {
      setError("Email subject cannot be empty.");
      return;
    }
    if (!message.trim()) {
      setError("Email message body cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await customerService.sendEmail(customer.id, {
        subject: subject.trim(),
        message: message.trim(),
        recipientEmail: recipientEmail.trim(),
      });
      setSentSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to dispatch email.");
    } finally {
      setLoading(false);
    }
  };

  if (!customer) return null;

  return (
    <AppDialog
      open={open}
      onClose={loading ? undefined : onClose}
      size="md"
      title={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              bgcolor: tokens.colors.primary.light,
              color: tokens.colors.primary.main,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EmailOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} color={tokens.colors.secondary[900]}>
              Send Direct Email
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Direct client correspondence via Webliix Hub
            </Typography>
          </Box>
        </Box>
      }
      subtitle={`Recipient: ${customer.companyName || customer.contactPerson}`}
    >
      <Box component="form" onSubmit={handleSend} sx={{ display: "grid", gap: 2.5, pt: 1 }}>
        {error && <Alert severity="error">{error}</Alert>}
        {sentSuccess && (
          <Alert severity="success">
            Email sent successfully to {recipientEmail}! Closing window...
          </Alert>
        )}

        {/* Sender details badge */}
        <Box
          sx={{
            p: 1.5,
            borderRadius: tokens.borderRadius.sm,
            bgcolor: tokens.colors.secondary[50],
            border: `1px solid ${tokens.colors.secondary[200]}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]}>
            Sender Address:
          </Typography>
          <Chip
            label="contact@webliix.com"
            size="small"
            sx={{
              bgcolor: tokens.colors.primary.main,
              color: "#ffffff",
              fontWeight: 700,
              fontSize: 11,
            }}
          />
        </Box>

        {/* Recipient Address */}
        <AppTextField
          label="Recipient Email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          required
          fullWidth
          disabled={loading || sentSuccess}
          helperText={`Will be delivered to ${customer.contactPerson || customer.companyName}`}
        />

        {/* Subject */}
        <AppTextField
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          fullWidth
          disabled={loading || sentSuccess}
        />

        {/* Message body */}
        <AppTextField
          label="Email Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          multiline
          rows={6}
          fullWidth
          disabled={loading || sentSuccess}
          helperText="Write your message here. The official Webliix Hub branded header, personal greeting, and footer will be automatically attached."
        />

        {/* Action buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 1 }}>
          <AppButton
            appVariant="secondary"
            onClick={onClose}
            disabled={loading || sentSuccess}
          >
            Cancel
          </AppButton>
          <AppButton
            type="submit"
            appVariant="primary"
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon sx={{ fontSize: 16 }} />}
            disabled={loading || sentSuccess}
          >
            {loading ? "Sending..." : "Send Email"}
          </AppButton>
        </Box>
      </Box>
    </AppDialog>
  );
}
