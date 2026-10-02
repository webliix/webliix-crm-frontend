import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
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
        return { bg: "action.hover", color: "success.main" };
      case "DELETE":
        return { bg: "action.hover", color: "error.main" };
      case "UPDATE":
        return { bg: "action.hover", color: "info.main" };
      case "LOGIN":
      default:
        return { bg: "action.hover", color: "primary.main" };
    }
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardHeader
        avatar={<SecurityOutlinedIcon color="primary" />}
        title={<Typography variant="subtitle1" fontWeight="bold">System Audit & Activity Trail</Typography>}
        subheader="Real-time security and administrative events recorded across the platform"
        sx={{ pb: 1 }}
      />
      <Divider />
      <CardContent sx={{ pt: 1 }}>
        {activities.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              System events and user audit trails will appear here automatically.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {activities.map((item, index) => {
              const actionStyle = getActionColor(String(item.action));
              const userLabel = item.username || (item.userId ? `User #${item.userId}` : "System");
              const entityLabel = item.entityType ? `${item.entityType} ${item.entityId ? `#${item.entityId}` : ""}` : "";

              return (
                <ListItem
                  key={item.id ?? index}
                  disableGutters
                  sx={{
                    py: 1.5,
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
                        width: 36,
                        height: 36,
                        bgcolor: actionStyle.bg,
                        color: actionStyle.color,
                        border: `1px solid ${tokens.colors.secondary[200]}`,
                        flexShrink: 0,
                      }}
                    >
                      {getActionIcon(String(item.action))}
                    </Avatar>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" fontWeight="bold" color="text.primary" noWrap>
                        {String(item.action || "EVENT")} {entityLabel ? `• ${entityLabel}` : ""}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" noWrap>
                        Triggered by: <strong>{userLabel}</strong> • IP: {item.ipAddress || "Internal"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
                    {item.module && (
                      <Chip
                        label={String(item.module)}
                        size="small"
                        sx={{ height: 22, fontSize: "0.6875rem", fontWeight: "bold" }}
                      />
                    )}
                    {item.status && (
                      <Chip
                        label={String(item.status)}
                        color={item.status === "SUCCESS" ? "success" : "error"}
                        size="small"
                        sx={{ height: 22, fontSize: "0.6875rem", fontWeight: "bold" }}
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
      </CardContent>
    </Card>
  );
}
