import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { PageLayout } from "@/shared/components/ui/layout";
import { BrandLoader } from "@/shared/components/ui/feedback/BrandLoader";
import { tokens } from "@/theme/tokens";
import { http } from "@/shared/services/http";

interface JobOpening {
  id: number;
  title: string;
  department: string;
  type: string;
  location: string;
  experience?: string;
  description?: string;
  requirements?: string;
  active: boolean;
  createdAt?: string;
}

interface JobApplication {
  id: number;
  jobOpeningId?: number;
  jobTitle: string;
  applicationType?: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  experience?: string;
  portfolioUrl?: string;
  resumeLink?: string;
  message?: string;
  payoutMethod?: string;
  payoutDetails?: string;
  status: string; // NEW, REVIEWING, SHORTLISTED, REJECTED, HIRED
  notes?: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"; bg: string }> = {
  NEW: { label: "New Application", color: "info", bg: "#eff6ff" },
  REVIEWING: { label: "Under Review", color: "warning", bg: "#fffbeb" },
  SHORTLISTED: { label: "Shortlisted", color: "secondary", bg: "#f5f3ff" },
  HIRED: { label: "Hired / Selected", color: "success", bg: "#ecfdf5" },
  REJECTED: { label: "Rejected", color: "error", bg: "#fef2f2" },
};

export default function JobsManagementPage() {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [openings, setOpenings] = useState<JobOpening[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Dialog state
  const [jobModalOpen, setJobModalOpen] = useState<boolean>(false);
  const [editingJob, setEditingJob] = useState<JobOpening | null>(null);
  const [jobFormData, setJobFormData] = useState({
    title: "",
    department: "Engineering",
    type: "Full-Time / Remote",
    location: "Remote (India)",
    experience: "1-3 Years",
    description: "",
    requirements: "",
    active: true,
  });

  // Candidate detail dialog
  const [selectedCandidate, setSelectedCandidate] = useState<JobApplication | null>(null);

  // Toast
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [openingsRes, appsRes] = await Promise.allSettled([
        http.get("/api/v1/jobs"),
        http.get("/api/v1/jobs/applications"),
      ]);

      if (openingsRes.status === "fulfilled") {
        const d = openingsRes.value.data?.data || openingsRes.value.data || [];
        setOpenings(Array.isArray(d) ? d : []);
      }
      if (appsRes.status === "fulfilled") {
        const d = appsRes.value.data?.data || appsRes.value.data || [];
        setApplications(Array.isArray(d) ? d : []);
      }
    } catch {
      setSnackbar({ open: true, message: "Error connecting to careers API", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenJobModal = (job?: JobOpening) => {
    if (job) {
      setEditingJob(job);
      setJobFormData({
        title: job.title,
        department: job.department,
        type: job.type,
        location: job.location,
        experience: job.experience || "1-3 Years",
        description: job.description || "",
        requirements: job.requirements || "",
        active: job.active,
      });
    } else {
      setEditingJob(null);
      setJobFormData({
        title: "",
        department: "Engineering",
        type: "Full-Time / Remote",
        location: "Remote (India)",
        experience: "1-3 Years",
        description: "",
        requirements: "",
        active: true,
      });
    }
    setJobModalOpen(true);
  };

  const handleSaveJob = async () => {
    if (!jobFormData.title.trim()) {
      setSnackbar({ open: true, message: "Job title is required", severity: "error" });
      return;
    }
    try {
      if (editingJob) {
        const res = await http.put(`/api/v1/jobs/${editingJob.id}`, jobFormData);
        const updated = res.data?.data || res.data;
        setOpenings((prev) => prev.map((j) => (j.id === editingJob.id ? updated : j)));
        setSnackbar({ open: true, message: "Position updated successfully", severity: "success" });
      } else {
        const res = await http.post("/api/v1/jobs", jobFormData);
        const created = res.data?.data || res.data;
        setOpenings((prev) => [created, ...prev]);
        setSnackbar({ open: true, message: "New job position published", severity: "success" });
      }
      setJobModalOpen(false);
    } catch (err: any) {
      setSnackbar({ open: true, message: err?.response?.data?.message || "Failed to save job position", severity: "error" });
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this job opening?")) return;
    try {
      await http.delete(`/api/v1/jobs/${id}`);
      setOpenings((prev) => prev.filter((j) => j.id !== id));
      setSnackbar({ open: true, message: "Job opening deleted", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to delete opening", severity: "error" });
    }
  };

  const handleUpdateStatus = async (appId: number, newStatus: string) => {
    try {
      await http.put(`/api/v1/jobs/applications/${appId}/status`, { status: newStatus });
      setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a)));
      if (selectedCandidate && selectedCandidate.id === appId) {
        setSelectedCandidate((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      setSnackbar({ open: true, message: `Applicant status set to ${newStatus}`, severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to update application status", severity: "error" });
    }
  };

  const handleDeleteApplication = async (appId: number) => {
    if (!window.confirm("Remove this candidate application permanently?")) return;
    try {
      await http.delete(`/api/v1/jobs/applications/${appId}`);
      setApplications((prev) => prev.filter((a) => a.id !== appId));
      if (selectedCandidate?.id === appId) {
        setSelectedCandidate(null);
      }
      setSnackbar({ open: true, message: "Candidate application deleted", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to delete candidate application", severity: "error" });
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (statusFilter !== "ALL" && app.status !== statusFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.name?.toLowerCase().includes(q) ||
      app.email?.toLowerCase().includes(q) ||
      app.jobTitle?.toLowerCase().includes(q) ||
      app.location?.toLowerCase().includes(q)
    );
  });

  return (
    <PageLayout
      title="Careers & Talent Acquisition"
      subtitle="Manage published job openings, candidate resumes, and partner applications synchronized with the public careers portal"
      actions={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenJobModal()}
          sx={{
            fontWeight: 800,
            bgcolor: tokens.colors.primary.main,
            borderRadius: `${tokens.borderRadius.md}px`,
            textTransform: "none",
            "&:hover": { bgcolor: tokens.colors.primary[700] },
          }}
        >
          Post New Role
        </Button>
      }
    >
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={(_, val) => setCurrentTab(val)}
          sx={{
            borderBottom: `1px solid ${tokens.colors.secondary[200]}`,
            "& .MuiTab-root": { textTransform: "none", fontWeight: 700, fontSize: "0.95rem" },
          }}
        >
          <Tab
            icon={<BusinessCenterIcon sx={{ fontSize: "1.2rem" }} />}
            iconPosition="start"
            label={`Job Openings (${openings.length})`}
          />
          <Tab
            icon={<PeopleAltIcon sx={{ fontSize: "1.2rem" }} />}
            iconPosition="start"
            label={`Candidate Submissions (${applications.length})`}
          />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ py: 8, textAlign: "center" }}>
          <BrandLoader message="Fetching careers & talent data..." size="medium" />
        </Box>
      ) : currentTab === 0 ? (
        /* TAB 1: JOB OPENINGS */
        <Box sx={{ display: "grid", gap: 2.5 }}>
          {openings.length === 0 ? (
            <Card sx={{ p: 4, textAlign: "center", borderRadius: tokens.borderRadius.lg }}>
              <Typography color="text.secondary">No positions posted yet. Click "Post New Role" to create one.</Typography>
            </Card>
          ) : (
            openings.map((job) => (
              <Card
                key={job.id}
                sx={{
                  borderRadius: tokens.borderRadius.lg,
                  border: `1px solid ${tokens.colors.secondary[200]}`,
                  boxShadow: tokens.shadows.sm,
                  transition: "all 0.2s ease",
                  "&:hover": { boxShadow: tokens.shadows.md, borderColor: tokens.colors.primary[300] },
                }}
              >
                <CardContent sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: tokens.borderRadius.md,
                        bgcolor: tokens.colors.primary[50],
                        color: tokens.colors.primary.main,
                        display: "flex",
                      }}
                    >
                      <WorkOutlineIcon fontSize="medium" />
                    </Box>
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5, flexWrap: "wrap" }}>
                        <Typography variant="h6" fontWeight={800} color={tokens.colors.secondary[900]}>
                          {job.title}
                        </Typography>
                        <Chip label={job.department} size="small" color="primary" sx={{ fontWeight: 700, fontSize: "0.72rem" }} />
                        <Chip
                          label={job.active ? "Published" : "Draft / Inactive"}
                          size="small"
                          color={job.active ? "success" : "default"}
                          sx={{ fontWeight: 700, fontSize: "0.72rem" }}
                        />
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", color: "text.secondary", fontSize: "0.85rem", mb: 1.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <PlaceIcon sx={{ fontSize: "1rem" }} />
                          <span>{job.location}</span>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: "1rem" }} />
                          <span>{job.type}</span>
                        </Box>
                        {job.experience && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <strong>Exp:</strong> <span>{job.experience}</span>
                          </Box>
                        )}
                      </Box>
                      {job.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 780, lineHeight: 1.6, mb: 1 }}>
                          {job.description}
                        </Typography>
                      )}
                      {job.requirements && (
                        <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                          <strong>Skills:</strong> {job.requirements}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Tooltip title="Edit Role Details">
                      <IconButton onClick={() => handleOpenJobModal(job)} size="small" sx={{ color: tokens.colors.secondary[700] }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Position">
                      <IconButton onClick={() => handleDeleteJob(job.id)} size="small" sx={{ color: "error.main" }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      ) : (
        /* TAB 2: CANDIDATE SUBMISSIONS */
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Filters & Search */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
              {["ALL", "NEW", "REVIEWING", "SHORTLISTED", "HIRED", "REJECTED"].map((st) => (
                <Chip
                  key={st}
                  label={st === "ALL" ? `All Candidates (${applications.length})` : `${st} (${applications.filter((a) => a.status === st).length})`}
                  color={statusFilter === st ? "primary" : "default"}
                  onClick={() => setStatusFilter(st)}
                  clickable
                  sx={{ fontWeight: 700, borderRadius: `${tokens.borderRadius.sm}px` }}
                />
              ))}
            </Box>

            <TextField
              size="small"
              placeholder="Search candidate, role, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94a3b8" }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: `${tokens.borderRadius.md}px`, width: { xs: "100%", sm: 280 } },
              }}
            />
          </Box>

          {filteredApplications.length === 0 ? (
            <Card sx={{ p: 4, textAlign: "center", borderRadius: tokens.borderRadius.lg }}>
              <Typography color="text.secondary">No candidate applications matching current filter.</Typography>
            </Card>
          ) : (
            <Card sx={{ borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}`, overflow: "hidden" }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: tokens.colors.secondary[50] }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800 }}>Applicant</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Target Role</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Experience & Location</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Portfolio / Resume</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 800, textAlign: "right" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredApplications.map((app) => {
                      const cfg = STATUS_CONFIG[app.status] || { label: app.status, color: "default", bg: "#f1f5f9" };
                      return (
                        <TableRow key={app.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell>
                            <Box>
                              <Typography variant="subtitle2" fontWeight={800} color={tokens.colors.secondary[900]}>
                                {app.name}
                              </Typography>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.25 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                  <EmailIcon sx={{ fontSize: "0.8rem" }} /> {app.email}
                                </Typography>
                                {app.phone && (
                                  <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <PhoneIcon sx={{ fontSize: "0.8rem" }} /> {app.phone}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2" fontWeight={700}>
                              {app.jobTitle}
                            </Typography>
                            {app.applicationType && app.applicationType !== "job" && (
                              <Chip label={app.applicationType} size="small" sx={{ fontSize: "0.65rem", height: 18, mt: 0.5 }} />
                            )}
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2">{app.experience || "Not specified"}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {app.location || "Remote"}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                              {app.portfolioUrl && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  href={app.portfolioUrl.startsWith("http") ? app.portfolioUrl : `https://${app.portfolioUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  endIcon={<OpenInNewIcon sx={{ fontSize: "0.85rem" }} />}
                                  sx={{ textTransform: "none", fontSize: "0.75rem", py: 0.25, px: 1 }}
                                >
                                  Portfolio
                                </Button>
                              )}
                              {app.resumeLink && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="secondary"
                                  href={app.resumeLink.startsWith("http") ? app.resumeLink : `https://${app.resumeLink}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  endIcon={<OpenInNewIcon sx={{ fontSize: "0.85rem" }} />}
                                  sx={{ textTransform: "none", fontSize: "0.75rem", py: 0.25, px: 1 }}
                                >
                                  Resume
                                </Button>
                              )}
                            </Box>
                          </TableCell>

                          <TableCell>
                            <FormControl size="small" sx={{ minWidth: 140 }}>
                              <Select
                                value={app.status}
                                onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                                sx={{
                                  fontSize: "0.8rem",
                                  fontWeight: 800,
                                  borderRadius: `${tokens.borderRadius.sm}px`,
                                  bgcolor: cfg.bg,
                                }}
                              >
                                {Object.keys(STATUS_CONFIG).map((st) => (
                                  <MenuItem key={st} value={st} sx={{ fontSize: "0.8rem", fontWeight: 700 }}>
                                    {STATUS_CONFIG[st].label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>

                          <TableCell sx={{ textAlign: "right" }}>
                            <Box sx={{ display: "inline-flex", gap: 0.5 }}>
                              <Button
                                size="small"
                                variant="text"
                                onClick={() => setSelectedCandidate(app)}
                                sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.8rem" }}
                              >
                                View Note
                              </Button>
                              <IconButton size="small" color="error" onClick={() => handleDeleteApplication(app.id)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          )}
        </Box>
      )}

      {/* JOB CREATION / EDIT DIALOG */}
      <Dialog open={jobModalOpen} onClose={() => setJobModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingJob ? "Edit Job Position" : "Create New Job Opening"}
        </DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Job Title"
            required
            fullWidth
            value={jobFormData.title}
            onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
            placeholder="e.g. Frontend React / UI Engineer"
          />

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={jobFormData.department}
                label="Department"
                onChange={(e) => setJobFormData({ ...jobFormData, department: e.target.value })}
              >
                <MenuItem value="Engineering">Engineering</MenuItem>
                <MenuItem value="Backend & APIs">Backend & APIs</MenuItem>
                <MenuItem value="Design & Spatial">Design & Spatial</MenuItem>
                <MenuItem value="Growth & Sales">Growth & Sales</MenuItem>
                <MenuItem value="Marketing & SEO">Marketing & SEO</MenuItem>
                <MenuItem value="Customer Success">Customer Success</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Employment Type</InputLabel>
              <Select
                value={jobFormData.type}
                label="Employment Type"
                onChange={(e) => setJobFormData({ ...jobFormData, type: e.target.value })}
              >
                <MenuItem value="Full-Time / Remote">Full-Time / Remote</MenuItem>
                <MenuItem value="Full-Time / Internship">Full-Time / Internship</MenuItem>
                <MenuItem value="Full-Time / Contract">Full-Time / Contract</MenuItem>
                <MenuItem value="Contract / Part-Time">Contract / Part-Time</MenuItem>
                <MenuItem value="Partner / Commission">Partner / Commission</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField
              label="Location"
              fullWidth
              value={jobFormData.location}
              onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })}
            />
            <TextField
              label="Experience Required"
              fullWidth
              value={jobFormData.experience}
              onChange={(e) => setJobFormData({ ...jobFormData, experience: e.target.value })}
              placeholder="e.g. 1-3 Years"
            />
          </Box>

          <TextField
            label="Role Overview & Mission"
            multiline
            rows={3}
            fullWidth
            value={jobFormData.description}
            onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
            placeholder="Describe what the employee or partner will build and achieve..."
          />

          <TextField
            label="Required Skills & Competencies"
            multiline
            rows={2}
            fullWidth
            value={jobFormData.requirements}
            onChange={(e) => setJobFormData({ ...jobFormData, requirements: e.target.value })}
            placeholder="e.g. React.js, TailwindCSS, REST APIs, Git"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setJobModalOpen(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveJob} sx={{ fontWeight: 800, textTransform: "none" }}>
            {editingJob ? "Save Changes" : "Publish Opening"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* CANDIDATE COVER NOTE & PITCH DIALOG */}
      <Dialog open={Boolean(selectedCandidate)} onClose={() => setSelectedCandidate(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Candidate Application Note</span>
          {selectedCandidate && (
            <Chip
              label={STATUS_CONFIG[selectedCandidate.status]?.label || selectedCandidate.status}
              color={STATUS_CONFIG[selectedCandidate.status]?.color || "default"}
              size="small"
              sx={{ fontWeight: 800 }}
            />
          )}
        </DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {selectedCandidate && (
            <>
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  {selectedCandidate.name}
                </Typography>
                <Typography variant="body2" color="primary" fontWeight={700}>
                  {selectedCandidate.jobTitle}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Applied on {new Date(selectedCandidate.createdAt).toLocaleDateString()}
                </Typography>
              </Box>

              <Card sx={{ p: 2, bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>
                  Applicant Pitch / Message:
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                  {selectedCandidate.message || "No custom message or cover letter provided."}
                </Typography>
              </Card>

              {selectedCandidate.payoutMethod && (
                <Box sx={{ p: 2, borderRadius: `${tokens.borderRadius.md}px`, bgcolor: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                  <Typography variant="subtitle2" fontWeight={800} color="success.dark">
                    Partner Payout Details:
                  </Typography>
                  <Typography variant="body2">
                    Method: {selectedCandidate.payoutMethod}
                  </Typography>
                  {selectedCandidate.payoutDetails && (
                    <Typography variant="caption" display="block">
                      Details: {selectedCandidate.payoutDetails}
                    </Typography>
                  )}
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setSelectedCandidate(null)} sx={{ textTransform: "none", fontWeight: 700 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%", fontWeight: 700 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageLayout>
  );
}
