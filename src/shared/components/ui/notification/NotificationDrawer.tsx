import { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import CloseIcon from "@mui/icons-material/Close";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import SystemUpdateOutlinedIcon from "@mui/icons-material/SystemUpdateOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CircleIcon from "@mui/icons-material/Circle";
import { tokens } from "@/theme/tokens";
import { useNavigate } from "react-router-dom";
import { userNotificationApi, type BackendNotificationItem } from "@/shared/notifications/userNotificationApi";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: "leads" | "comments" | "security" | "system";
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
}

function mapBackendToUI(item: BackendNotificationItem): NotificationItem {
  const refType = (item.referenceType || "").toUpperCase();
  let category: NotificationItem["category"] = "system";
  let actionUrl: string | undefined;
  let actionLabel: string | undefined;

  if (refType.includes("LEAD")) {
    category = "leads";
    actionUrl = "/crm/leads";
    actionLabel = `View Lead #${item.referenceId || "Detail"}`;
  } else if (refType.includes("BLOG") || refType.includes("COMMENT")) {
    category = "comments";
    actionUrl = "/blog";
    actionLabel = "Read Article";
  } else if (refType.includes("SECURITY") || refType.includes("AUTH")) {
    category = "security";
    actionUrl = "/profile";
    actionLabel = "Security Settings";
  }

  return {
    id: String(item.id),
    title: item.title,
    message: item.message,
    category,
    timestamp: item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
    read: item.status === "READ",
    actionUrl,
    actionLabel,
  };
}

export function NotificationDrawer({ open, onClose, onUnreadCountChange }: NotificationDrawerProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");

  const loadNotificationsFromBackend = async () => {
    try {
      const data = await userNotificationApi.getNotifications();
      const mapped = data.map(mapBackendToUI);
      setNotifications(mapped);
      const unread = mapped.filter((n) => !n.read).length;
      if (onUnreadCountChange) onUnreadCountChange(unread);
    } catch {
      // Backend error fallback
    }
  };

  useEffect(() => {
    if (open) {
      loadNotificationsFromBackend();
    }
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    try {
      await userNotificationApi.markAllAsRead();
    } catch (_) {}
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      if (onUnreadCountChange) onUnreadCountChange(0);
      return updated;
    });
  };

  const handleClearAll = async () => {
    try {
      await userNotificationApi.clearAllNotifications();
    } catch (_) {}
    setNotifications([]);
    if (onUnreadCountChange) onUnreadCountChange(0);
  };

  const handleToggleRead = async (id: string) => {
    try {
      await userNotificationApi.markAsRead(id);
    } catch (_) {}
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n));
      const newUnread = updated.filter((n) => !n.read).length;
      if (onUnreadCountChange) onUnreadCountChange(newUnread);
      return updated;
    });
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await userNotificationApi.deleteNotification(id);
    } catch (_) {}
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      const newUnread = updated.filter((n) => !n.read).length;
      if (onUnreadCountChange) onUnreadCountChange(newUnread);
      return updated;
    });
  };

  const handleActionClick = (url?: string) => {
    onClose();
    if (url) {
      navigate(url);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.read;
    if (activeTab === "all") return true;
    return n.category === activeTab;
  });

  const getCategoryIcon = (category: NotificationItem["category"]) => {
    switch (category) {
      case "leads":
        return <PersonAddOutlinedIcon sx={{ fontSize: 18, color: tokens.colors.primary.main }} />;
      case "comments":
        return <CommentOutlinedIcon sx={{ fontSize: 18, color: tokens.colors.info.main }} />;
      case "security":
        return <SecurityOutlinedIcon sx={{ fontSize: 18, color: tokens.colors.warning.main }} />;
      case "system":
      default:
        return <SystemUpdateOutlinedIcon sx={{ fontSize: 18, color: tokens.colors.success.main }} />;
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 440 },
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ffffff",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${tokens.colors.secondary[200]}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <NotificationsNoneOutlinedIcon sx={{ color: tokens.colors.primary.main, fontSize: 24 }} />
          <Typography variant="h6" fontWeight={700} color={tokens.colors.secondary[900]}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Chip
              label={`${unreadCount} New`}
              size="small"
              sx={{
                height: 22,
                fontSize: "0.725rem",
                fontWeight: 700,
                backgroundColor: tokens.colors.primary.main,
                color: "#ffffff",
              }}
            />
          )}
        </Box>

        <IconButton onClick={onClose} size="small" aria-label="Close notifications">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Action Toolbar */}
      <Box
        sx={{
          px: 2.5,
          py: 1.25,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: tokens.colors.secondary[50],
          borderBottom: `1px solid ${tokens.colors.secondary[200]}`,
        }}
      >
        <Button
          size="small"
          startIcon={<DoneAllIcon sx={{ fontSize: 16 }} />}
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          sx={{ fontSize: "0.775rem", fontWeight: 600 }}
        >
          Mark all as read
        </Button>

        <Button
          size="small"
          color="error"
          startIcon={<DeleteSweepIcon sx={{ fontSize: 16 }} />}
          onClick={handleClearAll}
          disabled={notifications.length === 0}
          sx={{ fontSize: "0.775rem", fontWeight: 600 }}
        >
          Clear all
        </Button>
      </Box>

      {/* Filter Tabs */}
      <Box sx={{ borderBottom: `1px solid ${tokens.colors.secondary[200]}` }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 40,
            "& .MuiTab-root": {
              minHeight: 40,
              fontSize: "0.775rem",
              fontWeight: 600,
              px: 2,
              textTransform: "none",
            },
          }}
        >
          <Tab value="all" label={`All (${notifications.length})`} />
          <Tab value="unread" label={`Unread (${unreadCount})`} />
          <Tab value="leads" label="Leads" />
          <Tab value="comments" label="Comments" />
          <Tab value="security" label="Security" />
          <Tab value="system" label="System" />
        </Tabs>
      </Box>

      {/* Notification List Content */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {filteredNotifications.length > 0 ? (
          <Box sx={{ display: "grid", gap: 1.5 }}>
            {filteredNotifications.map((item) => (
              <Box
                key={item.id}
                sx={{
                  p: 2,
                  borderRadius: tokens.borderRadius.md,
                  border: `1px solid ${item.read ? tokens.colors.secondary[200] : tokens.colors.primary[200]}`,
                  backgroundColor: item.read ? "#ffffff" : tokens.colors.primary[50],
                  position: "relative",
                  transition: tokens.transitions.fast,
                  "&:hover": {
                    borderColor: tokens.colors.primary[400],
                    boxShadow: tokens.shadows.sm,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1, mb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {getCategoryIcon(item.category)}
                    <Typography variant="subtitle2" fontWeight={700} color={tokens.colors.secondary[900]}>
                      {item.title}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {!item.read && (
                      <CircleIcon
                        sx={{ fontSize: 8, color: tokens.colors.primary.main }}
                        titleAccess="Unread notification"
                      />
                    )}
                    <IconButton
                      size="small"
                      onClick={() => handleToggleRead(item.id)}
                      title={item.read ? "Mark as unread" : "Mark as read"}
                      sx={{ p: 0.5 }}
                    >
                      <DoneAllIcon sx={{ fontSize: 14, color: item.read ? tokens.colors.secondary[400] : tokens.colors.primary.main }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteItem(item.id)}
                      title="Dismiss notification"
                      sx={{ p: 0.5 }}
                    >
                      <CloseIcon sx={{ fontSize: 14, color: tokens.colors.secondary[400] }} />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8125rem", mb: 1.5, leading: 1.5 }}>
                  {item.message}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.725rem", fontWeight: 500 }}>
                    {item.timestamp}
                  </Typography>

                  {item.actionUrl && (
                    <Button
                      size="small"
                      endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                      onClick={() => handleActionClick(item.actionUrl)}
                      sx={{ fontSize: "0.75rem", fontWeight: 700, p: 0, minWidth: "auto" }}
                    >
                      {item.actionLabel || "View Details"}
                    </Button>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <NotificationsNoneOutlinedIcon sx={{ fontSize: 44, color: tokens.colors.secondary[300], mb: 1.5 }} />
            <Typography variant="subtitle1" fontWeight={700} color={tokens.colors.secondary[700]}>
              No notifications found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: "0.8125rem" }}>
              {activeTab === "unread" ? "You have read all your notifications!" : "Check back later for new alerts and activity."}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Footer link to Profile settings */}
      <Divider />
      <Box sx={{ p: 2, textAlign: "center", backgroundColor: tokens.colors.secondary[50] }}>
        <Button
          size="small"
          onClick={() => {
            onClose();
            navigate("/profile");
          }}
          sx={{ fontSize: "0.8125rem", fontWeight: 700 }}
        >
          Manage Notification Preferences
        </Button>
      </Box>
    </Drawer>
  );
}
