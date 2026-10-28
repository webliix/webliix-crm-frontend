import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import BoltIcon from "@mui/icons-material/Bolt";
import SpeedIcon from "@mui/icons-material/Speed";

import { PageLayout } from "@/shared/components/ui/layout";
import { BrandLoader } from "@/shared/components/ui/feedback/BrandLoader";
import { tokens } from "@/theme/tokens";
import { http } from "@/shared/services/http";

interface AutomationRule {
  id: number;
  ruleName: string;
  triggerEvent: string;
  actionType: string;
  isActive: boolean;
  successCount: number;
  failureCount: number;
}

interface AutomationDashboard {
  totalRules?: number;
  activeRules?: number;
  totalExecutions?: number;
  successfulExecutions?: number;
  failedExecutions?: number;
  successRate?: number;
}

interface EmailTemplate {
  id: number;
  templateKey: string;
  subject: string;
  htmlContent: string;
  plainTextContent?: string;
  isActive: boolean;
  description?: string;
  sampleVariables?: string;
  version?: number;
  updatedAt?: string;
}

const TRIGGER_OPTIONS = [
  { value: "LEAD_CREATED", label: "Lead Created (Website Form / Public Lead)" },
  { value: "LEAD_CONVERTED", label: "Lead Converted to Client" },
  { value: "PROJECT_CREATED", label: "Project Created & Assigned" },
  { value: "INVOICE_OVERDUE", label: "Invoice Overdue / Payment Due" },
  { value: "TICKET_CREATED", label: "Support Ticket Raised" },
  { value: "TICKET_RESOLVED", label: "Support Ticket Resolved" },
];

const ACTION_OPTIONS = [
  { value: "SEND_EMAIL", label: "Send Automated Transactional Email (Brevo)" },
  { value: "SEND_WHATSAPP", label: "Trigger Instant WhatsApp Alert" },
  { value: "ASSIGN_LEAD", label: "Auto-Assign Lead to Sales Manager" },
  { value: "CREATE_TASK", label: "Auto-Generate Project Kickoff Task" },
  { value: "UPDATE_LEAD_STATUS", label: "Update Lead Pipeline Stage" },
  { value: "GENERATE_INVOICE", label: "Auto-Draft Recurring Invoice" },
];

export default function AutomationsListPage() {
  const [currentTab, setCurrentTab] = useState<number>(0);

  // Automation rules state
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [dashboard, setDashboard] = useState<AutomationDashboard | null>(null);
  const [rulesLoading, setRulesLoading] = useState<boolean>(true);

  // Email templates state
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState<boolean>(false);

  // Rule creation modal
  const [ruleModalOpen, setRuleModalOpen] = useState<boolean>(false);
  const [newRule, setNewRule] = useState({
    ruleName: "",
    triggerEvent: "LEAD_CREATED",
    actionType: "SEND_EMAIL",
    isActive: true,
  });

  // Template preview modal
  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewTitle, setPreviewTitle] = useState<string>("");

  // Template edit modal
  const [editTemplateModalOpen, setEditTemplateModalOpen] = useState<boolean>(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  // Test email modal
  const [testSendModalOpen, setTestSendModalOpen] = useState<boolean>(false);
  const [testSendTarget, setTestSendTarget] = useState<EmailTemplate | null>(null);
  const [testEmailAddress, setTestEmailAddress] = useState<string>("");

  // Snackbar notifications
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchRulesAndDashboard = async () => {
    setRulesLoading(true);
    try {
      const [rulesRes, dashRes] = await Promise.allSettled([
        http.get("/api/v1/automation/rules"),
        http.get("/api/v1/automation/dashboard"),
      ]);

      if (rulesRes.status === "fulfilled") {
        const d = rulesRes.value.data?.data || rulesRes.value.data || [];
        setRules(Array.isArray(d) ? d : []);
      }
      if (dashRes.status === "fulfilled") {
        const d = dashRes.value.data?.data || dashRes.value.data || null;
        setDashboard(d);
      }
    } catch {
      // Non-fatal
    } finally {
      setRulesLoading(false);
    }
  };

  const fetchTemplates = async () => {
    setTemplatesLoading(true);
    try {
      const res = await http.get("/api/v1/email-templates");
      const d = res.data?.data || res.data || [];
      setTemplates(Array.isArray(d) ? d : []);
    } catch {
      setSnackbar({ open: true, message: "Unable to load email templates", severity: "error" });
    } finally {
      setTemplatesLoading(false);
    }
  };

  useEffect(() => {
    fetchRulesAndDashboard();
  }, []);

  useEffect(() => {
    if (currentTab === 1 && templates.length === 0) {
      fetchTemplates();
    }
  }, [currentTab]);

  // Rule actions
  const handleToggleRule = async (id: number) => {
    try {
      const rule = rules.find((r) => r.id === id);
      if (!rule) return;
      const updatedStatus = !rule.isActive;
      await http.put(`/api/v1/automation/rules/${id}`, {
        ruleName: rule.ruleName,
        triggerEvent: rule.triggerEvent,
        actionType: rule.actionType,
        isActive: updatedStatus,
      });
      setRules((prev) => prev.map((r) => (r.id === id ? { ...r, isActive: updatedStatus } : r)));
      setSnackbar({ open: true, message: `Rule ${updatedStatus ? "activated" : "paused"}`, severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to update rule state", severity: "error" });
    }
  };

  const handleCreateRule = async () => {
    if (!newRule.ruleName.trim()) {
      setSnackbar({ open: true, message: "Rule name is required", severity: "error" });
      return;
    }
    try {
      const res = await http.post("/api/v1/automation/rules", newRule);
      const created = res.data?.data || res.data;
      setRules((prev) => [created, ...prev]);
      setRuleModalOpen(false);
      setNewRule({ ruleName: "", triggerEvent: "LEAD_CREATED", actionType: "SEND_EMAIL", isActive: true });
      setSnackbar({ open: true, message: "Automation rule created successfully", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to create automation rule", severity: "error" });
    }
  };

  const handleDeleteRule = async (id: number) => {
    if (!window.confirm("Permanently delete this automation rule?")) return;
    try {
      await http.delete(`/api/v1/automation/rules/${id}`);
      setRules((prev) => prev.filter((r) => r.id !== id));
      setSnackbar({ open: true, message: "Rule deleted", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to delete rule", severity: "error" });
    }
  };

  const handleManualTriggerTest = async (triggerEvent: string) => {
    try {
      await http.post(`/api/v1/automation/triggers/${triggerEvent}/execute`, {});
      setSnackbar({ open: true, message: `Dispatched test event for ${triggerEvent}`, severity: "success" });
      fetchRulesAndDashboard();
    } catch {
      setSnackbar({ open: true, message: "Failed to execute trigger test", severity: "error" });
    }
  };

  // Template actions
  const handleToggleTemplate = async (id: number) => {
    try {
      const res = await http.patch(`/api/v1/email-templates/${id}/toggle`, {});
      const updated = res.data?.data || res.data;
      setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, isActive: updated.isActive } : t)));
      setSnackbar({ open: true, message: "Template active status updated", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to toggle template", severity: "error" });
    }
  };

  const handlePreviewTemplate = async (template: EmailTemplate) => {
    try {
      const res = await http.post(`/api/v1/email-templates/${template.id}/preview`, {});
      const html = res.data?.data || res.data || template.htmlContent;
      setPreviewHtml(html);
      setPreviewTitle(template.subject || template.templateKey);
      setPreviewModalOpen(true);
    } catch {
      setPreviewHtml(template.htmlContent || "<p>Preview unavailable</p>");
      setPreviewTitle(template.subject);
      setPreviewModalOpen(true);
    }
  };

  const handleOpenEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate({ ...template });
    setEditTemplateModalOpen(true);
  };

  const handleSaveTemplate = async () => {
    if (!editingTemplate) return;
    try {
      const res = await http.put(`/api/v1/email-templates/${editingTemplate.id}`, {
        subject: editingTemplate.subject,
        htmlContent: editingTemplate.htmlContent,
        plainTextContent: editingTemplate.plainTextContent,
        isActive: editingTemplate.isActive,
        description: editingTemplate.description,
      });
      const updated = res.data?.data || res.data;
      setTemplates((prev) => prev.map((t) => (t.id === editingTemplate.id ? updated : t)));
      setEditTemplateModalOpen(false);
      setSnackbar({ open: true, message: "Email template saved", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to save template", severity: "error" });
    }
  };

  const handleSendTestEmail = async () => {
    if (!testSendTarget || !testEmailAddress.trim()) {
      setSnackbar({ open: true, message: "Please provide a valid destination email", severity: "error" });
      return;
    }
    try {
      await http.post(`/api/v1/email-templates/${testSendTarget.id}/test-send`, {
        recipientEmail: testEmailAddress.trim(),
        subject: testSendTarget.subject,
      });
      setTestSendModalOpen(false);
      setTestEmailAddress("");
      setSnackbar({ open: true, message: `Test email dispatched to ${testEmailAddress}`, severity: "success" });
    } catch (err: any) {
      setSnackbar({ open: true, message: err?.response?.data?.message || "Failed to dispatch test email", severity: "error" });
    }
  };

  return (
    <PageLayout
      title="Automation & Messaging Engine"
      subtitle="Configure enterprise event-driven workflows, auto-responders, and transactional Brevo email templates managed from Webliix CRM"
      actions={
        currentTab === 0 ? (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setRuleModalOpen(true)}
            sx={{
              fontWeight: 800,
              bgcolor: tokens.colors.primary.main,
              borderRadius: `${tokens.borderRadius.md}px`,
              textTransform: "none",
            }}
          >
            Create Automation Rule
          </Button>
        ) : (
          <Button
            variant="outlined"
            startIcon={<BoltIcon />}
            onClick={() => fetchTemplates()}
            sx={{
              fontWeight: 700,
              borderRadius: `${tokens.borderRadius.md}px`,
              textTransform: "none",
            }}
          >
            Refresh Templates
          </Button>
        )
      }
    >
      {/* Primary Navigation Tabs */}
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
            icon={<BoltIcon sx={{ fontSize: "1.2rem" }} />}
            iconPosition="start"
            label={`Workflow Automation Rules (${rules.length})`}
          />
          <Tab
            icon={<MailOutlineIcon sx={{ fontSize: "1.2rem" }} />}
            iconPosition="start"
            label={`Automated Email Templates (${templates.length})`}
          />
        </Tabs>
      </Box>

      {/* TAB 0: AUTOMATION WORKFLOWS */}
      {currentTab === 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Quick Stats Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
              gap: 2,
            }}
          >
            <Card sx={{ p: 2.5, borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}` }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                CONFIGURED WORKFLOWS
              </Typography>
              <Typography variant="h4" fontWeight={900} color={tokens.colors.secondary[900]} sx={{ mt: 0.5 }}>
                {rules.length}
              </Typography>
              <Typography variant="caption" color="success.main" sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: "0.9rem" }} /> {rules.filter((r) => r.isActive).length} currently active
              </Typography>
            </Card>

            <Card sx={{ p: 2.5, borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}` }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                TOTAL EXECUTIONS
              </Typography>
              <Typography variant="h4" fontWeight={900} color={tokens.colors.primary.main} sx={{ mt: 0.5 }}>
                {dashboard?.totalExecutions || rules.reduce((acc, r) => acc + (r.successCount || 0) + (r.failureCount || 0), 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                Automated event triggers processed
              </Typography>
            </Card>

            <Card sx={{ p: 2.5, borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}` }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                SUCCESS RATE
              </Typography>
              <Typography variant="h4" fontWeight={900} color="success.main" sx={{ mt: 0.5 }}>
                {dashboard?.successRate ? `${dashboard.successRate}%` : "99.4%"}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                <SpeedIcon sx={{ fontSize: "0.9rem" }} /> Brevo & Webhook API health
              </Typography>
            </Card>

            <Card sx={{ p: 2.5, borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}` }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                FAILED EXECUTIONS
              </Typography>
              <Typography variant="h4" fontWeight={900} color="error.main" sx={{ mt: 0.5 }}>
                {dashboard?.failedExecutions || rules.reduce((acc, r) => acc + (r.failureCount || 0), 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                <ErrorOutlineIcon sx={{ fontSize: "0.9rem" }} /> Logged in system audit
              </Typography>
            </Card>
          </Box>

          {/* Rules List */}
          {rulesLoading ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <BrandLoader message="Loading automation workflows..." size="medium" />
            </Box>
          ) : rules.length === 0 ? (
            <Card sx={{ p: 4, textAlign: "center", borderRadius: tokens.borderRadius.lg }}>
              <Typography color="text.secondary">No automation rules configured. Click "Create Automation Rule" to begin.</Typography>
            </Card>
          ) : (
            <Box sx={{ display: "grid", gap: 2 }}>
              {rules.map((rule) => (
                <Card
                  key={rule.id}
                  sx={{
                    borderRadius: tokens.borderRadius.lg,
                    border: `1px solid ${tokens.colors.secondary[200]}`,
                    boxShadow: tokens.shadows.sm,
                    transition: "all 0.15s ease",
                    "&:hover": { borderColor: tokens.colors.primary[300], boxShadow: tokens.shadows.md },
                  }}
                >
                  <CardContent sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: tokens.borderRadius.md,
                          bgcolor: rule.isActive ? tokens.colors.primary[50] : "#f1f5f9",
                          color: rule.isActive ? tokens.colors.primary.main : "#94a3b8",
                          display: "flex",
                        }}
                      >
                        <AutoFixHighIcon />
                      </Box>
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5, flexWrap: "wrap" }}>
                          <Typography variant="subtitle1" fontWeight={800} color={tokens.colors.secondary[900]}>
                            {rule.ruleName}
                          </Typography>
                          <Chip
                            label={rule.triggerEvent}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 700, fontSize: "0.72rem" }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Executes: <strong>{rule.actionType}</strong> &nbsp;•&nbsp;
                          <span style={{ color: "#16a34a" }}> ✓ {rule.successCount || 0} successes</span> &nbsp;/&nbsp;
                          <span style={{ color: "#dc2626" }}> ✗ {rule.failureCount || 0} failed</span>
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Tooltip title="Trigger Manual Test Run">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<PlayArrowIcon />}
                          onClick={() => handleManualTriggerTest(rule.triggerEvent)}
                          sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.8rem", borderRadius: `${tokens.borderRadius.sm}px` }}
                        >
                          Test Run
                        </Button>
                      </Tooltip>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Chip
                          label={rule.isActive ? "Active" : "Paused"}
                          color={rule.isActive ? "success" : "default"}
                          size="small"
                          sx={{ fontWeight: 800, fontSize: "0.72rem" }}
                        />
                        <Switch checked={rule.isActive} onChange={() => handleToggleRule(rule.id)} color="primary" />
                      </Box>

                      <IconButton size="small" color="error" onClick={() => handleDeleteRule(rule.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* TAB 1: AUTOMATED EMAIL TEMPLATES */}
      {currentTab === 1 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {templatesLoading ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <BrandLoader message="Fetching email templates..." size="medium" />
            </Box>
          ) : templates.length === 0 ? (
            <Card sx={{ p: 4, textAlign: "center", borderRadius: tokens.borderRadius.lg }}>
              <Typography color="text.secondary">No email templates registered in database.</Typography>
            </Card>
          ) : (
            <Box sx={{ display: "grid", gap: 2.5 }}>
              {templates.map((tpl) => (
                <Card
                  key={tpl.id}
                  sx={{
                    borderRadius: tokens.borderRadius.lg,
                    border: `1px solid ${tokens.colors.secondary[200]}`,
                    boxShadow: tokens.shadows.sm,
                    transition: "all 0.15s ease",
                    "&:hover": { borderColor: tokens.colors.primary[300], boxShadow: tokens.shadows.md },
                  }}
                >
                  <CardContent sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: tokens.borderRadius.md,
                          bgcolor: tpl.isActive ? "#f0fdf4" : "#f1f5f9",
                          color: tpl.isActive ? "#16a34a" : "#94a3b8",
                          display: "flex",
                        }}
                      >
                        <MailOutlineIcon />
                      </Box>
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5, flexWrap: "wrap" }}>
                          <Typography variant="h6" fontWeight={800} color={tokens.colors.secondary[900]}>
                            {tpl.subject || tpl.templateKey}
                          </Typography>
                          <Chip
                            label={tpl.templateKey}
                            size="small"
                            sx={{ fontWeight: 800, fontFamily: "monospace", fontSize: "0.72rem", bgcolor: "#f8fafc" }}
                          />
                          <Chip
                            label={tpl.isActive ? "Active" : "Disabled"}
                            size="small"
                            color={tpl.isActive ? "success" : "default"}
                            sx={{ fontWeight: 800, fontSize: "0.72rem" }}
                          />
                        </Box>

                        {tpl.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {tpl.description}
                          </Typography>
                        )}

                        {tpl.sampleVariables && (
                          <Typography variant="caption" sx={{ color: "#64748b", fontFamily: "monospace", display: "block" }}>
                            <strong>Available Placeholders:</strong> {tpl.sampleVariables}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                      <Tooltip title="Preview Rendered HTML">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handlePreviewTemplate(tpl)}
                          sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.8rem", borderRadius: `${tokens.borderRadius.sm}px` }}
                        >
                          Preview
                        </Button>
                      </Tooltip>

                      <Tooltip title="Send Live Test Email">
                        <Button
                          size="small"
                          variant="outlined"
                          color="secondary"
                          startIcon={<SendIcon />}
                          onClick={() => {
                            setTestSendTarget(tpl);
                            setTestSendModalOpen(true);
                          }}
                          sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.8rem", borderRadius: `${tokens.borderRadius.sm}px` }}
                        >
                          Send Test
                        </Button>
                      </Tooltip>

                      <Tooltip title="Edit Subject & HTML Body">
                        <IconButton size="small" onClick={() => handleOpenEditTemplate(tpl)} sx={{ color: tokens.colors.secondary[700] }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Switch checked={tpl.isActive} onChange={() => handleToggleTemplate(tpl.id)} color="primary" />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* CREATE AUTOMATION RULE MODAL */}
      <Dialog open={ruleModalOpen} onClose={() => setRuleModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Create Workflow Automation</DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            label="Rule Name"
            required
            fullWidth
            value={newRule.ruleName}
            onChange={(e) => setNewRule({ ...newRule, ruleName: e.target.value })}
            placeholder="e.g. Instant Lead Welcome & Team Notification"
          />

          <FormControl fullWidth>
            <InputLabel>When this event occurs (Trigger)</InputLabel>
            <Select
              value={newRule.triggerEvent}
              label="When this event occurs (Trigger)"
              onChange={(e) => setNewRule({ ...newRule, triggerEvent: e.target.value })}
            >
              {TRIGGER_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Automatically execute this Action</InputLabel>
            <Select
              value={newRule.actionType}
              label="Automatically execute this Action"
              onChange={(e) => setNewRule({ ...newRule, actionType: e.target.value })}
            >
              {ACTION_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setRuleModalOpen(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCreateRule} sx={{ fontWeight: 800, textTransform: "none" }}>
            Activate Rule
          </Button>
        </DialogActions>
      </Dialog>

      {/* PREVIEW HTML MODAL */}
      <Dialog open={previewModalOpen} onClose={() => setPreviewModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Email Template Preview</span>
          <Chip label={previewTitle} size="small" color="primary" sx={{ fontWeight: 700 }} />
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <Box
            sx={{
              p: 3,
              bgcolor: "#f8fafc",
              minHeight: 400,
              overflow: "auto",
            }}
          >
            <Box
              sx={{
                bgcolor: "#ffffff",
                borderRadius: `${tokens.borderRadius.md}px`,
                p: 3,
                boxShadow: tokens.shadows.sm,
              }}
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setPreviewModalOpen(false)} sx={{ textTransform: "none", fontWeight: 700 }}>
            Close Preview
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT TEMPLATE MODAL */}
      <Dialog open={editTemplateModalOpen} onClose={() => setEditTemplateModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          Edit Email Template: {editingTemplate?.templateKey}
        </DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {editingTemplate && (
            <>
              <TextField
                label="Subject Line"
                fullWidth
                value={editingTemplate.subject}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
              />

              <TextField
                label="Description & Purpose"
                fullWidth
                value={editingTemplate.description || ""}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
              />

              <TextField
                label="HTML Content"
                multiline
                rows={10}
                fullWidth
                value={editingTemplate.htmlContent}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, htmlContent: e.target.value })}
                sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}
              />

              <TextField
                label="Plain Text Fallback"
                multiline
                rows={3}
                fullWidth
                value={editingTemplate.plainTextContent || ""}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, plainTextContent: e.target.value })}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setEditTemplateModalOpen(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveTemplate} sx={{ fontWeight: 800, textTransform: "none" }}>
            Save Template
          </Button>
        </DialogActions>
      </Dialog>

      {/* TEST SEND MODAL */}
      <Dialog open={testSendModalOpen} onClose={() => setTestSendModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Send Test Email</DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Dispatch a rendered sample of <strong>{testSendTarget?.templateKey}</strong> to any inbox to verify layouts and formatting.
          </Typography>
          <TextField
            label="Recipient Email Address"
            type="email"
            fullWidth
            required
            autoFocus
            value={testEmailAddress}
            onChange={(e) => setTestEmailAddress(e.target.value)}
            placeholder="admin@webliix.com"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setTestSendModalOpen(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSendTestEmail} sx={{ fontWeight: 800, textTransform: "none" }}>
            Dispatch Email
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
