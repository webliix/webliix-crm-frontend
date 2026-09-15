import { forwardRef, type ReactNode } from "react";
import Button, { type ButtonProps as MuiButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { tokens } from "@/theme/tokens";

export type ButtonVariant = "primary" | "secondary" | "outlined" | "ghost" | "danger" | "success";
export type ButtonSize = "sm" | "md" | "lg";

export interface AppButtonProps extends MuiButtonProps {
  appVariant?: ButtonVariant;
  appSize?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  (
    {
      children,
      appVariant = "primary",
      appSize,
      size,
      loading = false,
      loadingText,
      disabled,
      startIcon,
      endIcon,
      sx,
      ...props
    },
    ref
  ) => {
    const getVariantStyles = () => {
      switch (appVariant) {
        case "secondary":
          return {
            backgroundColor: tokens.colors.secondary[100],
            color: tokens.colors.secondary[800],
            "&:hover": {
              backgroundColor: tokens.colors.secondary[200],
            },
          };
        case "outlined":
          return {
            backgroundColor: "transparent",
            border: `1px solid ${tokens.colors.secondary[300]}`,
            color: tokens.colors.secondary[700],
            "&:hover": {
              borderColor: tokens.colors.secondary[500],
              backgroundColor: tokens.colors.secondary[50],
            },
          };
        case "ghost":
          return {
            backgroundColor: "transparent",
            color: tokens.colors.secondary[700],
            "&:hover": {
              backgroundColor: tokens.colors.secondary[100],
            },
          };
        case "danger":
          return {
            backgroundColor: tokens.colors.error.main,
            color: "#ffffff",
            "&:hover": {
              backgroundColor: tokens.colors.error.dark,
            },
          };
        case "success":
          return {
            backgroundColor: tokens.colors.success.main,
            color: "#ffffff",
            "&:hover": {
              backgroundColor: tokens.colors.success.dark,
            },
          };
        case "primary":
        default:
          return {
            backgroundColor: tokens.colors.primary.main,
            color: "#ffffff",
            "&:hover": {
              backgroundColor: tokens.colors.primary.dark,
            },
          };
      }
    };

    const resolvedSize = appSize || (size === "small" ? "sm" : size === "large" ? "lg" : "md");

    const getSizeStyles = () => {
      switch (resolvedSize) {
        case "sm":
          return {
            py: 0.5,
            px: 1.5,
            fontSize: "0.8125rem",
            height: 30,
          };
        case "lg":
          return {
            py: 1.25,
            px: 3,
            fontSize: "1rem",
            height: 46,
          };
        case "md":
        default:
          return {
            py: 0.875,
            px: 2,
            fontSize: "0.875rem",
            height: 38,
          };
      }
    };

    return (
      <Button
        ref={ref}
        disabled={disabled || loading}
        startIcon={
          loading ? (
            <CircularProgress size={16} color="inherit" thickness={4} />
          ) : (
            startIcon
          )
        }
        endIcon={!loading ? endIcon : undefined}
        sx={{
          borderRadius: tokens.borderRadius.sm,
          textTransform: "none",
          fontWeight: 600,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          whiteSpace: "nowrap",
          minWidth: "auto",
          transition: tokens.transitions.fast,
          boxShadow: appVariant === "ghost" || appVariant === "outlined" ? "none" : tokens.shadows.sm,
          "&:active": {
            transform: "scale(0.98)",
          },
          "&.Mui-disabled": {
            opacity: 0.6,
            cursor: "not-allowed",
          },
          ...getVariantStyles(),
          ...getSizeStyles(),
          ...sx,
        }}
        {...props}
      >
        {loading && loadingText ? loadingText : children}
      </Button>
    );
  }
);

AppButton.displayName = "AppButton";
