import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { AppDialog } from "./AppDialog";
import { AppButton } from "@/shared/components/ui/button";
import { tokens } from "@/theme/tokens";

export type ConfirmVariant = "danger" | "warning" | "primary";

export interface AppConfirmDialogProps {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function AppConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}: AppConfirmDialogProps) {
  const getIcon = () => {
    switch (variant) {
      case "danger":
        return (
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: tokens.colors.error[50],
              color: tokens.colors.error.main,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 26 }} />
          </Box>
        );
      case "warning":
        return (
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: tokens.colors.warning[50],
              color: tokens.colors.warning.main,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <WarningAmberIcon sx={{ fontSize: 26 }} />
          </Box>
        );
      case "primary":
      default:
        return (
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: tokens.colors.primary[50],
              color: tokens.colors.primary.main,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <HelpOutlineIcon sx={{ fontSize: 26 }} />
          </Box>
        );
    }
  };

  return (
    <AppDialog
      open={open}
      onClose={onCancel}
      size="sm"
      actions={
        <>
          <AppButton appVariant="outlined" onClick={onCancel} disabled={loading}>
            {cancelText}
          </AppButton>
          <AppButton
            appVariant={variant === "danger" ? "danger" : "primary"}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmText}
          </AppButton>
        </>
      }
    >
      <Box sx={{ display: "flex", gap: 2.5, alignItems: "flex-start", py: 1 }}>
        {getIcon()}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={700} color={tokens.colors.secondary[900]} sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {message}
          </Typography>
        </Box>
      </Box>
    </AppDialog>
  );
}
