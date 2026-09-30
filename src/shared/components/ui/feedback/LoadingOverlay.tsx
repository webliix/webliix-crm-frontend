import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import { BrandLoader } from "./BrandLoader";
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
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(4px)",
            borderRadius: "inherit",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transition: tokens.transitions.fast,
          }}
        >
          <BrandLoader message={message} size="medium" />
        </Box>
      )}
    </Box>
  );
}
