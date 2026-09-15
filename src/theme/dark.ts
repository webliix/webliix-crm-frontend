import { createTheme } from "@mui/material";
import { tokens } from "@/theme/tokens";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: tokens.colors.primary[500],
      light: tokens.colors.primary[400],
      dark: tokens.colors.primary[700],
      contrastText: "#ffffff",
    },
    secondary: {
      main: tokens.colors.secondary[400],
      light: tokens.colors.secondary[300],
      dark: tokens.colors.secondary[600],
      contrastText: "#ffffff",
    },
    success: {
      main: tokens.colors.success[500],
      light: tokens.colors.success[400],
      dark: tokens.colors.success[600],
      contrastText: "#ffffff",
    },
    warning: {
      main: tokens.colors.warning[500],
      light: tokens.colors.warning[400],
      dark: tokens.colors.warning[600],
      contrastText: "#ffffff",
    },
    error: {
      main: tokens.colors.error[500],
      light: tokens.colors.error[400],
      dark: tokens.colors.error[600],
      contrastText: "#ffffff",
    },
    info: {
      main: tokens.colors.info[500],
      light: tokens.colors.info[400],
      dark: tokens.colors.info[600],
      contrastText: "#ffffff",
    },
    background: {
      default: "#0f172a",
      paper: "#1e293b",
    },
    text: {
      primary: "#f8fafc",
      secondary: "#94a3b8",
      disabled: "#64748b",
    },
    divider: "#334155",
  },
  typography: {
    fontFamily: tokens.typography.fontFamily,
    h1: { fontSize: "2.25rem", fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.025em" },
    h2: { fontSize: "1.875rem", fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.025em" },
    h3: { fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.3, letterSpacing: "-0.02em" },
    h4: { fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.35, letterSpacing: "-0.015em" },
    h5: { fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: "1rem", fontWeight: 600, lineHeight: 1.4 },
    subtitle1: { fontSize: "0.9375rem", fontWeight: 500, lineHeight: 1.5 },
    subtitle2: { fontSize: "0.875rem", fontWeight: 500, lineHeight: 1.5 },
    body1: { fontSize: "0.9375rem", lineHeight: 1.5 },
    body2: { fontSize: "0.875rem", lineHeight: 1.5 },
    caption: { fontSize: "0.75rem", lineHeight: 1.4, color: "#94a3b8" },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: "0.01em" },
  },
  shape: {
    borderRadius: tokens.borderRadius.md,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#0f172a",
          color: "#f8fafc",
          fontFamily: tokens.typography.fontFamily,
          scrollBehavior: "smooth",
        },
        "::-webkit-scrollbar": {
          width: 8,
          height: 8,
        },
        "::-webkit-scrollbar-track": {
          background: "#1e293b",
        },
        "::-webkit-scrollbar-thumb": {
          background: "#475569",
          borderRadius: 4,
        },
        "::-webkit-scrollbar-thumb:hover": {
          background: "#64748b",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: "contained",
      },
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.sm,
          fontWeight: 600,
          textTransform: "none",
          padding: "8px 16px",
          transition: tokens.transitions.fast,
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.lg,
          border: "1px solid #334155",
          backgroundColor: "#1e293b",
          boxShadow: tokens.shadows.card,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
        fullWidth: true,
        variant: "outlined",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.sm,
          backgroundColor: "#0f172a",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#334155",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#64748b",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.colors.primary[500],
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: tokens.borderRadius.lg,
          backgroundColor: "#1e293b",
          border: "1px solid #334155",
        },
      },
    },
  },
});
