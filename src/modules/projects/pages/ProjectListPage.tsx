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
import { BrandLoader } from "@/shared/components/ui/feedback/BrandLoader";
import FolderSpecialOutlinedIcon from "@mui/icons-material/FolderSpecialOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
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

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color={tokens.colors.secondary[900]} gutterBottom>
            Projects & Client Deliverables
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage project initiation, automated lifecycle phases, client updates, and live deliverables.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ fontWeight: 700, borderRadius: tokens.borderRadius.md, px: 2.5, py: 1 }}
        >
          Initiate New Project
        </Button>
      </Box>

      {/* Search and Filters Bar */}
      <Box sx={{ mb: 4, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          size="small"
          placeholder="Search by project name, code, or client..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: 280, bgcolor: "#ffffff" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            label="All Projects"
            clickable
            color={statusFilter === "ALL" ? "primary" : "default"}
            onClick={() => setStatusFilter("ALL")}
            sx={{ fontWeight: 700 }}
          />
          <Chip
            label="Active & In Progress"
            clickable
            color={statusFilter === "IN_PROGRESS" ? "primary" : "default"}
            onClick={() => setStatusFilter("IN_PROGRESS")}
            sx={{ fontWeight: 700 }}
          />
          <Chip
            label="Completed"
            clickable
            color={statusFilter === "COMPLETED" ? "primary" : "default"}
            onClick={() => setStatusFilter("COMPLETED")}
            sx={{ fontWeight: 700 }}
          />
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <BrandLoader message="Loading projects, phases & deliverables..." size="medium" />
        </Box>
      ) : filteredProjects.length === 0 ? (
        <Card sx={{ borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}`, p: 6, textAlign: "center" }}>
          <FolderSpecialOutlinedIcon sx={{ fontSize: 56, color: tokens.colors.secondary[300], mb: 2 }} />
          <Typography variant="h6" fontWeight={700} color={tokens.colors.secondary[800]} gutterBottom>
            No Projects Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480, mx: "auto", mb: 3 }}>
            No project records match your current filter criteria. You can initiate a new project with automatic phase division above.
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)} sx={{ fontWeight: 700 }}>
            Initiate First Project
          </Button>
        </Card>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }, gap: 3 }}>
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: tokens.borderRadius.lg,
                border: `1px solid ${tokens.colors.secondary[200]}`,
                transition: tokens.transitions.normal,
                "&:hover": {
                  borderColor: tokens.colors.primary[400],
                  boxShadow: tokens.shadows.md,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
                  <Chip
                    label={project.projectCode || `PRJ-${project.id}`}
                    size="small"
                    sx={{ bgcolor: tokens.colors.secondary[100], color: tokens.colors.secondary[700], fontWeight: 700, fontSize: "0.725rem" }}
                  />
                  {getStatusChip(project.status)}
                </Box>

                {(project.customerName || project.customerCompanyName || project.customer?.companyName || project.customer?.contactPerson) && (
                  <Typography variant="caption" fontWeight={700} color={tokens.colors.primary.main} sx={{ mb: 0.5, display: "block" }}>
                    Client: {project.customerName || project.customerCompanyName || project.customer?.contactPerson || project.customer?.companyName}
                  </Typography>
                )}

                <Typography variant="h6" fontWeight={700} color={tokens.colors.secondary[900]} sx={{ mb: 1 }}>
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
                    <Typography variant="caption" fontWeight={700} color={tokens.colors.secondary[700]}>
                      Completion Progress
                    </Typography>
                    <Typography variant="caption" fontWeight={800} color={tokens.colors.primary.main}>
                      {project.progressPercentage ?? 0}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={project.progressPercentage ?? 0}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: tokens.colors.secondary[100],
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 4,
                        bgcolor: tokens.colors.primary.main,
                      },
                    }}
                  />
                </Box>

                {/* Dates & Action */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 3, pt: 2, borderTop: `1px solid ${tokens.colors.secondary[100]}` }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: tokens.colors.secondary[400] }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      {project.expectedEndDate ? `Due ${new Date(project.expectedEndDate).toLocaleDateString()}` : "Active Timeline"}
                    </Typography>
                  </Box>

                  <Button
                    size="small"
                    endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    sx={{ fontWeight: 700, fontSize: "0.8125rem", p: 0 }}
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
    </Box>
  );
}
