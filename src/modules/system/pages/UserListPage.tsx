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
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleIcon from "@mui/icons-material/People";
import SecurityIcon from "@mui/icons-material/Security";
import BadgeIcon from "@mui/icons-material/Badge";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
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
  const [editError, setEditError] = useState<string | null>(null);

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
    setEditError(null);
    try {
      await userApi.updateUser(editingUser.id, editPayload);
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to update user account";
      setEditError(msg);
      alert(msg);
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
    setEditError(null);
    const rawRole = user.roles?.[0] || "EMPLOYEE";
    const cleanRole = rawRole.startsWith("ROLE_") ? rawRole.substring(5) : rawRole;
    setEditPayload({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      jobTitle: user.jobTitle,
      department: user.department,
      bio: user.bio,
      role: cleanRole,
      enabled: user.enabled,
      emailVerified: user.emailVerified,
    });
  };

  const getPrimaryRole = (roles?: string[]) => {
    const rawRole = roles?.[0] || "USER";
    const cleanRole = rawRole.startsWith("ROLE_") ? rawRole.substring(5) : rawRole;
    return cleanRole.toUpperCase();
  };

  const getRoleChip = (roles: string[]) => {
    const role = getPrimaryRole(roles);
    switch (role) {
      case "SUPER_ADMIN":
        return <Chip icon={<AdminPanelSettingsIcon />} label="Super Admin" color="error" size="small" sx={{ fontWeight: "bold" }} />;
      case "ADMIN":
        return <Chip icon={<SecurityIcon />} label="Admin" color="primary" size="small" sx={{ fontWeight: "bold" }} />;
      case "HR":
        return <Chip icon={<BadgeIcon />} label="HR Manager" color="warning" size="small" sx={{ fontWeight: "bold" }} />;
      case "EMPLOYEE":
        return <Chip icon={<PersonIcon />} label="Employee" color="info" size="small" />;
      case "USER":
      default:
        return <Chip icon={<GroupIcon />} label="Customer / User" color="default" size="small" />;
    }
  };

  // Role categorization filter
  const [selectedRoleTab, setSelectedRoleTab] = useState<string>("ALL");

  const superAdminCount = users.filter((u) => getPrimaryRole(u.roles) === "SUPER_ADMIN").length;
  const adminCount = users.filter((u) => getPrimaryRole(u.roles) === "ADMIN").length;
  const hrCount = users.filter((u) => getPrimaryRole(u.roles) === "HR").length;
  const employeeCount = users.filter((u) => getPrimaryRole(u.roles) === "EMPLOYEE").length;
  const customerCount = users.filter((u) => getPrimaryRole(u.roles) === "USER").length;

  const filteredUsers = users.filter((u) => {
    if (selectedRoleTab === "ALL") return true;
    return getPrimaryRole(u.roles) === selectedRoleTab;
  });

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
      subtitle="Categorize and manage internal staff, administrators, Super Admin permissions, and customer accounts"
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

      {/* Metrics Row categorized by roles */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(6, 1fr)" }, gap: 2, mb: 3 }}>
        <Card
          variant="outlined"
          onClick={() => setSelectedRoleTab("ALL")}
          sx={{
            borderRadius: 2,
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            border: selectedRoleTab === "ALL" ? "2px solid" : "1px solid",
            borderColor: selectedRoleTab === "ALL" ? "primary.main" : "divider",
            bgcolor: selectedRoleTab === "ALL" ? "action.hover" : "background.paper",
            "&:hover": { transform: "translateY(-2px)", boxShadow: 2 },
          }}
        >
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary" fontWeight="600">
                All Users
              </Typography>
              <PeopleIcon color="primary" fontSize="small" />
            </Box>
            <Typography variant="h5" fontWeight="bold">
              {users.length}
            </Typography>
          </CardContent>
        </Card>

        <Card
          variant="outlined"
          onClick={() => setSelectedRoleTab("SUPER_ADMIN")}
          sx={{
            borderRadius: 2,
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            border: selectedRoleTab === "SUPER_ADMIN" ? "2px solid" : "1px solid",
            borderColor: selectedRoleTab === "SUPER_ADMIN" ? "error.main" : "divider",
            bgcolor: selectedRoleTab === "SUPER_ADMIN" ? "action.hover" : "background.paper",
            "&:hover": { transform: "translateY(-2px)", boxShadow: 2 },
          }}
        >
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="caption" color="error.main" fontWeight="600">
                Super Admins
              </Typography>
              <AdminPanelSettingsIcon color="error" fontSize="small" />
            </Box>
            <Typography variant="h5" fontWeight="bold" color="error.main">
              {superAdminCount}
            </Typography>
          </CardContent>
        </Card>

        <Card
          variant="outlined"
          onClick={() => setSelectedRoleTab("ADMIN")}
          sx={{
            borderRadius: 2,
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            border: selectedRoleTab === "ADMIN" ? "2px solid" : "1px solid",
            borderColor: selectedRoleTab === "ADMIN" ? "primary.main" : "divider",
            bgcolor: selectedRoleTab === "ADMIN" ? "action.hover" : "background.paper",
            "&:hover": { transform: "translateY(-2px)", boxShadow: 2 },
          }}
        >
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="caption" color="primary.main" fontWeight="600">
                Admins
              </Typography>
              <SecurityIcon color="primary" fontSize="small" />
            </Box>
            <Typography variant="h5" fontWeight="bold" color="primary.main">
              {adminCount}
            </Typography>
          </CardContent>
        </Card>

        <Card
          variant="outlined"
          onClick={() => setSelectedRoleTab("HR")}
          sx={{
            borderRadius: 2,
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            border: selectedRoleTab === "HR" ? "2px solid" : "1px solid",
            borderColor: selectedRoleTab === "HR" ? "warning.main" : "divider",
            bgcolor: selectedRoleTab === "HR" ? "action.hover" : "background.paper",
            "&:hover": { transform: "translateY(-2px)", boxShadow: 2 },
          }}
        >
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="caption" color="warning.main" fontWeight="600">
                HR Managers
              </Typography>
              <BadgeIcon color="warning" fontSize="small" />
            </Box>
            <Typography variant="h5" fontWeight="bold" color="warning.main">
              {hrCount}
            </Typography>
          </CardContent>
        </Card>

        <Card
          variant="outlined"
          onClick={() => setSelectedRoleTab("EMPLOYEE")}
          sx={{
            borderRadius: 2,
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            border: selectedRoleTab === "EMPLOYEE" ? "2px solid" : "1px solid",
            borderColor: selectedRoleTab === "EMPLOYEE" ? "info.main" : "divider",
            bgcolor: selectedRoleTab === "EMPLOYEE" ? "action.hover" : "background.paper",
            "&:hover": { transform: "translateY(-2px)", boxShadow: 2 },
          }}
        >
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="caption" color="info.main" fontWeight="600">
                Employees
              </Typography>
              <PersonIcon color="info" fontSize="small" />
            </Box>
            <Typography variant="h5" fontWeight="bold" color="info.main">
              {employeeCount}
            </Typography>
          </CardContent>
        </Card>

        <Card
          variant="outlined"
          onClick={() => setSelectedRoleTab("USER")}
          sx={{
            borderRadius: 2,
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            border: selectedRoleTab === "USER" ? "2px solid" : "1px solid",
            borderColor: selectedRoleTab === "USER" ? "text.primary" : "divider",
            bgcolor: selectedRoleTab === "USER" ? "action.hover" : "background.paper",
            "&:hover": { transform: "translateY(-2px)", boxShadow: 2 },
          }}
        >
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary" fontWeight="600">
                Customers / Users
              </Typography>
              <GroupIcon color="action" fontSize="small" />
            </Box>
            <Typography variant="h5" fontWeight="bold">
              {customerCount}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Role Categorization Tabs & Search Toolbar */}
      <Paper variant="outlined" sx={{ borderRadius: 2, p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "stretch", md: "center" }, justifyContent: "space-between", gap: 2 }}>
          <Tabs
            value={selectedRoleTab}
            onChange={(_, val) => setSelectedRoleTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                minHeight: 44,
                fontSize: "0.875rem",
              },
            }}
          >
            <Tab
              value="ALL"
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>All Roles</span>
                  <Chip label={users.length} size="small" sx={{ height: 20, fontSize: "0.75rem", fontWeight: "bold" }} />
                </Box>
              }
            />
            <Tab
              value="SUPER_ADMIN"
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>Super Admin</span>
                  <Chip label={superAdminCount} size="small" color="error" sx={{ height: 20, fontSize: "0.75rem", fontWeight: "bold" }} />
                </Box>
              }
            />
            <Tab
              value="ADMIN"
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>Admin</span>
                  <Chip label={adminCount} size="small" color="primary" sx={{ height: 20, fontSize: "0.75rem", fontWeight: "bold" }} />
                </Box>
              }
            />
            <Tab
              value="HR"
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>HR</span>
                  <Chip label={hrCount} size="small" color="warning" sx={{ height: 20, fontSize: "0.75rem", fontWeight: "bold" }} />
                </Box>
              }
            />
            <Tab
              value="EMPLOYEE"
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>Employee</span>
                  <Chip label={employeeCount} size="small" color="info" sx={{ height: 20, fontSize: "0.75rem", fontWeight: "bold" }} />
                </Box>
              }
            />
            <Tab
              value="USER"
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>Customer / User</span>
                  <Chip label={customerCount} size="small" sx={{ height: 20, fontSize: "0.75rem", fontWeight: "bold" }} />
                </Box>
              }
            />
          </Tabs>

          <TextField
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ minWidth: { xs: "100%", md: 320 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Paper>

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
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    No users found matching selected category ({selectedRoleTab}).
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((item) => (
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
          {editError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {editError}
            </Alert>
          )}
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
