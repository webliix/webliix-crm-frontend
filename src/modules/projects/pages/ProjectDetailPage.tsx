import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import Checkbox from "@mui/material/Checkbox";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import AddIcon from "@mui/icons-material/Add";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { tokens } from "@/theme/tokens";
import {
  projectApi,
  type ProjectItem,
  type ProjectMilestoneItem,
  type ProjectTaskItem,
  type ProjectCommentItem,
} from "../api/projectApi";
import { BrandLoader } from "@/shared/components/ui/feedback/BrandLoader";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectItem | null>(null);
  const [milestones, setMilestones] = useState<ProjectMilestoneItem[]>([]);
  const [tasks, setTasks] = useState<ProjectTaskItem[]>([]);
  const [comments, setComments] = useState<ProjectCommentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Super Admin Progress & Status Configuration
  const [progressVal, setProgressVal] = useState<number>(0);
  const [statusVal, setStatusVal] = useState<string>("IN_PROGRESS");
  const [updateNote, setUpdateNote] = useState<string>("");
  const [updatingProgress, setUpdatingProgress] = useState<boolean>(false);
  const [progressSuccess, setProgressSuccess] = useState<boolean>(false);

  // New Comment / Instruction State
  const [newComment, setNewComment] = useState<string>("");
  const [submittingComment, setSubmittingComment] = useState<boolean>(false);

  // Add Milestone Dialog
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState<boolean>(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState<string>("");
  const [newMilestoneDesc, setNewMilestoneDesc] = useState<string>("");
  const [newMilestoneDate, setNewMilestoneDate] = useState<string>("");

  // Add Task Dialog
  const [taskDialogOpen, setTaskDialogOpen] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskDesc, setNewTaskDesc] = useState<string>("");
  const [newTaskAssignee, setNewTaskAssignee] = useState<string>("");

  // Edit Documentation Dialog
  const [docDialogOpen, setDocDialogOpen] = useState<boolean>(false);
  const [docUrl, setDocUrl] = useState<string>("");
  const [archNotes, setArchNotes] = useState<string>("");

  const loadData = () => {
    if (!id) return;
    setLoading(true);

    Promise.all([
      projectApi.getProject(id),
      projectApi.getMilestones(id),
      projectApi.getTasks(id),
      projectApi.getComments(id),
    ]).then(([projData, msData, taskData, commentData]) => {
      setProject(projData);
      if (projData) {
        setProgressVal(projData.progressPercentage || 0);
        setStatusVal(projData.status || "IN_PROGRESS");
        setDocUrl(projData.documentationUrl || "");
        setArchNotes(projData.architectureNotes || "");
      }
      setMilestones(msData);
      setTasks(taskData);
      setComments(commentData);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleUpdateProgressAndNotify = async () => {
    if (!id) return;
    setUpdatingProgress(true);
    const updated = await projectApi.updateProjectProgress(id, progressVal, statusVal, updateNote);
    if (updated) {
      setProject(updated);
      setProgressSuccess(true);
      setUpdateNote("");
      projectApi.getComments(id).then((c) => setComments(c));
      setTimeout(() => setProgressSuccess(false), 4000);
    }
    setUpdatingProgress(false);
  };

  const handlePostComment = async () => {
    if (!id || !newComment.trim()) return;
    setSubmittingComment(true);
    const added = await projectApi.addComment(id, {
      message: newComment.trim(),
      authorName: "Webliix Lead / Admin",
      authorRole: "ADMIN",
    });
    if (added) {
      setComments((prev) => [added, ...prev]);
      setNewComment("");
    }
    setSubmittingComment(false);
  };

  const handleToggleMilestone = async (m: ProjectMilestoneItem) => {
    if (!id) return;
    const nextCompleted = !m.completed;
    await projectApi.updateMilestone(id, m.id, { completed: nextCompleted });
    setMilestones((prev) =>
      prev.map((item) => (item.id === m.id ? { ...item, completed: nextCompleted } : item))
    );
  };

  const handleAddMilestone = async () => {
    if (!id || !newMilestoneTitle.trim()) return;
    const added = await projectApi.addMilestone(id, {
      title: newMilestoneTitle.trim(),
      description: newMilestoneDesc.trim(),
      dueDate: newMilestoneDate || undefined,
    });
    if (added) {
      setMilestones((prev) => [...prev, added]);
      setMilestoneDialogOpen(false);
      setNewMilestoneTitle("");
      setNewMilestoneDesc("");
      setNewMilestoneDate("");
    }
  };

  const handleAddTask = async () => {
    if (!id || !newTaskTitle.trim()) return;
    const added = await projectApi.addTask(id, {
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      assignedTo: newTaskAssignee.trim() || undefined,
      status: "TODO",
    });
    if (added) {
      setTasks((prev) => [...prev, added]);
      setTaskDialogOpen(false);
      setNewTaskTitle("");
      setNewTaskDesc("");
      setNewTaskAssignee("");
    }
  };

  const handleSaveDocumentation = async () => {
    if (!id) return;
    await projectApi.updateProject(id, {
      documentationUrl: docUrl,
      architectureNotes: archNotes,
    });
    if (project) {
      setProject({ ...project, documentationUrl: docUrl, architectureNotes: archNotes });
    }
    setDocDialogOpen(false);
  };

  // Structured PDF Export Function
  const handleExportPDF = () => {
    if (!project) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Webliix Project Documentation - ${project.projectName}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #1e293b; line-height: 1.6; }
          .header { border-bottom: 3px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
          .title { font-size: 26px; font-weight: 800; color: #0f172a; margin: 0; }
          .subtitle { color: #64748b; font-size: 14px; margin-top: 5px; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 700; background: #e0e7ff; color: #4338ca; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #4338ca; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px; }
          .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px; }
          .meta-item { background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; }
          .meta-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; }
          .meta-value { font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 2px; }
          .phase-item { padding: 12px; border-left: 4px solid #6366f1; background: #f8fafc; margin-bottom: 10px; border-radius: 0 6px 6px 0; }
          .phase-title { font-weight: 700; font-size: 14px; }
          .phase-desc { font-size: 12px; color: #64748b; margin-top: 2px; }
          .code-block { background: #0f172a; color: #f8fafc; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 12px; white-space: pre-wrap; }
          .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">${project.projectName}</h1>
            <div class="subtitle">Official Project Architecture Specification & Technical Summary</div>
          </div>
          <div>
            <span class="badge">${project.projectCode || "PRJ-" + project.id}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Project Overview & Metadata</div>
          <div class="meta-grid">
            <div class="meta-item">
              <div class="meta-label">Client Organization</div>
              <div class="meta-value">${project.customerName || project.customerCompanyName || "Enterprise Client"}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Overall Completion</div>
              <div class="meta-value">${project.progressPercentage ?? 0}% (${project.status})</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Initiation Date</div>
              <div class="meta-value">${project.startDate || "N/A"}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Expected Handover Date</div>
              <div class="meta-value">${project.expectedEndDate || "N/A"}</div>
            </div>
          </div>
          <p>${project.description || "Website and application engineering project."}</p>
        </div>

        <div class="section">
          <div class="section-title">Lifecycle Phases & Milestones</div>
          ${milestones.map((m, idx) => `
            <div class="phase-item">
              <div class="phase-title">Phase ${idx + 1}: ${m.title || m.milestoneName} ${m.completed ? "(Completed)" : "(In Progress)"}</div>
              <div class="phase-desc">${m.description || "Standard milestone phase"} - Due: ${m.dueDate || "N/A"}</div>
            </div>
          `).join("")}
        </div>

        <div class="section">
          <div class="section-title">System Architecture & Technical Specifications</div>
          <div class="code-block">${project.architectureNotes || "Standard Webliix Microservices Architecture: Spring Boot REST Backend + React Vite Single Page Client + PostgreSQL Persistence Layer."}</div>
        </div>

        <div class="footer">
          Generated automatically by Webliix Project Engine &bull; noreply@webliix.com &bull; &copy; ${new Date().getFullYear()} Webliix
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <Box sx={{ py: 6, textAlign: "center" }}>
        <BrandLoader message="Loading project details, milestones & instructions..." size="medium" />
      </Box>
    );
  }

  if (!project) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error" gutterBottom>
          Project Not Found
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/projects")} sx={{ mt: 2 }}>
          Back to Projects
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      {/* Back Button & Action Row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/projects")}
          sx={{ fontWeight: 700, color: tokens.colors.secondary[700] }}
        >
          Back to Projects
        </Button>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfOutlinedIcon />}
            onClick={handleExportPDF}
            sx={{ fontWeight: 700, borderRadius: tokens.borderRadius.md }}
          >
            Export Project PDF
          </Button>

          <Button
            variant="outlined"
            startIcon={<EditNoteOutlinedIcon />}
            onClick={() => setDocDialogOpen(true)}
            sx={{ fontWeight: 700, borderRadius: tokens.borderRadius.md }}
          >
            Edit Documentation
          </Button>
        </Box>
      </Box>

      {/* Hero Header Card */}
      <Card
        sx={{
          borderRadius: tokens.borderRadius.lg,
          border: `1px solid ${tokens.colors.secondary[200]}`,
          mb: 4,
          background: `linear-gradient(135deg, #ffffff 0%, ${tokens.colors.primary[50]} 100%)`,
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Chip
                label={project.projectCode || `PRJ-${project.id}`}
                sx={{ bgcolor: tokens.colors.primary.main, color: "#ffffff", fontWeight: 800 }}
              />
              <Typography variant="h4" fontWeight={800} color={tokens.colors.secondary[900]}>
                {project.projectName}
              </Typography>
            </Box>

            <Chip
              label={project.status || "In Progress"}
              sx={{ bgcolor: tokens.colors.success[100], color: tokens.colors.success[700], fontWeight: 700, px: 1 }}
            />
          </Box>

          {(project.customerName || project.customerCompanyName || project.customerEmail || project.customer?.companyName) && (
            <Box sx={{ mb: 2, p: 2, borderRadius: tokens.borderRadius.md, bgcolor: "#ffffff", border: `1px solid ${tokens.colors.secondary[200]}`, display: "flex", gap: 3, flexWrap: "wrap", alignItems: "center" }}>
              <Typography variant="body2" fontWeight={600} color={tokens.colors.secondary[800]}>
                Client: <strong>{project.customerName || project.customerCompanyName || project.customer?.contactPerson || project.customer?.companyName || "N/A"}</strong>
              </Typography>
              {(project.customerEmail || project.customer?.email) && (
                <Typography variant="body2" color="text.secondary">
                  Email: <strong>{project.customerEmail || project.customer?.email}</strong>
                </Typography>
              )}
              {project.expectedEndDate && (
                <Typography variant="body2" color="text.secondary">
                  Expected Handover: <strong>{new Date(project.expectedEndDate).toLocaleDateString()}</strong>
                </Typography>
              )}
              {project.budget && (
                <Typography variant="body2" color="text.secondary">
                  Budget: <strong>${project.budget.toLocaleString()}</strong>
                </Typography>
              )}
            </Box>
          )}

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 840, lineHeight: 1.7 }}>
            {project.description || "Webliix cloud platform deliverables."}
          </Typography>

          {/* Progress Overview */}
          <Box sx={{ bgcolor: "#ffffff", p: 2.5, borderRadius: tokens.borderRadius.md, border: `1px solid ${tokens.colors.secondary[200]}` }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="subtitle2" fontWeight={700} color={tokens.colors.secondary[800]}>
                Overall Project Progress
              </Typography>
              <Typography variant="subtitle2" fontWeight={800} color={tokens.colors.primary.main}>
                {project.progressPercentage ?? 0}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={project.progressPercentage ?? 0}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: tokens.colors.secondary[100],
                "& .MuiLinearProgress-bar": { borderRadius: 5, bgcolor: tokens.colors.primary.main },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Super Admin Progress & Status Configuration Panel */}
      <Card sx={{ borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.primary[200]}`, bgcolor: tokens.colors.primary[50], mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
            <EmailOutlinedIcon sx={{ color: tokens.colors.primary.main }} />
            <Typography variant="h6" fontWeight={800} color={tokens.colors.primary[900]}>
              Super Admin Progress Control & Automated Client Notification
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Adjust project progress and status. Posting an update will trigger an automated email from <strong>noreply@webliix.com</strong> to the customer and create a live notification in their client portal.
          </Typography>

          {progressSuccess && (
            <Alert severity="success" sx={{ mb: 2.5, fontWeight: 600 }}>
              Project progress updated successfully! Client has been notified via email and portal.
            </Alert>
          )}

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" }, gap: 3, alignItems: "center" }}>
            <Box>
              <Typography variant="caption" fontWeight={700} color={tokens.colors.secondary[700]}>
                Adjust Progress: {progressVal}%
              </Typography>
              <Slider
                value={progressVal}
                min={0}
                max={100}
                step={5}
                onChange={(_, val) => setProgressVal(val as number)}
                valueLabelDisplay="auto"
                sx={{ color: tokens.colors.primary.main, my: 1 }}
              />
            </Box>

            <TextField
              select
              size="small"
              label="Project Status"
              value={statusVal}
              onChange={(e) => setStatusVal(e.target.value)}
              sx={{ bgcolor: "#ffffff" }}
            >
              <MenuItem value="PLANNING">Planning & Initiation</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress (Active)</MenuItem>
              <MenuItem value="TESTING">QA & Testing</MenuItem>
              <MenuItem value="COMPLETED">Completed & Deployed</MenuItem>
              <MenuItem value="ON_HOLD">On Hold</MenuItem>
            </TextField>
          </Box>

          <Box sx={{ mt: 2.5, display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Add an update note for the client (e.g. Completed Phase 2 UI wireframes and database migrations)..."
              value={updateNote}
              onChange={(e) => setUpdateNote(e.target.value)}
              sx={{ bgcolor: "#ffffff", flex: 1 }}
            />
            <Button
              variant="contained"
              disabled={updatingProgress}
              onClick={handleUpdateProgressAndNotify}
              sx={{ fontWeight: 700, borderRadius: tokens.borderRadius.md, px: 3, whiteSpace: "nowrap" }}
            >
              {updatingProgress ? "Updating..." : "Post Update & Notify Client"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1.1fr 0.9fr" }, gap: 4 }}>
        {/* Left Column: Milestones, Tasks & Documentation */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Milestones / Phases */}
          <Card sx={{ borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}` }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <FlagOutlinedIcon sx={{ color: tokens.colors.primary.main }} />
                  <Typography variant="h6" fontWeight={700} color={tokens.colors.secondary[900]}>
                    Lifecycle Phases & Milestones
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setMilestoneDialogOpen(true)}
                  sx={{ fontWeight: 700 }}
                >
                  Add Milestone
                </Button>
              </Box>
              <Divider sx={{ mb: 2.5 }} />

              {milestones.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                  No milestones configured yet for this project.
                </Typography>
              ) : (
                <Box sx={{ display: "grid", gap: 2 }}>
                  {milestones.map((m) => (
                    <Box
                      key={m.id}
                      sx={{
                        p: 2,
                        borderRadius: tokens.borderRadius.md,
                        bgcolor: m.completed ? tokens.colors.success[50] : tokens.colors.secondary[50],
                        border: `1px solid ${m.completed ? tokens.colors.success[200] : tokens.colors.secondary[200]}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Checkbox
                          checked={Boolean(m.completed)}
                          onChange={() => handleToggleMilestone(m)}
                          color="success"
                        />
                        <Box>
                          <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            color={tokens.colors.secondary[900]}
                            sx={{ textDecoration: m.completed ? "line-through" : "none" }}
                          >
                            {m.title || m.milestoneName}
                          </Typography>
                          {m.description && (
                            <Typography variant="caption" color="text.secondary">
                              {m.description}
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      {m.dueDate && (
                        <Chip
                          label={`Target: ${new Date(m.dueDate).toLocaleDateString()}`}
                          size="small"
                          sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                        />
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card sx={{ borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}` }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <TaskOutlinedIcon sx={{ color: tokens.colors.primary.main }} />
                  <Typography variant="h6" fontWeight={700} color={tokens.colors.secondary[900]}>
                    Task Breakdown
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setTaskDialogOpen(true)}
                  sx={{ fontWeight: 700 }}
                >
                  Add Task
                </Button>
              </Box>
              <Divider sx={{ mb: 2.5 }} />

              {tasks.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                  No individual tasks logged yet for this project.
                </Typography>
              ) : (
                <Box sx={{ display: "grid", gap: 1.5 }}>
                  {tasks.map((t) => (
                    <Box
                      key={t.id}
                      sx={{
                        p: 2,
                        borderRadius: tokens.borderRadius.md,
                        bgcolor: "#ffffff",
                        border: `1px solid ${tokens.colors.secondary[200]}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={600} color={tokens.colors.secondary[900]}>
                          {t.title || t.taskName}
                        </Typography>
                        {t.assignedTo && (
                          <Typography variant="caption" color="text.secondary">
                            Assigned to: {t.assignedTo}
                          </Typography>
                        )}
                      </Box>
                      <Chip
                        label={t.status || "TODO"}
                        size="small"
                        color={t.status === "DONE" ? "success" : "default"}
                        sx={{ fontSize: "0.725rem", fontWeight: 700 }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Documentation & Architecture Blueprint */}
          <Card sx={{ borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}` }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={800} color={tokens.colors.secondary[900]} gutterBottom>
                Project Documentation & Technical Blueprint
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Technical specifications, schema diagrams, and architecture blueprints.
              </Typography>
              <Divider sx={{ mb: 2.5 }} />

              <Box sx={{ p: 2, borderRadius: tokens.borderRadius.md, bgcolor: tokens.colors.secondary[50], border: `1px solid ${tokens.colors.secondary[200]}`, mb: 2 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase">
                  Architecture Specifications
                </Typography>
                <Typography variant="body2" color={tokens.colors.secondary[900]} sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}>
                  {project.architectureNotes || "Standard Webliix Enterprise Microservices Architecture with Spring Boot and React."}
                </Typography>
              </Box>

              {project.documentationUrl && (
                <Button
                  variant="outlined"
                  startIcon={<OpenInNewIcon />}
                  href={project.documentationUrl}
                  target="_blank"
                  sx={{ fontWeight: 700, borderRadius: tokens.borderRadius.md }}
                >
                  Open Cloud Documentation Link
                </Button>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Right Column: Project Instructions & Client Updates */}
        <Box>
          <Card sx={{ borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}` }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                <ForumOutlinedIcon sx={{ color: tokens.colors.primary.main }} />
                <Box>
                  <Typography variant="h6" fontWeight={700} color={tokens.colors.secondary[900]}>
                    Client Instructions & Updates Stream
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Real-time instructions and feedback between client and Webliix team.
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 2.5 }} />

              {/* Input Box */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Post an update or reply to client instructions..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  sx={{ mb: 1.5 }}
                />
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  disabled={!newComment.trim() || submittingComment}
                  onClick={handlePostComment}
                  sx={{ borderRadius: tokens.borderRadius.md, fontWeight: 700 }}
                >
                  Send Team Update
                </Button>
              </Box>

              {/* Message List */}
              <Box sx={{ display: "grid", gap: 2, maxHeight: 480, overflowY: "auto" }}>
                {comments.length === 0 ? (
                  <Typography variant="caption" color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
                    No instructions or updates recorded yet.
                  </Typography>
                ) : (
                  comments.map((c) => (
                    <Box
                      key={c.id}
                      sx={{
                        p: 2,
                        borderRadius: tokens.borderRadius.md,
                        bgcolor: c.authorRole === "CLIENT" ? tokens.colors.primary[50] : tokens.colors.secondary[50],
                        border: `1px solid ${c.authorRole === "CLIENT" ? tokens.colors.primary[200] : tokens.colors.secondary[200]}`,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar sx={{ width: 28, height: 28, fontSize: "0.75rem", bgcolor: c.authorRole === "CLIENT" ? tokens.colors.primary.main : tokens.colors.secondary[800] }}>
                            {(c.authorName || (c.authorRole === "CLIENT" ? "C" : "A")).charAt(0)}
                          </Avatar>
                          <Typography variant="subtitle2" fontWeight={700} color={tokens.colors.secondary[900]}>
                            {c.authorName || (c.authorRole === "CLIENT" ? "Client Instruction" : "Webliix Lead")}
                          </Typography>
                        </Box>
                        <Chip
                          label={c.authorRole === "CLIENT" ? "Client" : "Team"}
                          size="small"
                          sx={{ fontSize: "0.6875rem", fontWeight: 700 }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.primary" sx={{ fontSize: "0.875rem", lineHeight: 1.5 }}>
                        {c.message || c.comment}
                      </Typography>
                      {c.createdAt && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                          {new Date(c.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                        </Typography>
                      )}
                    </Box>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Add Milestone Dialog */}
      <Dialog open={milestoneDialogOpen} onClose={() => setMilestoneDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Add Project Lifecycle Milestone</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          <TextField
            required
            fullWidth
            label="Milestone / Phase Title"
            placeholder="e.g. Phase 6: Mobile App Integration"
            value={newMilestoneTitle}
            onChange={(e) => setNewMilestoneTitle(e.target.value)}
          />
          <TextField
            multiline
            rows={2}
            fullWidth
            label="Phase Description"
            value={newMilestoneDesc}
            onChange={(e) => setNewMilestoneDesc(e.target.value)}
          />
          <TextField
            fullWidth
            type="date"
            label="Target Due Date"
            value={newMilestoneDate}
            onChange={(e) => setNewMilestoneDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setMilestoneDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddMilestone} sx={{ fontWeight: 700 }}>
            Save Milestone
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={taskDialogOpen} onClose={() => setTaskDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Add Project Task</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          <TextField
            required
            fullWidth
            label="Task Name"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <TextField
            multiline
            rows={2}
            fullWidth
            label="Task Description"
            value={newTaskDesc}
            onChange={(e) => setNewTaskDesc(e.target.value)}
          />
          <TextField
            fullWidth
            label="Assignee"
            placeholder="e.g. Lead Engineer"
            value={newTaskAssignee}
            onChange={(e) => setNewTaskAssignee(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setTaskDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddTask} sx={{ fontWeight: 700 }}>
            Save Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Documentation Dialog */}
      <Dialog open={docDialogOpen} onClose={() => setDocDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Edit Project Documentation & Specs</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          <TextField
            fullWidth
            label="Cloud Documentation Link"
            value={docUrl}
            onChange={(e) => setDocUrl(e.target.value)}
          />
          <TextField
            multiline
            rows={4}
            fullWidth
            label="Architecture Notes & Technical Specs"
            value={archNotes}
            onChange={(e) => setArchNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDocDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveDocumentation} sx={{ fontWeight: 700 }}>
            Save Documentation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
