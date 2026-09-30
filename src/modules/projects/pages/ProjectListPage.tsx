import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import { BrandLoader } from "@/shared/components/ui/feedback/BrandLoader";
import FolderSpecialOutlinedIcon from "@mui/icons-material/FolderSpecialOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import { tokens } from "@/theme/tokens";
import { useNavigate } from "react-router-dom";
import { projectApi, type ProjectItem } from "../api/projectApi";

export default function ProjectListPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    projectApi.getProjects().then((res) => {
      if (isMounted) {
        setProjects(res.content);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

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
    return (
      <Chip
        label={status || "Pending"}
        size="small"
        sx={{ bgcolor: tokens.colors.secondary[200], color: tokens.colors.secondary[800], fontWeight: 600 }}
      />
    );
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color={tokens.colors.secondary[900]} gutterBottom>
            My Projects & Deliverables
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your project progress, milestones, instructions, and real-time deliverables.
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <BrandLoader message="Loading projects & deliverables..." size="medium" />
        </Box>
      ) : projects.length === 0 ? (
        <Card sx={{ borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}`, p: 6, textAlign: "center" }}>
          <FolderSpecialOutlinedIcon sx={{ fontSize: 56, color: tokens.colors.secondary[300], mb: 2 }} />
          <Typography variant="h6" fontWeight={700} color={tokens.colors.secondary[800]} gutterBottom>
            No Active Projects Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480, mx: "auto" }}>
            You do not currently have any active projects assigned to your account. If you believe this is an error, please reach out via Support Tickets.
          </Typography>
        </Card>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }, gap: 3 }}>
          {projects.map((project) => (
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
                  {project.description || "Website and web application development project with Webliix Studios."}
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

                {/* Dates */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 3, pt: 2, borderTop: `1px solid ${tokens.colors.secondary[100]}` }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: tokens.colors.secondary[400] }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      {project.dueDate ? `Due ${new Date(project.dueDate).toLocaleDateString()}` : "Active Project"}
                    </Typography>
                  </Box>

                  <Button
                    size="small"
                    endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    sx={{ fontWeight: 700, fontSize: "0.8125rem", p: 0 }}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
