import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  Avatar,
  InputAdornment,
  FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleIcon from "@mui/icons-material/People";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SecurityIcon from "@mui/icons-material/Security";
import { PageLayout } from "@/shared/components/ui/layout";
import { AppButton } from "@/shared/components/ui/button";
import { LoadingScreen, ErrorState } from "@/shared/components/ui/feedback";
import { useAppSelector } from "@/app/store/redux";
import { selectUser } from "@/modules/auth/store/selectors";
import { userApi, type UserItem, type CreateUserPayload, type UpdateUserPayload } from "../api/user.api";

export default function UserListPage() {
  const currentUser = useAppSelector(selectUser);
  const isSuperAdmin = currentUser?.roles?.includes("SUPER_ADMIN");

  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Create User Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createPayload, setCreatePayload] = useState<CreateUserPayload>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    jobTitle: "",
    department: "",
    role: "EMPLOYEE",
  });
  const [submitting, setSubmitting] = useState(false);

  // Edit User Modal state
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editPayload, setEditPayload] = useState<UpdateUserPayload>({});

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userApi.getAllUsers(search, 0, 100);
      const data = res.data?.data?.content || res.data?.content || res.data || [];
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleCreateUser = async () => {
    if (!createPayload.firstName.trim() || !createPayload.email.trim() || !createPayload.password.trim()) {
      alert("Please fill in first name, email, and password.");
      return;
    }
    setSubmitting(true);
    try {
      await userApi.createUser(createPayload);
      setIsCreateOpen(false);
      setCreatePayload({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        jobTitle: "",
        department: "",
        role: "EMPLOYEE",
      });
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Failed to create user account");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    setSubmitting(true);
    try {
      await userApi.updateUser(editingUser.id, editPayload);
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Failed to update user account");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user account?")) return;
    try {
      await userApi.deleteUser(id);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Failed to delete user");
    }
  };

  const handleOpenEdit = (user: UserItem) => {
    setEditingUser(user);
    setEditPayload({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      jobTitle: user.jobTitle,
      department: user.department,
      bio: user.bio,
      role: user.roles?.[0] || "EMPLOYEE",
      enabled: user.enabled,
      emailVerified: user.emailVerified,
    });
  };

  const getRoleChip = (roles: string[]) => {
    const role = roles?.[0] || "USER";
    switch (role.toUpperCase()) {
      case "SUPER_ADMIN":
        return <Chip icon={<AdminPanelSettingsIcon />} label="Super Admin" color="error" size="small" sx={{ fontWeight: "bold" }} />;
      case "ADMIN":
        return <Chip icon={<SecurityIcon />} label="Admin" color="primary" size="small" sx={{ fontWeight: "bold" }} />;
      case "HR":
        return <Chip label="HR Manager" color="warning" size="small" sx={{ fontWeight: "bold" }} />;
      case "EMPLOYEE":
        return <Chip label="Employee" color="info" size="small" />;
      case "USER":
      default:
        return <Chip label="Customer / User" color="default" size="small" />;
    }
  };

  const superAdminCount = users.filter((u) => u.roles?.includes("SUPER_ADMIN")).length;
  const adminCount = users.filter((u) => u.roles?.includes("ADMIN")).length;
  const activeCount = users.filter((u) => u.enabled).length;

  if (loading && users.length === 0) {
    return (
      <PageLayout title="User Accounts Management" subtitle="Manage system users, assigned roles, and security permissions">
        <LoadingScreen message="Loading user accounts..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="User Accounts & Role Control"
      subtitle="Manage internal employees, administrators, Super Admin permissions, and customer accounts"
      actions={
        <Box sx={{ display: "flex", gap: 2 }}>
          <IconButton onClick={fetchUsers} color="inherit" title="Refresh">
            <RefreshIcon />
          </IconButton>
          <AppButton variant="contained" startIcon={<AddIcon />} onClick={() => setIsCreateOpen(true)}>
            Add New User
          </AppButton>
        </Box>
      }
    >
      {error && <ErrorState title="Error Loading Users" message={error} onRetry={fetchUsers} />}

      {/* Metrics Row */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 3, mb: 3 }}>
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <PeopleIcon color="primary" sx={{ fontSize: 36 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {users.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total System Users
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <AdminPanelSettingsIcon color="error" sx={{ fontSize: 36 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold" color="error.main">
                {superAdminCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Super Admins
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <SecurityIcon color="info" sx={{ fontSize: 36 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold" color="info.main">
                {adminCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Admins & Managers
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <VerifiedUserIcon color="success" sx={{ fontSize: 36 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold" color="success.main">
                {activeCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Accounts
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Filter / Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search by name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ maxWidth: 400, width: "100%" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Users Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ backgroundColor: "action.hover" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>User Profile</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Assigned Role</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email Verified</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Account Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    No users found matching query.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar sx={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", fontWeight: "bold" }}>
                        {(item.firstName || item.email).charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {item.firstName} {item.lastName || ""}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {item.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{getRoleChip(item.roles)}</TableCell>
                  <TableCell>{item.phone || "N/A"}</TableCell>
                  <TableCell>
                    {item.emailVerified ? (
                      <Chip label="Verified" color="success" size="small" variant="outlined" />
                    ) : (
                      <Chip label="Pending" color="warning" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell>
                    {item.enabled ? (
                      <Chip label="Active" color="success" size="small" />
                    ) : (
                      <Chip label="Disabled" color="default" size="small" />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit User Profile & Role">
                      <IconButton onClick={() => handleOpenEdit(item)} color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    {isSuperAdmin && (
                      <Tooltip title="Delete User Account">
                        <IconButton onClick={() => handleDeleteUser(item.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create User Dialog */}
      <Dialog open={isCreateOpen} onClose={() => !submitting && setIsCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>Add New User Account</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, pt: 1 }}>
            <TextField
              label="First Name"
              fullWidth
              required
              value={createPayload.firstName}
              onChange={(e) => setCreatePayload({ ...createPayload, firstName: e.target.value })}
            />
            <TextField
              label="Last Name"
              fullWidth
              value={createPayload.lastName}
              onChange={(e) => setCreatePayload({ ...createPayload, lastName: e.target.value })}
            />
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              required
              value={createPayload.email}
              onChange={(e) => setCreatePayload({ ...createPayload, email: e.target.value })}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              value={createPayload.password}
              onChange={(e) => setCreatePayload({ ...createPayload, password: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>System Role</InputLabel>
              <Select
                value={createPayload.role}
                label="System Role"
                onChange={(e) => setCreatePayload({ ...createPayload, role: e.target.value })}
              >
                <MenuItem value="SUPER_ADMIN">Super Admin (Full Platform Control)</MenuItem>
                <MenuItem value="ADMIN">Admin (Full Operations)</MenuItem>
                <MenuItem value="HR">HR Manager</MenuItem>
                <MenuItem value="EMPLOYEE">Employee / Staff</MenuItem>
                <MenuItem value="USER">User / Customer</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Phone Number"
              fullWidth
              value={createPayload.phone}
              onChange={(e) => setCreatePayload({ ...createPayload, phone: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setIsCreateOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCreateUser} disabled={submitting || !createPayload.firstName.trim() || !createPayload.email.trim() || !createPayload.password.trim()}>
            {submitting ? "Creating..." : "Create User"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={Boolean(editingUser)} onClose={() => !submitting && setEditingUser(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>Edit User Account & Role</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, pt: 1 }}>
            <TextField
              label="First Name"
              fullWidth
              value={editPayload.firstName || ""}
              onChange={(e) => setEditPayload({ ...editPayload, firstName: e.target.value })}
            />
            <TextField
              label="Last Name"
              fullWidth
              value={editPayload.lastName || ""}
              onChange={(e) => setEditPayload({ ...editPayload, lastName: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>System Role</InputLabel>
              <Select
                value={editPayload.role || "EMPLOYEE"}
                label="System Role"
                onChange={(e) => setEditPayload({ ...editPayload, role: e.target.value })}
              >
                <MenuItem value="SUPER_ADMIN">Super Admin (Full Platform Control)</MenuItem>
                <MenuItem value="ADMIN">Admin (Full Operations)</MenuItem>
                <MenuItem value="HR">HR Manager</MenuItem>
                <MenuItem value="EMPLOYEE">Employee / Staff</MenuItem>
                <MenuItem value="USER">User / Customer</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Phone Number"
              fullWidth
              value={editPayload.phone || ""}
              onChange={(e) => setEditPayload({ ...editPayload, phone: e.target.value })}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={editPayload.enabled ?? true}
                  onChange={(e) => setEditPayload({ ...editPayload, enabled: e.target.checked })}
                  color="success"
                />
              }
              label="Account Enabled"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={editPayload.emailVerified ?? false}
                  onChange={(e) => setEditPayload({ ...editPayload, emailVerified: e.target.checked })}
                  color="primary"
                />
              }
              label="Email Verified"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setEditingUser(null)} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdateUser} disabled={submitting}>
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
}
