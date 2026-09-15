import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { AppButton, AppCard } from "@/shared/components/ui";
import { tokens } from "@/theme/tokens";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%", maxWidth: 480 }}>
      <AppCard padding="lg" cardVariant="elevated" sx={{ textAlign: "center", py: 5, px: 4 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: "5rem",
            fontWeight: 900,
            color: tokens.colors.primary[500],
            lineHeight: 1,
            mb: 1,
          }}
        >
          404
        </Typography>

        <Typography variant="h5" fontWeight={700} color={tokens.colors.secondary[900]} sx={{ mb: 1 }}>
          Page Not Found
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 360, mx: "auto" }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
          <AppButton
            appVariant="outlined"
            startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </AppButton>

          <AppButton
            appVariant="primary"
            startIcon={<HomeOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </AppButton>
        </Box>
      </AppCard>
    </Box>
  );
}
