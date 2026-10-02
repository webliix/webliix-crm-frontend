import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Badge from "@mui/material/Badge";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import FolderSharedOutlinedIcon from "@mui/icons-material/FolderSharedOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LaunchIcon from "@mui/icons-material/Launch";
import { PageLayout } from "@/shared/components/ui/layout";
import { BrandLoader } from "@/shared/components/ui/feedback/BrandLoader";
import { DocumentExplorer } from "@/modules/documents/components/DocumentExplorer";
import { documentService } from "@/modules/documents/services/document.service";
import type { StoredDocument } from "@/modules/documents/types/document.types";
import { ticketService } from "@/modules/tickets/services/ticket.service";
import type { TicketResponse } from "@/modules/tickets/types/ticket.types";
import { TicketDetailsDrawer, TicketCreateDrawer } from "@/modules/tickets/components";
import { projectApi, type ProjectItem } from "@/modules/projects/api/projectApi";
import { NotificationDrawer } from "@/shared/components/ui/notification/NotificationDrawer";
import { useAppSelector } from "@/app/store/redux";
import { selectUser } from "@/modules/auth/store/selectors";
import { tokens } from "@/theme/tokens";
import { useNavigate } from "react-router-dom";

export default function ClientPortalPage() {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  const [activeTab, setActiveTab] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [notifOpen, setNotifOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(2);

  // Ticket states
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [ticketDetailsOpen, setTicketDetailsOpen] = useState<boolean>(false);
  const [ticketCreateOpen, setTicketCreateOpen] = useState<boolean>(false);

  const clientName = user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Valued Client";

  const loadPortalData = async () => {
    setLoading(true);
    try {
      const [projList, docList, ticketList] = await Promise.all([
        projectApi.getProjects(),
        documentService.getDocuments(),
        ticketService.getAllTickets(),
      ]);

      setProjects(Array.isArray(projList) ? projList : (projList as any)?.content || []);
      setDocuments(docList || []);
      setTickets(Array.isArray(ticketList) ? ticketList : []);
    } catch (err) {
      console.error("Error loading portal data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortalData();
  }, []);

  if (loading) {
    return (
      <PageLayout title="Client Experience Portal" subtitle="Your real-time engineering delivery hub">
        <Box sx={{ py: 8, textAlign: "center" }}>
          <BrandLoader message="Synchronizing client portal projects, documents & helpdesk..." size="medium" />
        </Box>
      </PageLayout>
    );
  }

  const activeProjectsCount = projects.filter((p) => p.status !== "COMPLETED").length;
  const openTicketsCount = tickets.filter((t) => t.status !== "RESOLVED" && t.status !== "CLOSED").length;

  return (
    <PageLayout
      title="Webliix Client Portal"
      subtitle={`Welcome back, ${clientName} • Real-time project tracking, multi-type document repository & priority live support`}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard", onClick: () => navigate("/dashboard") },
        { label: "Client Portal" },
      ]}
      actions={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsActiveOutlinedIcon sx={{ fontSize: 18 }} />
              </Badge>
            }
            onClick={() => setNotifOpen(true)}
            sx={{ fontWeight: 700 }}
          >
            Notifications
          </Button>

          <Button
            variant="contained"
            startIcon={<ConfirmationNumberOutlinedIcon />}
            onClick={() => setTicketCreateOpen(true)}
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
            }}
          >
            Raise Support Ticket
          </Button>
        </Box>
      }
    >
      {/* Executive Portal Stat Bar */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
          gap: 2,
          mb: 3,
        }}
      >
        <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: "background.paper" }}>
          <CardContent sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: tokens.colors.primary[50], color: tokens.colors.primary.main }}>
              <TrendingUpIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} color={tokens.colors.secondary[900]}>
                {activeProjectsCount}
              </Typography>
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                Active Projects & Deliverables
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: "background.paper" }}>
          <CardContent sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: tokens.colors.warning[50], color: tokens.colors.warning.main }}>
              <ConfirmationNumberOutlinedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} color={tokens.colors.secondary[900]}>
                {openTicketsCount}
              </Typography>
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                Open Support Inquiries
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: "background.paper" }}>
          <CardContent sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: tokens.colors.info[50], color: tokens.colors.info.main }}>
              <FolderSharedOutlinedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} color={tokens.colors.secondary[900]}>
                {documents.length}
              </Typography>
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                Shared Documents & Specs
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: "background.paper" }}>
          <CardContent sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: tokens.colors.success[50], color: tokens.colors.success.main }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} color={tokens.colors.secondary[900]}>
                100%
              </Typography>
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                SLA Compliance
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Main Tabbed Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              fontWeight: 700,
              fontSize: "0.875rem",
              textTransform: "none",
              minHeight: 48,
            },
          }}
        >
          <Tab icon={<TrendingUpIcon sx={{ fontSize: 18 }} />} iconPosition="start" label={`Active Projects (${projects.length})`} />
          <Tab icon={<FolderSharedOutlinedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label={`Document Library (${documents.length})`} />
          <Tab icon={<SupportAgentIcon sx={{ fontSize: 18 }} />} iconPosition="start" label={`Live Support Helpdesk (${tickets.length})`} />
        </Tabs>
      </Box>

      {/* TAB 0: ACTIVE PROJECTS OVERVIEW */}
      {activeTab === 0 && (
        <Box sx={{ display: "grid", gap: 3 }}>
          {projects.length === 0 ? (
            <Card variant="outlined" sx={{ borderRadius: 2, p: 4, textAlign: "center" }}>
              <Typography variant="subtitle1" fontWeight={700}>
                No projects assigned to this account yet.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                When your project kick-off occurs, live milestones and architecture deliverables will appear here.
              </Typography>
            </Card>
          ) : (
            <Box sx={{ display: "grid", gap: 2.5 }}>
              {projects.map((proj) => (
                <Card
                  key={proj.id}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    p: 3,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: tokens.colors.primary.main,
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2, mb: 2 }}>
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                        <Typography variant="h6" fontWeight={800} color={tokens.colors.secondary[900]}>
                          {proj.projectName}
                        </Typography>
                        <Chip
                          label={proj.projectCode || `PRJ-${proj.id}`}
                          size="small"
                          color="primary"
                          sx={{ fontWeight: 700, fontSize: "0.7rem", height: 22 }}
                        />
                        <Chip
                          label={proj.status || "IN_PROGRESS"}
                          size="small"
                          color={proj.status === "COMPLETED" ? "success" : "primary"}
                          sx={{ fontWeight: 700, fontSize: "0.7rem", height: 22 }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 720 }}>
                        {proj.description || "Webliix Custom Engineering Project"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        endIcon={<LaunchIcon sx={{ fontSize: 16 }} />}
                        onClick={() => navigate(`/projects/${proj.id}`)}
                        sx={{ fontWeight: 700 }}
                      >
                        Project Details & Specs
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<ConfirmationNumberOutlinedIcon sx={{ fontSize: 16 }} />}
                        onClick={() => {
                          setTicketCreateOpen(true);
                        }}
                        sx={{ fontWeight: 700 }}
                      >
                        Raise Ticket
                      </Button>
                    </Box>
                  </Box>

                  {/* Progress Bar */}
                  <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="caption" fontWeight={700} color="text.secondary">
                        Overall Engineering Completion
                      </Typography>
                      <Typography variant="caption" fontWeight={800} color="primary.main">
                        {proj.progressPercentage ?? 0}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={proj.progressPercentage ?? 0}
                      sx={{
                        height: 8,
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* TAB 1: DOCUMENT LIBRARY (MULTI-TYPE) */}
      {activeTab === 1 && (
        <Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight={800} color={tokens.colors.secondary[900]}>
              Customer & Product Documentation Hub
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Access contracts, technical specifications, project briefs, milestone deliverables, NDAs, and receipts uploaded by Webliix.
            </Typography>
          </Box>

          <DocumentExplorer
            documents={documents}
            onRefresh={loadPortalData}
            allowUpload={true}
            module="CUSTOMER"
            productName="Client Solution"
          />
        </Box>
      )}

      {/* TAB 2: LIVE SUPPORT HELPDESK & TICKETS */}
      {activeTab === 2 && (
        <Box sx={{ display: "grid", gap: 2.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight={800} color={tokens.colors.secondary[900]}>
                Priority Support & Live Chat Helpdesk
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Raise inquiries, report issues, and converse in real-time with Webliix engineers and managers.
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<ConfirmationNumberOutlinedIcon />}
              onClick={() => setTicketCreateOpen(true)}
              sx={{ fontWeight: 700 }}
            >
              Raise New Ticket
            </Button>
          </Box>

          {tickets.length === 0 ? (
            <Card variant="outlined" sx={{ borderRadius: 2, p: 4, textAlign: "center" }}>
              <SupportAgentIcon sx={{ fontSize: 48, color: tokens.colors.primary.main, mb: 1 }} />
              <Typography variant="subtitle1" fontWeight={700}>
                No support tickets raised yet.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 440, mx: "auto", mt: 0.5, mb: 2 }}>
                Have questions or need technical modifications? Raise a ticket to chat live with our support and engineering team.
              </Typography>
              <Button variant="contained" onClick={() => setTicketCreateOpen(true)} sx={{ fontWeight: 700 }}>
                Raise Support Ticket
              </Button>
            </Card>
          ) : (
            <Box sx={{ display: "grid", gap: 2 }}>
              {tickets.map((t) => (
                <Card
                  key={t.id}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    p: 2.5,
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    gap: 2,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: tokens.colors.primary.main,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                    },
                  }}
                >
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={800}
                        color="primary.main"
                        sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                        onClick={() => {
                          setSelectedTicketId(t.id);
                          setTicketDetailsOpen(true);
                        }}
                      >
                        {t.ticketNumber}
                      </Typography>
                      <Chip
                        label={t.status}
                        size="small"
                        color={t.status === "RESOLVED" || t.status === "CLOSED" ? "success" : t.status === "IN_PROGRESS" ? "warning" : "primary"}
                        sx={{ fontWeight: 700, fontSize: "0.6875rem", height: 20 }}
                      />
                      <Chip
                        label={t.priority}
                        size="small"
                        variant="outlined"
                        color={t.priority === "CRITICAL" || t.priority === "HIGH" ? "error" : "default"}
                        sx={{ fontWeight: 700, fontSize: "0.6875rem", height: 20 }}
                      />
                    </Box>
                    <Typography variant="body2" fontWeight={700} color={tokens.colors.secondary[900]}>
                      {t.title}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Category: {t.category}
                      </Typography>
                      {t.assignedToName && (
                        <Typography variant="caption" color="primary.main" fontWeight={600}>
                          • Assigned: {t.assignedToName}
                        </Typography>
                      )}
                      {t.createdAt && (
                        <Typography variant="caption" color="text.secondary">
                          • Opened: {new Date(t.createdAt).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<ChatOutlinedIcon />}
                    onClick={() => {
                      setSelectedTicketId(t.id);
                      setTicketDetailsOpen(true);
                    }}
                    sx={{ fontWeight: 700, whiteSpace: "nowrap" }}
                  >
                    Open Live Chat
                  </Button>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Notifications Drawer */}
      <NotificationDrawer
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        onUnreadCountChange={(cnt) => setUnreadCount(cnt)}
      />

      {/* Ticket Create Drawer */}
      <TicketCreateDrawer
        open={ticketCreateOpen}
        onClose={() => {
          setTicketCreateOpen(false);
          loadPortalData();
        }}
      />

      {/* Ticket Details & Live Chat Drawer */}
      <TicketDetailsDrawer
        ticketId={selectedTicketId}
        open={ticketDetailsOpen}
        onClose={() => {
          setTicketDetailsOpen(false);
          setSelectedTicketId(null);
          loadPortalData();
        }}
      />
    </PageLayout>
  );
}
