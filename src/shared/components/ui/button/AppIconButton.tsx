import { forwardRef } from "react";
import IconButton, { type IconButtonProps as MuiIconButtonProps } from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import { tokens } from "@/theme/tokens";

export type IconButtonVariant = "default" | "primary" | "secondary" | "danger" | "ghost";
export type IconButtonSize = "sm" | "md" | "lg";

export interface AppIconButtonProps extends Omit<MuiIconButtonProps, "size" | "color"> {
  tooltip?: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  loading?: boolean;
}

export const AppIconButton = forwardRef<HTMLButtonElement, AppIconButtonProps>(
  (
    {
      children,
      tooltip,
      variant = "default",
      size = "md",
      loading = false,
      disabled,
      sx,
      ...props
    },
    ref
  ) => {
    const getVariantStyles = () => {
      switch (variant) {
        case "primary":
          return {
            color: tokens.colors.primary.main,
            backgroundColor: tokens.colors.primary[50],
            "&:hover": {
              backgroundColor: tokens.colors.primary[100],
            },
          };
        case "danger":
          return {
            color: tokens.colors.error.main,
            backgroundColor: tokens.colors.error[50],
            "&:hover": {
              backgroundColor: tokens.colors.error[100],
            },
          };
        case "secondary":
          return {
            color: tokens.colors.secondary[700],
            backgroundColor: tokens.colors.secondary[100],
            "&:hover": {
              backgroundColor: tokens.colors.secondary[200],
            },
          };
        case "ghost":
          return {
            color: tokens.colors.secondary[600],
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: tokens.colors.secondary[100],
            },
          };
        case "default":
        default:
          return {
            color: tokens.colors.secondary[600],
            border: `1px solid ${tokens.colors.secondary[200]}`,
            backgroundColor: "#ffffff",
            "&:hover": {
              backgroundColor: tokens.colors.secondary[50],
              borderColor: tokens.colors.secondary[300],
            },
          };
      }
    };

    const getSizeStyles = () => {
      switch (size) {
        case "sm":
          return { width: 30, height: 30, p: 0.5 };
        case "lg":
          return { width: 44, height: 44, p: 1.25 };
        case "md":
        default:
          return { width: 36, height: 36, p: 1 };
      }
    };

    const button = (
      <IconButton
        ref={ref}
        disabled={disabled || loading}
        sx={{
          borderRadius: tokens.borderRadius.sm,
          transition: tokens.transitions.fast,
          ...getVariantStyles(),
          ...getSizeStyles(),
          ...sx,
        }}
        {...props}
      >
        {loading ? <CircularProgress size={16} color="inherit" /> : children}
      </IconButton>
    );

    if (tooltip) {
      return (
        <Tooltip title={tooltip} arrow>
          <span>{button}</span>
        </Tooltip>
      );
    }

    return button;
  }
);

AppIconButton.displayName = "AppIconButton";
