import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { tokens } from "@/theme/tokens";

export interface LoadingScreenProps {
  message?: string;
  fullscreen?: boolean;
}

export function LoadingScreen({
  message = "Loading...",
  fullscreen = false,
}: LoadingScreenProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
        minHeight: fullscreen ? "100vh" : 320,
        width: "100%",
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2.5,
        }}
      >
        <CircularProgress
          size={52}
          thickness={4}
          sx={{
            color: tokens.colors.primary.main,
            animationDuration: "750ms",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: tokens.colors.primary[50],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "0.875rem",
            color: tokens.colors.primary.main,
          }}
        >
          W
        </Box>
      </Box>

      {message && (
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {message}
        </Typography>
      )}
    </Box>
  );
}
