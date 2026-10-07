import { useState, type ReactNode } from "react";
import Card, { type CardProps as MuiCardProps } from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "@/theme/tokens";

export type CardVariant = "outlined" | "elevated" | "flat";
export type CardPadding = "none" | "sm" | "md" | "lg";
export type CardAccentColor = "primary" | "success" | "warning" | "error" | "info" | "secondary";

export interface AppCardProps extends Omit<MuiCardProps, "variant" | "title"> {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
  badge?: ReactNode;
  headerIcon?: ReactNode;
  accentColor?: CardAccentColor;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  cardVariant?: CardVariant;
  padding?: CardPadding;
  hoverable?: boolean;
  headerBorder?: boolean;
  footerBorder?: boolean;
}

const ACCENT_COLOR_MAP: Record<CardAccentColor, string> = {
  primary: tokens.colors.primary.main,
  success: tokens.colors.success.main,
  warning: tokens.colors.warning.main,
  error: tokens.colors.error.main,
  info: tokens.colors.info.main,
  secondary: tokens.colors.secondary[700],
};

export function AppCard({
  children,
  title,
  subtitle,
  action,
  footer,
  badge,
  headerIcon,
  accentColor,
  collapsible = false,
  defaultExpanded = true,
  cardVariant = "outlined",
  padding = "md",
  hoverable = false,
  headerBorder = false,
  footerBorder = false,
  sx,
  ...props
}: AppCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const getPaddingStyles = () => {
    switch (padding) {
      case "none":
        return 0;
      case "sm":
        return { xs: 1.5, sm: 2 };
      case "lg":
        return { xs: 2.5, sm: 4 };
      case "md":
      default:
        return { xs: 2, sm: 3 };
    }
  };

  const getVariantStyles = () => {
    switch (cardVariant) {
      case "elevated":
        return {
          boxShadow: tokens.shadows.md,
          border: `1px solid ${tokens.colors.secondary[100]}`,
          backgroundColor: "#ffffff",
        };
      case "flat":
        return {
          boxShadow: "none",
          border: "none",
          backgroundColor: tokens.colors.secondary[50],
        };
      case "outlined":
      default:
        return {
          boxShadow: tokens.shadows.card,
          border: `1px solid ${tokens.colors.secondary[200]}`,
          backgroundColor: "#ffffff",
        };
    }
  };

  const hasHeader = Boolean(title || subtitle || action || badge || headerIcon || collapsible);

  return (
    <Card
      sx={{
        borderRadius: "10px",
        position: "relative",
        overflow: "hidden",
        transition: `all ${tokens.transitions.normal}`,
        ...(accentColor && {
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            backgroundColor: ACCENT_COLOR_MAP[accentColor] || ACCENT_COLOR_MAP.primary,
            zIndex: 1,
          },
        }),
        ...(hoverable && {
          "&:hover": {
            boxShadow: tokens.shadows.cardHover,
            borderColor: tokens.colors.primary[300],
            transform: "translateY(-2px)",
          },
        }),
        ...getVariantStyles(),
        ...sx,
      }}
      {...props}
    >
      {hasHeader && (
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexWrap: "wrap" }}>
              {headerIcon && (
                <Box sx={{ display: "flex", alignItems: "center", color: tokens.colors.primary.main }}>
                  {headerIcon}
                </Box>
              )}
              {typeof title === "string" ? (
                <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: "1rem", sm: "1.125rem" }, color: tokens.colors.secondary[900] }}>
                  {title}
                </Typography>
              ) : (
                title
              )}
              {badge && (
                typeof badge === "string" ? (
                  <Chip label={badge} size="small" sx={{ height: 20, fontSize: "0.7rem", fontWeight: 700, backgroundColor: tokens.colors.primary[50], color: tokens.colors.primary.main }} />
                ) : (
                  badge
                )
              )}
            </Box>
          }
          subheader={
            typeof subtitle === "string" ? (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25, display: "block" }}>
                {subtitle}
              </Typography>
            ) : (
              subtitle
            )
          }
          action={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {action}
              {collapsible && (
                <IconButton
                  size="small"
                  onClick={() => setExpanded((prev) => !prev)}
                  sx={{
                    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: tokens.transitions.fast,
                    color: tokens.colors.secondary[600],
                  }}
                  aria-label={expanded ? "Collapse card" : "Expand card"}
                >
                  <ExpandMoreIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          }
          sx={{
            p: getPaddingStyles(),
            pb: title && children && expanded ? 0 : getPaddingStyles(),
            flexWrap: "wrap",
            gap: 1,
            "& .MuiCardHeader-action": {
              margin: 0,
              alignSelf: "center",
            },
            ...(headerBorder && {
              borderBottom: `1px solid ${tokens.colors.secondary[200]}`,
              pb: getPaddingStyles(),
            }),
          }}
        />
      )}

      {children && (
        collapsible ? (
          <Collapse in={expanded} timeout="auto" unmountOnExit={false}>
            <CardContent
              sx={{
                p: getPaddingStyles(),
                "&:last-child": {
                  pb: getPaddingStyles(),
                },
              }}
            >
              {children}
            </CardContent>
          </Collapse>
        ) : (
          <CardContent
            sx={{
              p: getPaddingStyles(),
              "&:last-child": {
                pb: getPaddingStyles(),
              },
            }}
          >
            {children}
          </CardContent>
        )
      )}

      {footer && (
        <Collapse in={!collapsible || expanded} timeout="auto">
          <CardActions
            sx={{
              p: getPaddingStyles(),
              pt: 0,
              ...(footerBorder && {
                borderTop: `1px solid ${tokens.colors.secondary[200]}`,
                pt: getPaddingStyles(),
              }),
            }}
          >
            <Box sx={{ width: "100%" }}>{footer}</Box>
          </CardActions>
        </Collapse>
      )}
    </Card>
  );
}
