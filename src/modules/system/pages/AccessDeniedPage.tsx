import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import { AppButton, AppCard } from "@/shared/components/ui";
import { tokens } from "@/theme/tokens";

export function AccessDeniedPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%", maxWidth: 480 }}>
      <AppCard padding="lg" cardVariant="elevated" sx={{ textAlign: "center", py: 5, px: 4 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            backgroundColor: tokens.colors.error[50],
            color: tokens.colors.error.main,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2.5,
            border: `1px solid ${tokens.colors.error[200]}`,
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 32 }} />
        </Box>

        <Typography variant="h5" fontWeight={700} color={tokens.colors.secondary[900]} sx={{ mb: 1 }}>
          Access Restricted
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 360, mx: "auto" }}>
          You do not have the necessary permissions or role privileges to view this section of the platform.
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
          <AppButton
            appVariant="outlined"
            onClick={() => navigate(-1)}
          >
            Go Back
          </AppButton>

          <AppButton
            appVariant="primary"
            startIcon={<HomeOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </AppButton>
        </Box>
      </AppCard>
    </Box>
  );
}
