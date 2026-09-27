import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import { layout } from "@/shared/constants/layout";
import { useNavigation } from "@/app/navigation/hooks/useNavigation";
import { SidebarMenuItem } from "@/app/navigation/components/SidebarMenuItem";
import { tokens } from "@/theme/tokens";
import { WEBLIIX_LOGO_URL } from "@/shared/constants/app.constants";

interface DashboardSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function DashboardSidebar({ mobileOpen = false, onMobileClose }: DashboardSidebarProps) {
  const navigationItems = useNavigation();

  const sidebarContent = (
    <Box
      sx={{
        width: layout.sidebarWidth,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: tokens.colors.secondary[50],
        borderRight: `1px solid ${tokens.colors.secondary[200]}`,
      }}
    >
      {/* Sidebar Header / Logo */}
      <Box
        sx={{
          height: layout.headerHeight,
          px: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: `1px solid ${tokens.colors.secondary[200]}`,
          bgcolor: "#ffffff",
        }}
      >
        <Box
          component="img"
          src={WEBLIIX_LOGO_URL}
          alt="Webliix Logo"
          sx={{
            height: 42,
            maxHeight: 42,
            objectFit: "contain",
            borderRadius: tokens.borderRadius.xs,
          }}
        />
        <Box>
          <Typography variant="subtitle2" fontWeight={800} color={tokens.colors.secondary[900]} lineHeight={1.2}>
            Webliix Hub
          </Typography>
          <Typography variant="caption" color="text.secondary" fontSize="0.6875rem">
            ERP & CRM Platform
          </Typography>
        </Box>
      </Box>

      {/* Navigation List */}
      <Box sx={{ flex: 1, py: 2, overflowY: "auto" }}>
        <Box sx={{ px: 3, pb: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: tokens.colors.secondary[400],
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontSize: "0.6875rem",
            }}
          >
            Main Menu
          </Typography>
        </Box>

        <List disablePadding>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.path} item={item} onClick={onMobileClose} />
          ))}

          {navigationItems.length === 0 && (
            <Box sx={{ px: 3, py: 2, color: "text.secondary", fontSize: "0.875rem" }}>
              No accessible sections
            </Box>
          )}
        </List>
      </Box>

      {/* Sidebar Footer */}
      <Divider />
      <Box sx={{ p: 2.5, textAlign: "center", bgcolor: tokens.colors.secondary[50] }}>
        <Typography variant="caption" color="text.secondary" fontWeight={500}>
          Webliix v1.0.0 (Production)
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer (xs & sm screens) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: layout.sidebarWidth,
            borderRight: `1px solid ${tokens.colors.secondary[200]}`,
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Desktop Persistent Sidebar (md and above) */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: layout.sidebarWidth,
          minHeight: "100vh",
          borderRight: `1px solid ${tokens.colors.secondary[200]}`,
          bgcolor: "#ffffff",
          flexShrink: 0,
        }}
      >
        {sidebarContent}
      </Box>
    </>
  );
}
