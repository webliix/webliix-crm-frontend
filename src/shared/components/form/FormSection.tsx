import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AppCard } from "@/shared/components/ui/card";
import { tokens } from "@/theme/tokens";

interface Props {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function FormSection({ title, subtitle, children }: Props) {
  return (
    <AppCard padding="lg">
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="subtitle1" fontWeight={600} color={tokens.colors.secondary[900]}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 2.5,
          "& > .full-width": {
            gridColumn: "1 / -1",
          },
        }}
      >
        {children}
      </Box>
    </AppCard>
  );
}
