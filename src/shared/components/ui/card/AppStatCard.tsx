import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
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
          color: "success.main",
          border: tokens.colors.success[200],
        };
      case "warning":
        return {
          color: "warning.main",
          border: tokens.colors.warning[200],
        };
      case "error":
        return {
          color: "error.main",
          border: tokens.colors.error[200],
        };
      case "info":
        return {
          color: "info.main",
          border: tokens.colors.info[200],
        };
      case "primary":
      default:
        return {
          color: "primary.main",
          border: tokens.colors.primary[200],
        };
    }
  };

  const getTrendColor = () => {
    if (!trend) return undefined;
    switch (trend.direction) {
      case "up":
        return {
          color: "success" as const,
          Icon: ArrowUpwardIcon,
        };
      case "down":
        return {
          color: "error" as const,
          Icon: ArrowDownwardIcon,
        };
      case "neutral":
      default:
        return {
          color: "default" as const,
          Icon: undefined,
        };
    }
  };

  const colorStyle = getColorTokens();
  const trendStyle = getTrendColor();

  return (
    <Card
      variant="outlined"
      onClick={onClick}
      sx={{
        borderRadius: 2,
        cursor: onClick ? "pointer" : "default",
        height: "100%",
        transition: "all 0.2s ease",
        "&:hover": onClick
          ? {
              borderColor: colorStyle.color,
              boxShadow: 1,
              transform: "translateY(-2px)",
            }
          : undefined,
      }}
    >
      <CardContent sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 2.5 }}>
        {icon && (
          <Box
            sx={{
              color: colorStyle.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        )}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: colorStyle.color,
              lineHeight: 1.2,
            }}
          >
            {value}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500, mt: 0.25 }}
            noWrap
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
              {subtitle}
            </Typography>
          )}

          {trend && trendStyle && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 0.75 }}>
              <Chip
                size="small"
                icon={trendStyle.Icon ? <trendStyle.Icon style={{ fontSize: 12 }} /> : undefined}
                label={trend.value}
                color={trendStyle.color}
                sx={{
                  fontWeight: "bold",
                  fontSize: "0.6875rem",
                  height: 20,
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

        {onClick && (
          <ChevronRightIcon sx={{ color: "text.secondary", fontSize: 20, flexShrink: 0 }} />
        )}
      </CardContent>
    </Card>
  );
}
