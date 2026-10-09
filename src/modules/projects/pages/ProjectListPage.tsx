import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Switch from "@mui/material/Switch";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { BrandLoader } from "@/shared/components/ui/feedback/BrandLoader";
import { PageLayout } from "@/shared/components/ui/layout";
import FolderSpecialOutlinedIcon from "@mui/icons-material/FolderSpecialOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { tokens } from "@/theme/tokens";
import { useNavigate } from "react-router-dom";
import { projectApi, type ProjectItem, type CreateProjectPayload } from "../api/projectApi";
import { http } from "@/shared/services/http";

interface CustomerOption {
  id: number;
  companyName: string;
  contactPerson: string;
  email: string;
}

export default function ProjectListPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Create Project Dialog State
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [creating, setCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Edit Project Dialog State
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editProjectName, setEditProjectName] = useState<string>("");
  const [editProjectBudget, setEditProjectBudget] = useState<number>(0);
  const [editProjectStatus, setEditProjectStatus] = useState<string>("IN_PROGRESS");
  const [editProjectPriority, setEditProjectPriority] = useState<string>("MEDIUM");
  const [editProjectStartDate, setEditProjectStartDate] = useState<string>("");
  const [editProjectEndDate, setEditProjectEndDate] = useState<string>("");
  const [editProjectBillable, setEditProjectBillable] = useState<boolean>(true);
  const [editProjectDesc, setEditProjectDesc] = useState<string>("");
  const [submittingEdit, setSubmittingEdit] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete Project Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null);
  const [deletingProjectName, setDeletingProjectName] = useState<string>("");
  const [deleting, setDeleting] = useState<boolean>(false);

  const handleOpenEdit = (p: ProjectItem) => {
    setEditingProjectId(p.id);
    setEditProjectName(p.projectName || "");
    setEditProjectBudget(p.budget || 0);
    setEditProjectStatus(p.status || "IN_PROGRESS");
    setEditProjectPriority(p.priority || "MEDIUM");
    setEditProjectStartDate(p.startDate ? p.startDate.split("T")[0] : "");
    setEditProjectEndDate(p.expectedEndDate ? p.expectedEndDate.split("T")[0] : "");
    setEditProjectBillable(p.billable !== undefined ? p.billable : true);
    setEditProjectDesc(p.description || "");
    setEditError(null);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingProjectId || !editProjectName.trim()) {
      setEditError("Please enter a valid project name.");
      return;
    }
    setSubmittingEdit(true);
    setEditError(null);
    try {
      const updated = await projectApi.updateProject(editingProjectId, {
        projectName: editProjectName.trim(),
        budget: Number(editProjectBudget) || 0,
        status: editProjectStatus,
        priority: editProjectPriority,
        startDate: editProjectStartDate || undefined,
        expectedEndDate: editProjectEndDate || undefined,
        billable: editProjectBillable,
        description: editProjectDesc.trim(),
      });
      if (updated) {
        setEditDialogOpen(false);
        setEditingProjectId(null);
        fetchProjects();
      } else {
        setEditError("Failed to update project.");
      }
    } catch (err: any) {
      setEditError(err?.response?.data?.message || "Failed to update project.");
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleOpenDelete = (p: ProjectItem) => {
    setDeletingProjectId(p.id);
    setDeletingProjectName(p.projectName);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProjectId) return;
    setDeleting(true);
    try {
      const success = await projectApi.deleteProject(deletingProjectId);
      if (success) {
        setDeleteDialogOpen(false);
        setDeletingProjectId(null);
        fetchProjects();
      } else {
        alert("Failed to delete project.");
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete project.");
    } finally {
      setDeleting(false);
    }
  };

  const [formData, setFormData] = useState<CreateProjectPayload>({
    projectName: "",
    description: "",
    customerId: undefined,
    budget: 50000,
    startDate: new Date().toISOString().split("T")[0],
    expectedEndDate: new Date(Date.now() + 45 * 86400000).toISOString().split("T")[0],
    priority: "HIGH",
    status: "PLANNING",
    billable: true,
    autoGeneratePhases: true,
    documentationUrl: "",
    architectureNotes: "Webliix Enterprise Full-Stack Web Application Architecture with Spring Boot REST API and React Single Page App.",
  });

  const fetchProjects = () => {
    setLoading(true);
    projectApi.getProjects(0, 50).then((res) => {
      setProjects(res.content);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchProjects();

    // Fetch Customers for Project Association
    http.get("/api/v1/customers", { params: { size: 100 } })
      .then((res) => {
        const data = res.data?.data;
        const list = Array.isArray(data) ? data : data?.content || [];
        setCustomers(list);
      })
      .catch(() => setCustomers([]));
  }, []);

  const handleCreateSubmit = async () => {
    if (!formData.projectName.trim()) {
      setCreateError("Please enter a valid project title.");
      return;
    }

    setCreating(true);
    setCreateError(null);

    const created = await projectApi.createProject(formData);
    if (created) {
      setCreateDialogOpen(false);
      fetchProjects();
      setFormData({
        projectName: "",
        description: "",
        customerId: undefined,
        budget: 50000,
        startDate: new Date().toISOString().split("T")[0],
        expectedEndDate: new Date(Date.now() + 45 * 86400000).toISOString().split("T")[0],
        priority: "HIGH",
        status: "PLANNING",
        billable: true,
        autoGeneratePhases: true,
        documentationUrl: "",
        architectureNotes: "Webliix Enterprise Full-Stack Web Application Architecture.",
      });
    } else {
      setCreateError("Failed to initiate project. Please verify inputs and backend connectivity.");
    }
    setCreating(false);
  };

  const getStatusChip = (status: string) => {
    const st = (status || "").toUpperCase();
    if (st === "COMPLETED") {
      return (
        <Chip
          icon={<CheckCircleOutlinedIcon style={{ fontSize: 14 }} />}
          label="Completed"
          size="small"
          sx={{ bgcolor: tokens.colors.success[100], color: tokens.colors.success[700], fontWeight: 700 }}
        />
      );
    }
    if (st === "IN_PROGRESS" || st === "ACTIVE") {
      return (
        <Chip
          icon={<HourglassEmptyOutlinedIcon style={{ fontSize: 14 }} />}
          label="In Progress"
          size="small"
          sx={{ bgcolor: tokens.colors.primary[100], color: tokens.colors.primary[700], fontWeight: 700 }}
        />
      );
    }
    if (st === "PLANNING" || st === "NOT_STARTED") {
      return (
        <Chip
          label="Planning & Initiation"
          size="small"
          sx={{ bgcolor: tokens.colors.warning[100], color: tokens.colors.warning[700], fontWeight: 700 }}
        />
      );
    }
    return (
      <Chip
        label={status || "Draft"}
        size="small"
        sx={{ bgcolor: tokens.colors.secondary[200], color: tokens.colors.secondary[800], fontWeight: 600 }}
      />
    );
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.projectCode && p.projectCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.customerName && p.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.customerCompanyName && p.customerCompanyName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "IN_PROGRESS" && (p.status === "IN_PROGRESS" || p.status === "PLANNING")) ||
      (statusFilter === "COMPLETED" && p.status === "COMPLETED");

    return matchesSearch && matchesStatus;
  });

  const totalCount = projects.length;
  const inProgressCount = projects.filter((p) => p.status === "IN_PROGRESS" || p.status === "ACTIVE").length;
  const planningCount = projects.filter((p) => p.status === "PLANNING" || p.status === "NOT_STARTED").length;
  const completedCount = projects.filter((p) => p.status === "COMPLETED").length;

  return (
    <PageLayout
      title="Projects & Client Deliverables"
      subtitle="Manage project initiation, automated lifecycle phases, client updates, and live deliverables"
      actions={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ fontWeight: "bold" }}
        >
          Initiate New Project
        </Button>
      }
    >
      {/* Metrics Row */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 3, mb: 3 }}>
        <Card
          variant="outlined"
          sx={{
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
            transition: "all 0.2s ease",
            "&:hover": { borderColor: "primary.main", boxShadow: "0 4px 16px rgba(0,0,0,0.04)", transform: "translateY(-1px)" },
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5 }}>
            <Box sx={{ p: 1.25, borderRadius: "8px", bgcolor: "#eef2ff", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FolderSpecialOutlinedIcon sx={{ fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} color="#0f172a" lineHeight={1.2}>
                {totalCount}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Total Projects
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          variant="outlined"
          sx={{
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
            transition: "all 0.2s ease",
            "&:hover": { borderColor: "info.main", boxShadow: "0 4px 16px rgba(0,0,0,0.04)", transform: "translateY(-1px)" },
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5 }}>
            <Box sx={{ p: 1.25, borderRadius: "8px", bgcolor: "#f0f9ff", color: "#0ea5e9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <HourglassEmptyOutlinedIcon sx={{ fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} color="#0ea5e9" lineHeight={1.2}>
                {inProgressCount}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                In Progress
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          variant="outlined"
          sx={{
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
            transition: "all 0.2s ease",
            "&:hover": { borderColor: "warning.main", boxShadow: "0 4px 16px rgba(0,0,0,0.04)", transform: "translateY(-1px)" },
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5 }}>
            <Box sx={{ p: 1.25, borderRadius: "8px", bgcolor: "#fffbeb", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CalendarTodayOutlinedIcon sx={{ fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} color="#f59e0b" lineHeight={1.2}>
                {planningCount}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Planning Phase
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          variant="outlined"
          sx={{
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
            transition: "all 0.2s ease",
            "&:hover": { borderColor: "success.main", boxShadow: "0 4px 16px rgba(0,0,0,0.04)", transform: "translateY(-1px)" },
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5 }}>
            <Box sx={{ p: 1.25, borderRadius: "8px", bgcolor: "#ecfdf5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircleOutlinedIcon sx={{ fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} color="#10b981" lineHeight={1.2}>
                {completedCount}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Completed
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Search and Filters Bar */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
        <TextField
          size="small"
          placeholder="Search by project name, code, or client..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ maxWidth: 400, width: "100%" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant={statusFilter === "ALL" ? "contained" : "outlined"}
            onClick={() => setStatusFilter("ALL")}
            sx={{ borderRadius: "6px", textTransform: "none", fontWeight: 600, fontSize: "0.8125rem", px: 2 }}
          >
            All Projects
          </Button>
          <Button
            size="small"
            variant={statusFilter === "IN_PROGRESS" ? "contained" : "outlined"}
            onClick={() => setStatusFilter("IN_PROGRESS")}
            sx={{ borderRadius: "6px", textTransform: "none", fontWeight: 600, fontSize: "0.8125rem", px: 2 }}
          >
            Active & In Progress
          </Button>
          <Button
            size="small"
            variant={statusFilter === "COMPLETED" ? "contained" : "outlined"}
            onClick={() => setStatusFilter("COMPLETED")}
            sx={{ borderRadius: "6px", textTransform: "none", fontWeight: 600, fontSize: "0.8125rem", px: 2 }}
          >
            Completed
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <BrandLoader message="Loading projects, phases & deliverables..." size="medium" />
        </Box>
      ) : filteredProjects.length === 0 ? (
        <Card variant="outlined" sx={{ borderRadius: "10px", border: "1px solid #e2e8f0", p: 6, textAlign: "center" }}>
          <FolderSpecialOutlinedIcon sx={{ fontSize: 56, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            No Projects Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480, mx: "auto", mb: 3 }}>
            No project records match your current filter criteria. You can initiate a new project with automatic phase division above.
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)} sx={{ fontWeight: "bold", borderRadius: "6px" }}>
            Initiate First Project
          </Button>
        </Card>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }, gap: 3 }}>
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              variant="outlined"
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
                  <Chip
                    label={project.projectCode || `PRJ-${project.id}`}
                    size="small"
                    sx={{ fontWeight: "bold", fontSize: "0.725rem", borderRadius: "4px" }}
                  />
                  {getStatusChip(project.status)}
                </Box>

                {(project.customerName || project.customerCompanyName || project.customer?.companyName || project.customer?.contactPerson) && (
                  <Typography variant="caption" fontWeight="bold" color="primary.main" sx={{ mb: 0.5, display: "block" }}>
                    Client: {project.customerName || project.customerCompanyName || project.customer?.contactPerson || project.customer?.companyName}
                  </Typography>
                )}

                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: "#0f172a" }}>
                  {project.projectName}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 3,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                  }}
                >
                  {project.description || "Webliix full-stack cloud software deliverables and architecture."}
                </Typography>

                {/* Progress Bar */}
                <Box sx={{ mt: "auto", pt: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography variant="caption" fontWeight="bold" color="text.secondary">
                      Completion Progress
                    </Typography>
                    <Typography variant="caption" fontWeight="bold" color="primary.main">
                      {project.progressPercentage ?? 0}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={project.progressPercentage ?? 0}
                    sx={{
                      height: 6,
                      borderRadius: "3px",
                    }}
                  />
                </Box>

                {/* Budget & Due Date */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2, pt: 1.5, borderTop: "1px dashed #e2e8f0" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 16, color: "primary.main" }} />
                    <Typography variant="caption" fontWeight="bold" color="text.primary">
                      Budget: ₹{(project.budget || 0).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      {project.expectedEndDate ? `Due ${new Date(project.expectedEndDate).toLocaleDateString()}` : "Active Timeline"}
                    </Typography>
                  </Box>
                </Box>

                {/* Card Actions */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2, pt: 1.5, borderTop: "1px solid #e2e8f0" }}>
                  <Box sx={{ display: "flex", gap: 0.75 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<EditNoteOutlinedIcon sx={{ fontSize: 16 }} />}
                      onClick={() => handleOpenEdit(project)}
                      sx={{
                        borderRadius: "6px",
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        px: 1.5,
                        py: 0.4,
                      }}
                    >
                      Edit
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleOpenDelete(project)}
                      title="Delete Project"
                      sx={{ border: "1px solid #fecaca", borderRadius: "6px", p: 0.5 }}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>

                  <Button
                    size="small"
                    variant="contained"
                    endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    sx={{
                      borderRadius: "6px",
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.8125rem",
                      px: 2,
                      py: 0.5,
                      boxShadow: "none",
                      bgcolor: "#4f46e5",
                      "&:hover": { bgcolor: "#4338ca" },
                    }}
                  >
                    View Project
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Initiate Project Modal Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => !creating && setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: tokens.borderRadius.lg } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: tokens.colors.secondary[900], pb: 1 }}>
          Initiate New Client Project
        </DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5, py: 3 }}>
          {createError && <Alert severity="error">{createError}</Alert>}

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2.5 }}>
            <TextField
              required
              fullWidth
              label="Project Title"
              placeholder="e.g. Acme SaaS Cloud Portal"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
            />

            <TextField
              select
              fullWidth
              label="Client Organization"
              value={formData.customerId || ""}
              onChange={(e) => setFormData({ ...formData, customerId: Number(e.target.value) || undefined })}
              helperText="Associated client account (notified automatically)"
            >
              <MenuItem value="">-- Select Client Organization --</MenuItem>
              {customers.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.companyName} ({c.contactPerson || c.email})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Project Budget (USD $)"
              type="number"
              value={formData.budget || ""}
              onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
            />

            <TextField
              select
              fullWidth
              label="Project Priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <MenuItem value="LOW">Low Priority</MenuItem>
              <MenuItem value="MEDIUM">Medium Priority</MenuItem>
              <MenuItem value="HIGH">High Priority</MenuItem>
              <MenuItem value="URGENT">Urgent Deliverable</MenuItem>
            </TextField>

            <TextField
              fullWidth
              type="date"
              label="Initiation Date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              type="date"
              label="Expected Handover Date"
              value={formData.expectedEndDate}
              onChange={(e) => setFormData({ ...formData, expectedEndDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <TextField
            multiline
            rows={2}
            fullWidth
            label="Project Scope & Deliverable Description"
            placeholder="Key functional requirements, scope, target goals..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <TextField
            fullWidth
            label="Documentation & Blueprint URL"
            placeholder="https://docs.webliix.com/spec/proj-blueprint.pdf"
            value={formData.documentationUrl}
            onChange={(e) => setFormData({ ...formData, documentationUrl: e.target.value })}
            helperText="Cloud documentation link accessible by client"
          />

          <TextField
            multiline
            rows={2}
            fullWidth
            label="System Architecture & Technical Specifications"
            value={formData.architectureNotes}
            onChange={(e) => setFormData({ ...formData, architectureNotes: e.target.value })}
            helperText="Technical specifications and stack details included in downloadable project PDF"
          />

          <Box sx={{ p: 2, borderRadius: tokens.borderRadius.md, bgcolor: tokens.colors.primary[50], border: `1px solid ${tokens.colors.primary[100]}` }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.autoGeneratePhases}
                  onChange={(e) => setFormData({ ...formData, autoGeneratePhases: e.target.checked })}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} color={tokens.colors.primary[900]}>
                    Auto-Generate Standard Lifecycle Phases
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Automatically initializes 5 milestones (Discovery, UI/UX, Core Dev, QA, Deployment) with calculated target due dates.
                  </Typography>
                </Box>
              }
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.billable}
                  onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
                  color="primary"
                />
              }
              label={<Typography variant="body2" fontWeight={600}>Billable Project</Typography>}
            />
            <Typography variant="caption" color="text.secondary">
              An automated initiation email from <strong>noreply@webliix.com</strong> will be dispatched to the customer.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button disabled={creating} onClick={() => setCreateDialogOpen(false)} sx={{ fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={creating}
            onClick={handleCreateSubmit}
            sx={{ fontWeight: 700, px: 3, borderRadius: tokens.borderRadius.md }}
          >
            {creating ? "Initiating..." : "Initiate & Deploy Project"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => !submittingEdit && setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Edit Project & Budget Controls
        </DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {editError && <Alert severity="error">{editError}</Alert>}

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: 2 }}>
            <TextField
              label="Project Title"
              required
              fullWidth
              size="small"
              value={editProjectName}
              onChange={(e) => setEditProjectName(e.target.value)}
            />
            <TextField
              label="Total Project Budget (₹)"
              type="number"
              required
              fullWidth
              size="small"
              helperText="Set & control project budget"
              value={editProjectBudget}
              onChange={(e) => setEditProjectBudget(Number(e.target.value))}
            />
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 2 }}>
            <TextField
              select
              label="Status"
              fullWidth
              size="small"
              value={editProjectStatus}
              onChange={(e) => setEditProjectStatus(e.target.value)}
            >
              <MenuItem value="PLANNING">Planning</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="ON_HOLD">On Hold</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </TextField>

            <TextField
              select
              label="Priority"
              fullWidth
              size="small"
              value={editProjectPriority}
              onChange={(e) => setEditProjectPriority(e.target.value)}
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
              <MenuItem value="URGENT">Urgent</MenuItem>
            </TextField>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                checked={editProjectBillable}
                onChange={(e) => setEditProjectBillable(e.target.checked)}
              />
              <Typography variant="body2" fontWeight="bold">
                Billable Project
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField
              label="Start Date"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={editProjectStartDate}
              onChange={(e) => setEditProjectStartDate(e.target.value)}
            />
            <TextField
              label="Expected End Date"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={editProjectEndDate}
              onChange={(e) => setEditProjectEndDate(e.target.value)}
            />
          </Box>

          <TextField
            label="Project Description"
            fullWidth
            multiline
            rows={3}
            value={editProjectDesc}
            onChange={(e) => setEditProjectDesc(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditDialogOpen(false)} disabled={submittingEdit}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={submittingEdit || !editProjectName.trim()}
            onClick={handleSaveEdit}
            sx={{ fontWeight: "bold" }}
          >
            {submittingEdit ? "Saving..." : "Save Project & Budget"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Project Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "error.main" }}>
          Delete Project
        </DialogTitle>
        <DialogContent dividers>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to permanently delete <strong>{deletingProjectName}</strong>?
          </Alert>
          <Typography variant="body2" color="text.secondary">
            This action will delete all project milestones, tasks, team allocations, and comments. Existing customer invoices will be kept for accounting records with the project unlinked.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={deleting}
            onClick={handleConfirmDelete}
            sx={{ fontWeight: "bold" }}
          >
            {deleting ? "Deleting..." : "Delete Project Permanently"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
}
