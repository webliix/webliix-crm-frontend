import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { AppCard } from "./AppCard";
import { tokens } from "@/theme/tokens";

export type TrendDirection = "up" | "down" | "neutral";

export interface AppStatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: string | number;
    direction: TrendDirection;
    label?: string;
  };
  subtitle?: string;
  color?: "primary" | "success" | "warning" | "error" | "info";
  onClick?: () => void;
}

export function AppStatCard({
  title,
  value,
  icon,
  trend,
  subtitle,
  color = "primary",
  onClick,
}: AppStatCardProps) {
  const getColorTokens = () => {
    switch (color) {
      case "success":
        return {
          bg: tokens.colors.success[50],
          text: tokens.colors.success.main,
          border: tokens.colors.success[200],
        };
      case "warning":
        return {
          bg: tokens.colors.warning[50],
          text: tokens.colors.warning.main,
          border: tokens.colors.warning[200],
        };
      case "error":
        return {
          bg: tokens.colors.error[50],
          text: tokens.colors.error.main,
          border: tokens.colors.error[200],
        };
      case "info":
        return {
          bg: tokens.colors.info[50],
          text: tokens.colors.info.main,
          border: tokens.colors.info[200],
        };
      case "primary":
      default:
        return {
          bg: tokens.colors.primary[50],
          text: tokens.colors.primary.main,
          border: tokens.colors.primary[200],
        };
    }
  };

  const getTrendColor = () => {
    if (!trend) return undefined;
    switch (trend.direction) {
      case "up":
        return {
          bg: tokens.colors.success[50],
          text: tokens.colors.success[700],
          icon: "↑",
        };
      case "down":
        return {
          bg: tokens.colors.error[50],
          text: tokens.colors.error[700],
          icon: "↓",
        };
      case "neutral":
      default:
        return {
          bg: tokens.colors.secondary[100],
          text: tokens.colors.secondary[700],
          icon: "→",
        };
    }
  };

  const colorStyle = getColorTokens();
  const trendStyle = getTrendColor();

  return (
    <AppCard
      hoverable={!!onClick}
      onClick={onClick}
      sx={{
        cursor: onClick ? "pointer" : "default",
        height: "100%",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: tokens.colors.secondary[500],
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: tokens.colors.secondary[900],
              my: 0.5,
            }}
          >
            {value}
          </Typography>

          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}

          {trend && trendStyle && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
              <Chip
                size="small"
                label={`${trendStyle.icon} ${trend.value}`}
                sx={{
                  backgroundColor: trendStyle.bg,
                  color: trendStyle.text,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  height: 22,
                }}
              />
              {trend.label && (
                <Typography variant="caption" color="text.secondary">
                  {trend.label}
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {icon && (
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: tokens.borderRadius.md,
              backgroundColor: colorStyle.bg,
              color: colorStyle.text,
              border: `1px solid ${colorStyle.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        )}
      </Box>
    </AppCard>
  );
}
