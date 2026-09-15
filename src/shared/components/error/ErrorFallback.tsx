import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { AppContainer } from "@/shared/components/ui";

interface Props {
  error: Error;
  resetErrorBoundary: (...args: unknown[]) => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: Props) {
  return (
    <AppContainer>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, color: "error.main" }}>
          Something Went Wrong
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: "text.secondary",
            maxWidth: 500,
            fontFamily: "monospace",
            fontSize: "0.875rem",
          }}
        >
          {error.message}
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" onClick={() => resetErrorBoundary()}>
            Try Again
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          >
            Go to Dashboard
          </Button>
        </Box>
      </Box>
    </AppContainer>
  );
}
