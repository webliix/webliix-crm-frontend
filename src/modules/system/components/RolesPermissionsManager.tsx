import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SecurityIcon from "@mui/icons-material/Security";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShieldIcon from "@mui/icons-material/Shield";
import RefreshIcon from "@mui/icons-material/Refresh";
import { userApi, type RoleItem, type PermissionItem, type RolePermissionAssignment } from "../api/user.api";

export function RolesPermissionsManager() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [permissionsCatalog, setPermissionsCatalog] = useState<Record<string, PermissionItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Configure Permissions Dialog
  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null);
  const [activeAssignments, setActiveAssignments] = useState<Map<string, "OWN" | "DEPARTMENT" | "ALL">>(new Map());
  const [savingPermissions, setSavingPermissions] = useState(false);

  // Create Role Dialog
  const [createRoleOpen, setCreateRoleOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDisplay, setNewRoleDisplay] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [creatingRole, setCreatingRole] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [rolesRes, catalogRes] = await Promise.all([
        userApi.getRoles(),
        userApi.getPermissionsCatalog(),
      ]);
      setRoles(rolesRes.data?.data || []);
      setPermissionsCatalog(catalogRes.data?.data || {});
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load roles and permissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenPermissions = async (role: RoleItem) => {
    setSelectedRole(role);
    try {
      // Fetch fresh details with assigned permissions
      const res = await userApi.getRoleById(role.id);
      const roleData: RoleItem = res.data?.data || role;
      setSelectedRole(roleData);

      const map = new Map<string, "OWN" | "DEPARTMENT" | "ALL">();
      if (roleData.permissions) {
        roleData.permissions.forEach((p) => {
          const permCode = (p as any).code || p.permissionCode;
          if (permCode) {
            map.set(permCode, p.scope || "OWN");
          }
        });
      }
      setActiveAssignments(map);
    } catch {
      const map = new Map<string, "OWN" | "DEPARTMENT" | "ALL">();
      if (role.permissions) {
        role.permissions.forEach((p) => {
          const permCode = (p as any).code || p.permissionCode;
          if (permCode) {
            map.set(permCode, p.scope || "OWN");
          }
        });
      }
      setActiveAssignments(map);
    }
  };

  const handleTogglePermission = (code: string) => {
    const next = new Map(activeAssignments);
    if (next.has(code)) {
      next.delete(code);
    } else {
      next.set(code, "ALL");
    }
    setActiveAssignments(next);
  };

  const handleScopeChange = (code: string, scope: "OWN" | "DEPARTMENT" | "ALL") => {
    const next = new Map(activeAssignments);
    next.set(code, scope);
    setActiveAssignments(next);
  };

  const handleToggleModule = (_moduleName: string, items: PermissionItem[]) => {
    const next = new Map(activeAssignments);
    const allAssigned = items.every((i) => next.has(i.code));
    if (allAssigned) {
      items.forEach((i) => next.delete(i.code));
    } else {
      items.forEach((i) => {
        if (!next.has(i.code)) next.set(i.code, "ALL");
      });
    }
    setActiveAssignments(next);
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    setSavingPermissions(true);
    try {
      const payload: RolePermissionAssignment[] = Array.from(activeAssignments.entries()).map(
        ([code, scope]) => ({
          code,
          permissionCode: code,
          scope,
        })
      );
      await userApi.updateRolePermissions(selectedRole.id, payload);
      setSuccessMsg(`Permissions updated successfully for role ${selectedRole.displayName || selectedRole.name}`);
      setSelectedRole(null);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Failed to save permissions");
    } finally {
      setSavingPermissions(false);
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim() || !newRoleDisplay.trim()) {
      alert("Role Code and Display Name are required");
      return;
    }
    setCreatingRole(true);
    try {
      await userApi.createRole({
        name: newRoleName.trim().toUpperCase(),
        displayName: newRoleDisplay.trim(),
        description: newRoleDesc.trim(),
      });
      setCreateRoleOpen(false);
      setNewRoleName("");
      setNewRoleDisplay("");
      setNewRoleDesc("");
      setSuccessMsg("Custom role created successfully");
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Failed to create role");
    } finally {
      setCreatingRole(false);
    }
  };

  const handleDeleteRole = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete role ${name}?`)) return;
    try {
      await userApi.deleteRole(id);
      setSuccessMsg(`Role ${name} deleted`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Failed to delete role");
    }
  };

  if (loading && roles.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress size={36} />
        <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
          Loading RBAC roles and permissions catalog...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 1 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {successMsg && (
        <Alert severity="success" onClose={() => setSuccessMsg(null)} sx={{ mb: 2 }}>
          {successMsg}
        </Alert>
      )}

      {/* Header Toolbar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Roles & Scoped Permissions Catalog
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage database-enforced permissions and data scopes (OWN, DEPARTMENT, ALL).
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={fetchData} title="Refresh">
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateRoleOpen(true)}
            sx={{ fontWeight: "bold" }}
          >
            Create Custom Role
          </Button>
        </Box>
      </Box>

      {/* Roles Grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }, gap: 2.5 }}>
        {roles.map((role) => {
          const isSuper = role.name === "SUPER_ADMIN" || role.isSuperAdmin;
          const permCount = role.permissions ? role.permissions.length : 0;

          return (
            <Card
              key={role.id}
              variant="outlined"
              sx={{
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                border: isSuper ? "2px solid" : "1px solid",
                borderColor: isSuper ? "error.main" : "divider",
                boxShadow: isSuper ? "0 4px 12px rgba(211, 47, 47, 0.1)" : "none",
              }}
            >
              <CardContent sx={{ flex: 1, p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {isSuper ? (
                      <AdminPanelSettingsIcon color="error" />
                    ) : (
                      <ShieldIcon color="primary" />
                    )}
                    <Typography variant="subtitle1" fontWeight="bold">
                      {role.displayName || role.name}
                    </Typography>
                  </Box>
                  <Chip
                    label={role.name}
                    size="small"
                    color={isSuper ? "error" : "default"}
                    sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40, mb: 2 }}>
                  {role.description || (isSuper ? "Unrestricted root super administrator with full system bypass." : "Standard system operational role.")}
                </Typography>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                  {isSuper ? (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Wildcard Full Access (*)"
                      color="error"
                      variant="outlined"
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                  ) : (
                    <Chip
                      label={`${permCount} Active Permissions`}
                      color={permCount > 0 ? "primary" : "default"}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                  {role.isSystem && (
                    <Chip label="System Role" size="small" variant="outlined" sx={{ fontSize: "0.7rem" }} />
                  )}
                </Box>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0, justifyContent: "space-between" }}>
                <Button
                  size="small"
                  variant={isSuper ? "text" : "outlined"}
                  color={isSuper ? "inherit" : "primary"}
                  onClick={() => handleOpenPermissions(role)}
                  startIcon={<SecurityIcon />}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  {isSuper ? "View Super Powers" : "Configure Permissions"}
                </Button>

                {!role.isSystem && (
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteRole(role.id, role.name)}
                    title="Delete Role"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </CardActions>
            </Card>
          );
        })}
      </Box>

      {/* Permissions Matrix Dialog */}
      <Dialog
        open={Boolean(selectedRole)}
        onClose={() => setSelectedRole(null)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {selectedRole?.name === "SUPER_ADMIN" ? "Super Admin Access" : `Configure Permissions: ${selectedRole?.displayName || selectedRole?.name}`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Database-driven RBAC with data scoping (OWN, DEPARTMENT, ALL)
            </Typography>
          </Box>
          <Chip label={selectedRole?.name} color={selectedRole?.isSuperAdmin ? "error" : "primary"} />
        </DialogTitle>

        <DialogContent dividers sx={{ p: 2.5 }}>
          {selectedRole?.isSuperAdmin || selectedRole?.name === "SUPER_ADMIN" ? (
            <Alert severity="info" icon={<AdminPanelSettingsIcon fontSize="large" />} sx={{ my: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                Permanent Full Root Bypass
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                Super Administrator bypasses all granular permission checks. Super Admin has unrestricted access to all endpoints, CRM modules, financial ledgers, settings, and scoping filters.
              </Typography>
            </Alert>
          ) : (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Check the permissions this role should have, and specify the data scope for each action.
              </Typography>

              {Object.entries(permissionsCatalog).map(([moduleName, items]) => {
                const moduleAssignedCount = items.filter((i) => activeAssignments.has(i.code)).length;
                const isAllAssigned = items.length > 0 && moduleAssignedCount === items.length;

                return (
                  <Accordion key={moduleName} defaultExpanded={false} variant="outlined" sx={{ mb: 1, borderRadius: "8px !important" }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", pr: 2 }}>
                        <Typography fontWeight="bold">{moduleName}</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Chip
                            label={`${moduleAssignedCount} / ${items.length}`}
                            size="small"
                            color={moduleAssignedCount > 0 ? "primary" : "default"}
                            sx={{ fontSize: "0.75rem", height: 20 }}
                          />
                          <Button
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleModule(moduleName, items);
                            }}
                            sx={{ fontSize: "0.75rem", py: 0 }}
                          >
                            {isAllAssigned ? "Deselect All" : "Select All"}
                          </Button>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        {items.map((perm) => {
                          const isAssigned = activeAssignments.has(perm.code);
                          const currentScope = activeAssignments.get(perm.code) || "OWN";

                          return (
                            <Box
                              key={perm.code}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                p: 1,
                                borderRadius: 1,
                                bgcolor: isAssigned ? "action.hover" : "transparent",
                                border: isAssigned ? "1px solid" : "1px dashed",
                                borderColor: isAssigned ? "primary.light" : "divider",
                              }}
                            >
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={isAssigned}
                                    onChange={() => handleTogglePermission(perm.code)}
                                    color="primary"
                                    size="small"
                                  />
                                }
                                label={
                                  <Box>
                                    <Typography variant="body2" fontWeight={600}>
                                      {perm.code}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {perm.description}
                                    </Typography>
                                  </Box>
                                }
                                sx={{ m: 0, flex: 1 }}
                              />

                              {isAssigned && (
                                <FormControl size="small" sx={{ minWidth: 150 }}>
                                  <InputLabel id={`scope-label-${perm.code}`}>Scope</InputLabel>
                                  <Select
                                    labelId={`scope-label-${perm.code}`}
                                    value={currentScope}
                                    label="Scope"
                                    onChange={(e) => handleScopeChange(perm.code, e.target.value as any)}
                                    sx={{ height: 32, fontSize: "0.8125rem" }}
                                  >
                                    <MenuItem value="OWN">OWN (Own Records)</MenuItem>
                                    <MenuItem value="DEPARTMENT">DEPARTMENT</MenuItem>
                                    <MenuItem value="ALL">ALL (Company Wide)</MenuItem>
                                  </Select>
                                </FormControl>
                              )}
                            </Box>
                          );
                        })}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSelectedRole(null)} color="inherit">
            Cancel
          </Button>
          {!selectedRole?.isSuperAdmin && selectedRole?.name !== "SUPER_ADMIN" && (
            <Button
              variant="contained"
              onClick={handleSavePermissions}
              disabled={savingPermissions}
              startIcon={savingPermissions ? <CircularProgress size={16} /> : <CheckCircleIcon />}
            >
              {savingPermissions ? "Saving..." : "Save Role Permissions"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Create Custom Role Dialog */}
      <Dialog open={createRoleOpen} onClose={() => setCreateRoleOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">Create Custom Role</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          <TextField
            label="Role Code"
            placeholder="e.g. INVENTORY_MANAGER"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value.toUpperCase().replace(/\s+/g, "_"))}
            helperText="Uppercase alphanumeric identifier with underscores"
            fullWidth
            required
          />
          <TextField
            label="Display Name"
            placeholder="e.g. Inventory Manager"
            value={newRoleDisplay}
            onChange={(e) => setNewRoleDisplay(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Description"
            placeholder="Brief description of responsibilities..."
            value={newRoleDesc}
            onChange={(e) => setNewRoleDesc(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCreateRoleOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateRole}
            disabled={creatingRole}
            startIcon={creatingRole ? <CircularProgress size={16} /> : <AddIcon />}
          >
            {creatingRole ? "Creating..." : "Create Role"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
