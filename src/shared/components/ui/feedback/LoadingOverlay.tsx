import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { tokens } from "@/theme/tokens";

export interface LoadingOverlayProps {
  loading: boolean;
  message?: string;
  children: ReactNode;
}

export function LoadingOverlay({ loading, message, children }: LoadingOverlayProps) {
  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      {children}

      {loading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(2px)",
            borderRadius: "inherit",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            transition: tokens.transitions.fast,
          }}
        >
          <CircularProgress size={36} thickness={4} color="primary" />
          {message && (
            <Typography variant="caption" fontWeight={600} color="text.secondary">
              {message}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
