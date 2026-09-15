import { type ReactNode } from "react";
import Dialog, { type DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import { AppIconButton } from "@/shared/components/ui/button";
import { tokens } from "@/theme/tokens";

export type DialogSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AppDialogProps extends Omit<DialogProps, "maxWidth" | "title"> {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  size?: DialogSize;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export function AppDialog({
  children,
  title,
  subtitle,
  actions,
  size = "md",
  open,
  onClose,
  showCloseButton = true,
  ...props
}: AppDialogProps) {
  const getMaxWidth = () => {
    switch (size) {
      case "xs":
        return "xs";
      case "sm":
        return "sm";
      case "lg":
        return "lg";
      case "xl":
        return "xl";
      case "md":
      default:
        return "md";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={getMaxWidth()}
      PaperProps={{
        sx: {
          borderRadius: tokens.borderRadius.lg,
          boxShadow: tokens.shadows.dialog,
          border: `1px solid ${tokens.colors.secondary[200]}`,
          overflow: "hidden",
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(15, 23, 42, 0.5)",
        },
      }}
      {...props}
    >
      {(title || showCloseButton) && (
        <DialogTitle
          sx={{
            m: 0,
            p: 3,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            borderBottom: `1px solid ${tokens.colors.secondary[200]}`,
            backgroundColor: "#ffffff",
          }}
        >
          <Box sx={{ pr: 2 }}>
            {typeof title === "string" ? (
              <Typography variant="h6" fontWeight={700} color={tokens.colors.secondary[900]}>
                {title}
              </Typography>
            ) : (
              title
            )}
            {subtitle && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                {subtitle}
              </Typography>
            )}
          </Box>

          {showCloseButton && onClose && (
            <AppIconButton
              variant="ghost"
              size="sm"
              onClick={onClose}
              tooltip="Close"
              sx={{ color: tokens.colors.secondary[400], "&:hover": { color: tokens.colors.secondary[700] } }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </AppIconButton>
          )}
        </DialogTitle>
      )}

      <DialogContent sx={{ p: 3, backgroundColor: "#ffffff" }}>
        {children}
      </DialogContent>

      {actions && (
        <DialogActions
          sx={{
            p: 2.5,
            px: 3,
            borderTop: `1px solid ${tokens.colors.secondary[200]}`,
            backgroundColor: tokens.colors.secondary[50],
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
}
