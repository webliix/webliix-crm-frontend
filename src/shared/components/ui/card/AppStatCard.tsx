import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
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
          accentGradient: `linear-gradient(135deg, ${tokens.colors.success[50]} 0%, #ffffff 100%)`,
        };
      case "warning":
        return {
          bg: tokens.colors.warning[50],
          text: tokens.colors.warning.main,
          border: tokens.colors.warning[200],
          accentGradient: `linear-gradient(135deg, ${tokens.colors.warning[50]} 0%, #ffffff 100%)`,
        };
      case "error":
        return {
          bg: tokens.colors.error[50],
          text: tokens.colors.error.main,
          border: tokens.colors.error[200],
          accentGradient: `linear-gradient(135deg, ${tokens.colors.error[50]} 0%, #ffffff 100%)`,
        };
      case "info":
        return {
          bg: tokens.colors.info[50],
          text: tokens.colors.info.main,
          border: tokens.colors.info[200],
          accentGradient: `linear-gradient(135deg, ${tokens.colors.info[50]} 0%, #ffffff 100%)`,
        };
      case "primary":
      default:
        return {
          bg: tokens.colors.primary[50],
          text: tokens.colors.primary.main,
          border: tokens.colors.primary[200],
          accentGradient: `linear-gradient(135deg, ${tokens.colors.primary[50]} 0%, #ffffff 100%)`,
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
          Icon: ArrowUpwardIcon,
        };
      case "down":
        return {
          bg: tokens.colors.error[50],
          text: tokens.colors.error[700],
          Icon: ArrowDownwardIcon,
        };
      case "neutral":
      default:
        return {
          bg: tokens.colors.secondary[100],
          text: tokens.colors.secondary[700],
          Icon: null,
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
        background: colorStyle.accentGradient,
        border: `1px solid ${colorStyle.border}`,
        borderRadius: tokens.borderRadius.lg,
        p: 3,
        position: "relative",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        "&:hover": {
          boxShadow: tokens.shadows.md,
          transform: "translateY(-3px)",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: tokens.colors.secondary[600],
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontSize: "0.75rem",
              display: "block",
              mb: 0.5,
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: tokens.colors.secondary[900],
              my: 0.5,
              fontSize: { xs: "1.75rem", md: "2rem" },
              letterSpacing: "-0.02em",
            }}
          >
            {value}
          </Typography>

          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
              {subtitle}
            </Typography>
          )}

          {trend && trendStyle && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}>
              <Chip
                size="small"
                icon={trendStyle.Icon ? <trendStyle.Icon style={{ fontSize: 13, color: trendStyle.text }} /> : undefined}
                label={trend.value}
                sx={{
                  backgroundColor: trendStyle.bg,
                  color: trendStyle.text,
                  fontWeight: 700,
                  fontSize: "0.725rem",
                  height: 22,
                  borderRadius: tokens.borderRadius.sm,
                }}
              />
              {trend.label && (
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  {trend.label}
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {icon && (
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: tokens.borderRadius.md,
              backgroundColor: "#ffffff",
              color: colorStyle.text,
              border: `1px solid ${colorStyle.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: tokens.shadows.sm,
            }}
          >
            {icon}
          </Box>
        )}
      </Box>

      {onClick && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            mt: 2,
            pt: 1.5,
            borderTop: `1px solid ${colorStyle.border}`,
            color: colorStyle.text,
            fontWeight: 700,
            fontSize: "0.8125rem",
          }}
        >
          <span>View Details</span>
          <ChevronRightIcon sx={{ fontSize: 18, ml: 0.5 }} />
        </Box>
      )}
    </AppCard>
  );
}
