import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { AppCard } from "@/shared/components/ui/card";
import { AppStatusChip, EmptyState } from "@/shared/components/ui/feedback";
import { useDashboard } from "@/modules/dashboard/hooks/useDashboard";
import { formatRelativeTime } from "@/shared/utils/formatters";
import { tokens } from "@/theme/tokens";

export function DashboardActivity() {
  const { data } = useDashboard();
  const activities = data?.recentActivity || [];

  const getActionIcon = (action?: string) => {
    switch ((action || "").toUpperCase()) {
      case "LOGIN":
        return <LockOutlinedIcon sx={{ fontSize: 18 }} />;
      case "CREATE":
        return <AddCircleOutlineIcon sx={{ fontSize: 18 }} />;
      case "UPDATE":
        return <EditOutlinedIcon sx={{ fontSize: 18 }} />;
      case "DELETE":
        return <DeleteOutlineIcon sx={{ fontSize: 18 }} />;
      default:
        return <HistoryOutlinedIcon sx={{ fontSize: 18 }} />;
    }
  };

  const getActionColor = (action?: string) => {
    switch ((action || "").toUpperCase()) {
      case "CREATE":
        return { bg: tokens.colors.success[50], color: tokens.colors.success.main };
      case "DELETE":
        return { bg: tokens.colors.error[50], color: tokens.colors.error.main };
      case "UPDATE":
        return { bg: tokens.colors.info[50], color: tokens.colors.info.main };
      case "LOGIN":
      default:
        return { bg: tokens.colors.primary[50], color: tokens.colors.primary.main };
    }
  };

  return (
    <AppCard
      title="System Audit & Activity Trail"
      subtitle="Real-time security and administrative events recorded across the platform"
      padding="lg"
    >
      {activities.length === 0 ? (
        <EmptyState
          title="No Recent Activity"
          message="System events and user audit trails will appear here automatically."
        />
      ) : (
        <List disablePadding sx={{ mt: 1 }}>
          {activities.map((item, index) => {
            const actionStyle = getActionColor(String(item.action));
            const userLabel = item.username || (item.userId ? `User #${item.userId}` : "System");
            const entityLabel = item.entityType ? `${item.entityType} ${item.entityId ? `#${item.entityId}` : ""}` : "";

            return (
              <ListItem
                key={item.id ?? index}
                disableGutters
                sx={{
                  py: 1.75,
                  borderBottom:
                    index < activities.length - 1
                      ? `1px solid ${tokens.colors.secondary[100]}`
                      : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1, minWidth: 0 }}>
                  <Avatar
                    sx={{
                      width: 38,
                      height: 38,
                      bgcolor: actionStyle.bg,
                      color: actionStyle.color,
                      border: `1px solid ${tokens.colors.secondary[200]}`,
                      flexShrink: 0,
                    }}
                  >
                    {getActionIcon(String(item.action))}
                  </Avatar>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} color={tokens.colors.secondary[900]} noWrap>
                      {String(item.action || "EVENT")} {entityLabel ? `• ${entityLabel}` : ""}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" noWrap>
                      Triggered by: {userLabel} • IP: {item.ipAddress || "Internal"}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
                  {item.module && (
                    <AppStatusChip
                      status={String(item.module)}
                      statusType="neutral"
                      sx={{ height: 20, fontSize: "0.6875rem" }}
                    />
                  )}
                  {item.status && (
                    <AppStatusChip
                      status={String(item.status)}
                      statusType={item.status === "SUCCESS" ? "success" : "error"}
                      sx={{ height: 20, fontSize: "0.6875rem" }}
                    />
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {formatRelativeTime(item.createdAt)}
                  </Typography>
                </Box>
              </ListItem>
            );
          })}
        </List>
      )}
    </AppCard>
  );
}
