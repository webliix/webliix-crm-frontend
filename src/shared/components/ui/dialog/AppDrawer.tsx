import { type ReactNode } from "react";
import Drawer, { type DrawerProps } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import { AppIconButton } from "@/shared/components/ui/button";
import { tokens } from "@/theme/tokens";

export interface AppDrawerProps extends Omit<DrawerProps, "title"> {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  width?: number | string;
  onClose?: () => void;
}

export function AppDrawer({
  children,
  title,
  subtitle,
  actions,
  width = 460,
  open,
  onClose,
  ...props
}: AppDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: width },
          boxShadow: tokens.shadows.xl,
          borderLeft: `1px solid ${tokens.colors.secondary[200]}`,
          display: "flex",
          flexDirection: "column",
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(2px)",
          backgroundColor: "rgba(15, 23, 42, 0.3)",
        },
      }}
      {...props}
    >
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          bgcolor: "#ffffff",
        }}
      >
        <Box sx={{ pr: 2 }}>
          {typeof title === "string" ? (
            <Typography variant="h6" fontWeight={700} color={tokens.colors.secondary[900]} sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>
              {title}
            </Typography>
          ) : (
            title
          )}
          {subtitle && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {onClose && (
          <AppIconButton
            variant="ghost"
            size="sm"
            onClick={onClose}
            tooltip="Close"
            sx={{ color: tokens.colors.secondary[400] }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </AppIconButton>
        )}
      </Box>

      <Divider />

      <Box sx={{ p: { xs: 2, sm: 3 }, flex: 1, overflowY: "auto", bgcolor: "#ffffff" }}>
        {children}
      </Box>

      {actions && (
        <>
          <Divider />
          <Box
            sx={{
              p: { xs: 2, sm: 2.5 },
              px: { xs: 2, sm: 3 },
              bgcolor: tokens.colors.secondary[50],
              display: "flex",
              flexDirection: { xs: "column-reverse", sm: "row" },
              justifyContent: "flex-end",
              alignItems: { xs: "stretch", sm: "center" },
              gap: 1.5,
              "& > *": {
                width: { xs: "100%", sm: "auto" },
              },
            }}
          >
            {actions}
          </Box>
        </>
      )}
    </Drawer>
  );
}
