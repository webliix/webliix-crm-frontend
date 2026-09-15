import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import { AppButton } from "@/shared/components/ui/button";
import { tokens } from "@/theme/tokens";

export interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "No data found",
  message = "There are no records to display at this time.",
  icon,
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        py: 6,
        px: 3,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: tokens.borderRadius.lg,
        backgroundColor: tokens.colors.secondary[50],
        border: `1px dashed ${tokens.colors.secondary[300]}`,
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          color: tokens.colors.secondary[400],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          boxShadow: tokens.shadows.sm,
          border: `1px solid ${tokens.colors.secondary[200]}`,
        }}
      >
        {icon || <InboxOutlinedIcon sx={{ fontSize: 28 }} />}
      </Box>

      <Typography variant="subtitle1" fontWeight={700} color={tokens.colors.secondary[800]}>
        {title}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 360, mt: 0.5, mb: actionText && onAction ? 2.5 : 0 }}
      >
        {message}
      </Typography>

      {actionText && onAction && (
        <AppButton appVariant="primary" appSize="sm" onClick={onAction}>
          {actionText}
        </AppButton>
      )}
    </Box>
  );
}
