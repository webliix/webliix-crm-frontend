import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { tokens } from "@/theme/tokens";
import { WEBLIIX_LOGO_URL } from "@/shared/constants/app.constants";

interface Props {
  children: ReactNode;
}

export function AuthLayout({ children }: Props) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: tokens.colors.secondary[50],
        backgroundImage: `radial-gradient(${tokens.colors.secondary[200]} 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Box
          component="img"
          src={WEBLIIX_LOGO_URL}
          alt="Webliix Logo"
          sx={{
            height: 34,
            maxHeight: 34,
            objectFit: "contain",
          }}
        />
        <Typography variant="subtitle1" fontWeight={800} color={tokens.colors.secondary[900]}>
          Webliix Hub
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          my: "auto",
          width: "100%",
        }}
      >
        {children}
      </Box>

      <Box sx={{ textAlign: "center", py: 2 }}>
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} Webliix Hub Platform. Secure Enterprise Login.
        </Typography>
      </Box>
    </Box>
  );
}
