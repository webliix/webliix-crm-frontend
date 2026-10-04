import { useState } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Badge from "@mui/material/Badge";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MenuIcon from "@mui/icons-material/Menu";
import { layout } from "@/shared/constants/layout";
import { useAppSelector } from "@/app/store/redux";
import { selectUser, selectAuthenticated } from "@/modules/auth/store/selectors";
import { useLogout } from "@/modules/auth/hooks/useLogout";
import { notificationService } from "@/shared/notifications/notification.service";
import { NotificationDrawer } from "@/shared/components/ui/notification/NotificationDrawer";
import { messages } from "@/shared/constants/messages";
import { AppIconButton } from "@/shared/components/ui/button";
import { AppStatusChip } from "@/shared/components/ui/feedback";
import { WEBLIIX_LOGO_URL } from "@/shared/constants/app.constants";
import { tokens } from "@/theme/tokens";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const authenticated = useAppSelector(selectAuthenticated);
  const logout = useLogout();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    notificationService.success(messages.logoutSuccess);
  };

  const handleGoToProfile = () => {
    handleClose();
    navigate("/profile");
  };

  const userInitial = (user?.firstName || user?.email || "Admin").charAt(0).toUpperCase();
  const userName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email : "Administrator";
  const userRole = user?.roles?.[0] || "ADMIN";

  return (
    <Box
      component="header"
      sx={{
        height: layout.headerHeight,
        px: { xs: 2, sm: 3 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${tokens.colors.secondary[200]}`,
        position: "sticky",
        top: 0,
        zIndex: 1100,
        boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.03)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        {onMenuClick && (
          <AppIconButton
            variant="ghost"
            size="md"
            onClick={onMenuClick}
            tooltip="Open navigation menu"
            sx={{ display: { xs: "inline-flex", md: "none" }, color: tokens.colors.secondary[700] }}
          >
            <MenuIcon />
          </AppIconButton>
        )}
        <Box
          component="img"
          src={WEBLIIX_LOGO_URL}
          alt="Webliix Logo"
          sx={{
            height: 28,
            maxHeight: 28,
            objectFit: "contain",
            cursor: "pointer",
          }}
          onClick={() => navigate("/dashboard")}
        />
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: tokens.colors.secondary[900],
            letterSpacing: "-0.01em",
            display: { xs: "none", sm: "block" },
          }}
        >
          Webliix Hub
        </Typography>
        <AppStatusChip status="v1.0" statusType="primary" sx={{ height: 20, fontSize: "0.7rem", display: { xs: "none", sm: "inline-flex" } }} />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <AppIconButton
          variant="ghost"
          size="md"
          tooltip="Notifications Center"
          onClick={() => setNotifDrawerOpen(true)}
        >
          <Badge badgeContent={unreadCount} color="error" max={99}>
            <NotificationsNoneOutlinedIcon sx={{ fontSize: 20, color: tokens.colors.secondary[600] }} />
          </Badge>
        </AppIconButton>

        <NotificationDrawer
          open={notifDrawerOpen}
          onClose={() => setNotifDrawerOpen(false)}
          onUnreadCountChange={(count) => setUnreadCount(count)}
        />

        {authenticated && (
          <>
            <Box
              onClick={handleOpen}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                p: 0.5,
                pr: 1.5,
                borderRadius: tokens.borderRadius.full,
                cursor: "pointer",
                border: `1px solid ${tokens.colors.secondary[200]}`,
                backgroundColor: tokens.colors.secondary[50],
                transition: tokens.transitions.fast,
                "&:hover": {
                  backgroundColor: tokens.colors.secondary[100],
                  borderColor: tokens.colors.secondary[300],
                },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "#ffffff",
                  boxShadow: "0 2px 8px rgba(99, 102, 241, 0.25)",
                }}
              >
                {userInitial}
              </Avatar>

              <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "left" }}>
                <Typography variant="caption" fontWeight={700} color={tokens.colors.secondary[900]} display="block">
                  {userName}
                </Typography>
              </Box>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              PaperProps={{
                sx: {
                  width: 220,
                  p: 1,
                  borderRadius: tokens.borderRadius.md,
                  boxShadow: tokens.shadows.lg,
                  border: `1px solid ${tokens.colors.secondary[200]}`,
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="body2" fontWeight={700} color={tokens.colors.secondary[900]}>
                  {userName}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {user?.email || "admin@webliix.in"}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <AppStatusChip status={userRole} statusType="info" sx={{ height: 20, fontSize: "0.6875rem" }} />
                </Box>
              </Box>

              <Divider sx={{ my: 1 }} />

              <MenuItem
                onClick={handleGoToProfile}
                sx={{ borderRadius: tokens.borderRadius.xs, fontSize: "0.875rem", gap: 1.5 }}
              >
                <PersonOutlineIcon sx={{ fontSize: 18, color: tokens.colors.secondary[500] }} />
                My Profile
              </MenuItem>

              <MenuItem
                onClick={handleLogout}
                sx={{
                  borderRadius: tokens.borderRadius.xs,
                  fontSize: "0.875rem",
                  gap: 1.5,
                  color: tokens.colors.error.main,
                  "&:hover": { backgroundColor: tokens.colors.error[50] },
                }}
              >
                <LogoutIcon sx={{ fontSize: 18, color: tokens.colors.error.main }} />
                {messages.logout}
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>
    </Box>
  );
}
