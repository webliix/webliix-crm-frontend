import { createTheme } from "@mui/material";
import { tokens } from "@/theme/tokens";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: tokens.colors.primary.main,
      light: tokens.colors.primary.light,
      dark: tokens.colors.primary.dark,
      contrastText: tokens.colors.primary.contrastText,
    },
    secondary: {
      main: tokens.colors.secondary.main,
      light: tokens.colors.secondary.light,
      dark: tokens.colors.secondary.dark,
      contrastText: tokens.colors.secondary.contrastText,
    },
    success: {
      main: tokens.colors.success.main,
      light: tokens.colors.success.light,
      dark: tokens.colors.success.dark,
      contrastText: tokens.colors.success.contrastText,
    },
    warning: {
      main: tokens.colors.warning.main,
      light: tokens.colors.warning.light,
      dark: tokens.colors.warning.dark,
      contrastText: tokens.colors.warning.contrastText,
    },
    error: {
      main: tokens.colors.error.main,
      light: tokens.colors.error.light,
      dark: tokens.colors.error.dark,
      contrastText: tokens.colors.error.contrastText,
    },
    info: {
      main: tokens.colors.info.main,
      light: tokens.colors.info.light,
      dark: tokens.colors.info.dark,
      contrastText: tokens.colors.info.contrastText,
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: tokens.colors.secondary[900],
      secondary: tokens.colors.secondary[500],
      disabled: tokens.colors.secondary[300],
    },
    divider: tokens.colors.secondary[200],
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
    caption: { fontSize: "0.75rem", lineHeight: 1.4, color: tokens.colors.secondary[500] },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: "0.01em" },
  },
  shape: {
    borderRadius: tokens.borderRadius.md,
  },
  shadows: [
    "none",
    tokens.shadows.sm,
    tokens.shadows.card,
    tokens.shadows.md,
    tokens.shadows.lg,
    tokens.shadows.cardHover,
    tokens.shadows.xl,
    tokens.shadows.dialog,
    ...Array(17).fill(tokens.shadows.dialog),
  ] as any,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#f8fafc",
          color: tokens.colors.secondary[900],
          fontFamily: tokens.typography.fontFamily,
          scrollBehavior: "smooth",
        },
        "::-webkit-scrollbar": {
          width: 8,
          height: 8,
        },
        "::-webkit-scrollbar-track": {
          background: "#f1f5f9",
        },
        "::-webkit-scrollbar-thumb": {
          background: "#cbd5e1",
          borderRadius: 4,
        },
        "::-webkit-scrollbar-thumb:hover": {
          background: "#94a3b8",
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
        containedPrimary: {
          backgroundColor: tokens.colors.primary.main,
          "&:hover": {
            backgroundColor: tokens.colors.primary.dark,
          },
        },
        outlined: {
          borderColor: tokens.colors.secondary[200],
          color: tokens.colors.secondary[700],
          "&:hover": {
            borderColor: tokens.colors.secondary[400],
            backgroundColor: tokens.colors.secondary[50],
          },
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
          border: `1px solid ${tokens.colors.secondary[200]}`,
          backgroundColor: "#ffffff",
          boxShadow: tokens.shadows.card,
          transition: `box-shadow ${tokens.transitions.normal}, border-color ${tokens.transitions.normal}`,
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
          backgroundColor: "#ffffff",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.colors.secondary[200],
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.colors.secondary[400],
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.colors.primary.main,
            borderWidth: 2,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: tokens.borderRadius.lg,
          boxShadow: tokens.shadows.dialog,
          border: `1px solid ${tokens.colors.secondary[200]}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.sm,
          fontWeight: 600,
          fontSize: "0.75rem",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.colors.secondary[50],
          "& .MuiTableCell-head": {
            fontWeight: 600,
            color: tokens.colors.secondary[700],
            borderBottom: `1px solid ${tokens.colors.secondary[200]}`,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: `${tokens.colors.primary[50]} !important`,
          },
        },
      },
    },
  },
});
