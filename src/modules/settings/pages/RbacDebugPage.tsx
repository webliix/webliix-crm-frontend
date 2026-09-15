import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { PageLayout } from "@/shared/components/ui/layout";
import { AppCard } from "@/shared/components/ui/card";
import { AppStatusChip } from "@/shared/components/ui/feedback";
import { useAppSelector } from "@/app/store/redux";
import { selectUser } from "@/modules/auth/store/selectors";
import { usePermission } from "@/shared/rbac/hooks/usePermission";
import { useRole } from "@/shared/rbac/hooks/useRole";
import { tokens } from "@/theme/tokens";

export default function RbacDebugPage() {
  const user = useAppSelector(selectUser);
  const { permissions } = usePermission();
  const { roles } = useRole();

  return (
    <PageLayout
      title="RBAC & Permission Inspector"
      subtitle="Verify active user roles, security scopes, and client-side permissions"
    >
      <Box sx={{ display: "grid", gap: 3 }}>
        {/* User Card */}
        <AppCard title="Authenticated User Profile" padding="lg">
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2, mt: 1 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Full Name
              </Typography>
              <Typography variant="body1" fontWeight={600} color={tokens.colors.secondary[900]}>
                {user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "N/A" : "No user logged in"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Email Address
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {user?.email || "N/A"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                User ID
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                #{user?.id ?? "N/A"}
              </Typography>
            </Box>
          </Box>
        </AppCard>

        {/* Roles Card */}
        <AppCard title="Assigned Roles" subtitle="Active role claims parsed from security context" padding="lg">
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mt: 1 }}>
            {roles.length > 0 ? (
              roles.map((role) => <AppStatusChip key={role} status={role} statusType="primary" />)
            ) : (
              <Typography variant="body2" color="text.secondary">
                No roles assigned.
              </Typography>
            )}
          </Box>
        </AppCard>

        {/* Permissions Card */}
        <AppCard
          title="Granted Permission Scopes"
          subtitle="Specific granular resource permissions evaluated for current session"
          padding="lg"
        >
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
            {permissions.length > 0 ? (
              permissions.map((perm) => (
                <AppStatusChip key={perm} status={perm} statusType="neutral" />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No explicit permissions loaded.
              </Typography>
            )}
          </Box>
        </AppCard>
      </Box>
    </PageLayout>
  );
}
