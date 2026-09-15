import ButtonGroup, { type ButtonGroupProps } from "@mui/material/ButtonGroup";
import { tokens } from "@/theme/tokens";

export interface AppButtonGroupProps extends ButtonGroupProps {
  appSize?: "sm" | "md" | "lg";
}

export function AppButtonGroup({ children, sx, ...props }: AppButtonGroupProps) {
  return (
    <ButtonGroup
      variant="outlined"
      sx={{
        borderRadius: tokens.borderRadius.sm,
        boxShadow: tokens.shadows.sm,
        "& .MuiButton-root": {
          borderColor: tokens.colors.secondary[200],
          "&:hover": {
            borderColor: tokens.colors.secondary[300],
            backgroundColor: tokens.colors.secondary[50],
          },
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </ButtonGroup>
  );
}
