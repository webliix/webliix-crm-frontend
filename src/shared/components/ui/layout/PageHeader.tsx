import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { AppIconButton } from "@/shared/components/ui/button";
import { tokens } from "@/theme/tokens";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  status?: ReactNode;
  onBack?: () => void;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  status,
  onBack,
}: PageHeaderProps) {
  return (
    <Box sx={{ mb: 3.5 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon sx={{ fontSize: 14, color: tokens.colors.secondary[400] }} />}
          sx={{ mb: 1.5 }}
        >
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return isLast ? (
              <Typography
                key={item.label}
                variant="caption"
                color="text.primary"
                fontWeight={600}
              >
                {item.label}
              </Typography>
            ) : (
              <Link
                key={item.label}
                underline="hover"
                color="inherit"
                variant="caption"
                href={item.href || "#"}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  }
                }}
                sx={{
                  color: tokens.colors.secondary[500],
                  cursor: "pointer",
                  "&:hover": { color: tokens.colors.primary.main },
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {onBack && (
            <AppIconButton
              variant="ghost"
              size="sm"
              onClick={onBack}
              tooltip="Back"
            >
              <ArrowBackIcon sx={{ fontSize: 18 }} />
            </AppIconButton>
          )}

          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: tokens.colors.secondary[900],
                  letterSpacing: "-0.015em",
                }}
              >
                {title}
              </Typography>
              {status}
            </Box>

            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {actions && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
              alignSelf: { xs: "stretch", sm: "auto" },
              justifyContent: { xs: "flex-start", sm: "flex-end" },
            }}
          >
            {actions}
          </Box>
        )}
      </Box>
    </Box>
  );
}
