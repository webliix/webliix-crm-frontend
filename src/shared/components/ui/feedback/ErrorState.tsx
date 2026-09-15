import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import { AppButton } from "@/shared/components/ui/button";
import { tokens } from "@/theme/tokens";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  icon?: ReactNode;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while loading this content. Please try again.",
  onRetry,
  icon,
}: ErrorStateProps) {
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
        backgroundColor: tokens.colors.error[50],
        border: `1px solid ${tokens.colors.error[200]}`,
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          color: tokens.colors.error.main,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          boxShadow: tokens.shadows.sm,
          border: `1px solid ${tokens.colors.error[200]}`,
        }}
      >
        {icon || <ErrorOutlineIcon sx={{ fontSize: 28 }} />}
      </Box>

      <Typography variant="subtitle1" fontWeight={700} color={tokens.colors.error[700]}>
        {title}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 380, mt: 0.5, mb: onRetry ? 2.5 : 0 }}
      >
        {message}
      </Typography>

      {onRetry && (
        <AppButton
          appVariant="outlined"
          appSize="sm"
          startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
          onClick={onRetry}
          sx={{ borderColor: tokens.colors.error[300], color: tokens.colors.error[700] }}
        >
          Try Again
        </AppButton>
      )}
    </Box>
  );
}
