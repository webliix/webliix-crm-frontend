import type { ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme } from "@/theme";

interface Props {
  children: ReactNode;
}

export function ThemeProvider({ children }: Props) {
  return (
    <MuiThemeProvider theme={lightTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
