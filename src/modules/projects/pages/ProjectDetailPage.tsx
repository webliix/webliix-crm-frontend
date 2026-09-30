import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import { tokens } from "@/theme/tokens";
import {
  projectApi,
  type ProjectItem,
  type ProjectMilestoneItem,
  type ProjectTaskItem,
  type ProjectCommentItem,
} from "../api/projectApi";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectItem | null>(null);
  const [milestones, setMilestones] = useState<ProjectMilestoneItem[]>([]);
  const [tasks, setTasks] = useState<ProjectTaskItem[]>([]);
  const [comments, setComments] = useState<ProjectCommentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newComment, setNewComment] = useState<string>("");
  const [submittingComment, setSubmittingComment] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    setLoading(true);

    Promise.all([
      projectApi.getProject(id),
      projectApi.getMilestones(id),
      projectApi.getTasks(id),
      projectApi.getComments(id),
    ]).then(([projData, msData, taskData, commentData]) => {
      if (isMounted) {
        setProject(projData);
        setMilestones(msData);
        setTasks(taskData);
        setComments(commentData);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handlePostComment = async () => {
    if (!id || !newComment.trim()) return;
    setSubmittingComment(true);
    const added = await projectApi.addComment(id, newComment.trim());
    if (added) {
      setComments((prev) => [added, ...prev]);
      setNewComment("");
    } else {
      const opt: ProjectCommentItem = {
        id: Date.now(),
        projectId: Number(id),
        authorName: "You (Client)",
        authorEmail: "client@webliix.in",
        comment: newComment.trim(),
        createdAt: new Date().toISOString(),
      };
      setComments((prev) => [opt, ...prev]);
      setNewComment("");
    }
    setSubmittingComment(false);
  };

  if (loading) {
    return (
      <Box sx={{ py: 12, textAlign: "center" }}>
        <CircularProgress size={44} sx={{ color: tokens.colors.primary.main }} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontWeight: 500 }}>
          Loading project details...
        </Typography>
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
          Back to My Projects
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/projects")}
        sx={{ mb: 3, fontWeight: 700, color: tokens.colors.secondary[700] }}
      >
        Back to My Projects
      </Button>

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

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxW: 800, lineHeight: 1.7 }}>
            {project.description || "Website and application development deliverables."}
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

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1.1fr 0.9fr" }, gap: 4 }}>
        {/* Left Column: Milestones & Tasks */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Milestones */}
          <Card sx={{ borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}` }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                <FlagOutlinedIcon sx={{ color: tokens.colors.primary.main }} />
                <Typography variant="h6" fontWeight={700} color={tokens.colors.secondary[900]}>
                  Project Milestones
                </Typography>
              </Box>
              <Divider sx={{ mb: 2.5 }} />

              {milestones.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                  Milestones for this project are currently being set up by the team.
                </Typography>
              ) : (
                <Box sx={{ display: "grid", gap: 2 }}>
                  {milestones.map((m) => (
                    <Box
                      key={m.id}
                      sx={{
                        p: 2,
                        borderRadius: tokens.borderRadius.md,
                        bgcolor: tokens.colors.secondary[50],
                        border: `1px solid ${tokens.colors.secondary[200]}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <CheckCircleOutlinedIcon sx={{ color: m.status === "COMPLETED" ? tokens.colors.success.main : tokens.colors.secondary[400] }} />
                        <Box>
                          <Typography variant="subtitle2" fontWeight={700} color={tokens.colors.secondary[900]}>
                            {m.milestoneName}
                          </Typography>
                          {m.description && (
                            <Typography variant="caption" color="text.secondary">
                              {m.description}
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      {m.dueDate && (
                        <Typography variant="caption" fontWeight={600} color="text.secondary">
                          Due: {new Date(m.dueDate).toLocaleDateString()}
                        </Typography>
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
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                <TaskOutlinedIcon sx={{ color: tokens.colors.primary.main }} />
                <Typography variant="h6" fontWeight={700} color={tokens.colors.secondary[900]}>
                  Task Breakdown
                </Typography>
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
                      <Typography variant="body2" fontWeight={600} color={tokens.colors.secondary[900]}>
                        {t.taskName}
                      </Typography>
                      <Chip
                        label={t.status || "TODO"}
                        size="small"
                        sx={{ fontSize: "0.725rem", fontWeight: 700 }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Right Column: Project Instructions & Communication */}
        <Box>
          <Card sx={{ borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}` }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                <ForumOutlinedIcon sx={{ color: tokens.colors.primary.main }} />
                <Box>
                  <Typography variant="h6" fontWeight={700} color={tokens.colors.secondary[900]}>
                    Project Updates & Instructions
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Provide instructions directly to the project team.
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
                  placeholder="Type an update or instruction for the developers..."
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
                  Send Update
                </Button>
              </Box>

              {/* Message List */}
              <Box sx={{ display: "grid", gap: 2, maxH: 450, overflowY: "auto" }}>
                {comments.length === 0 ? (
                  <Typography variant="caption" color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
                    No instructions posted yet. Send your first message above!
                  </Typography>
                ) : (
                  comments.map((c) => (
                    <Box
                      key={c.id}
                      sx={{
                        p: 2,
                        borderRadius: tokens.borderRadius.md,
                        bgcolor: tokens.colors.secondary[50],
                        border: `1px solid ${tokens.colors.secondary[200]}`,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: "0.75rem", bgcolor: tokens.colors.primary.main }}>
                          {(c.authorName || "C").charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" fontWeight={700} color={tokens.colors.secondary[900]}>
                            {c.authorName || "Client"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {c.createdAt ? new Date(c.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" }) : "Just now"}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.primary" sx={{ fontSize: "0.875rem", leading: 1.5 }}>
                        {c.comment}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
