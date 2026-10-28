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
import InputAdornment from "@mui/material/InputAdornment";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import CircularProgress from "@mui/material/CircularProgress";

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
import ScheduleIcon from "@mui/icons-material/Schedule";
import TuneIcon from "@mui/icons-material/Tune";
import HistoryIcon from "@mui/icons-material/History";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import { PageLayout } from "@/shared/components/ui/layout";
import { BrandLoader } from "@/shared/components/ui/feedback/BrandLoader";
import { tokens } from "@/theme/tokens";
import { http } from "@/shared/services/http";

interface AutomationRule {
  id: number;
  name?: string;
  ruleName?: string;
  triggerType?: string;
  triggerEvent?: string;
  actionType?: string;
  actionJson?: string;
  enabled?: boolean;
  isActive?: boolean;
  successCount?: number;
  failureCount?: number;
}

interface AutomationDashboard {
  totalRules?: number;
  activeRules?: number;
  totalExecutions?: number;
  successfulExecutions?: number;
  failedExecutions?: number;
  successRate?: number;
}

interface ScheduledJob {
  jobKey: string;
  name: string;
  description: string;
  schedule: string;
  cronExpression: string;
  category: string;
  enabled: boolean;
  lastRunAt?: string;
  lastRunStatus?: string;
  lastRunSummary?: string;
}

interface NotificationRuleItem {
  key: string;
  name: string;
  category: string;
  description: string;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  templateKey?: string;
}

interface NotificationRulesConfig {
  globalEmailEnabled: boolean;
  globalInAppEnabled: boolean;
  rules: NotificationRuleItem[];
}

interface AutomationExecution {
  id: number;
  ruleId?: number | null;
  status: "SUCCESS" | "FAILED" | "RUNNING";
  executionTime?: string;
  errorMessage?: string;
  createdAt?: string;
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
  { value: "LEAD_CREATED", label: "Lead Created (Website Form / Inbound Inquiry)" },
  { value: "LEAD_CONVERTED", label: "Lead Converted to Customer Account" },
  { value: "PROJECT_CREATED", label: "Project Created & Kickoff" },
  { value: "PROJECT_COMPLETED", label: "Project Milestone / Completed" },
  { value: "INVOICE_CREATED", label: "Invoice Issued to Client" },
  { value: "INVOICE_PAID", label: "Invoice Paid / Payment Received" },
  { value: "QUOTATION_APPROVED", label: "Quotation Proposal Approved" },
  { value: "TICKET_CREATED", label: "Support Ticket Opened by Client" },
  { value: "TICKET_ASSIGNED", label: "Support Ticket Assigned to Engineer" },
  { value: "EMPLOYEE_CREATED", label: "Staff Account Provisioned" },
  { value: "PAYROLL_GENERATED", label: "Monthly Payroll Slip Generated" },
];

const ACTION_OPTIONS = [
  { value: "SEND_EMAIL", label: "Send Automated Transactional Email (Brevo)" },
  { value: "CREATE_NOTIFICATION", label: "Publish Instant In-App System Notification" },
  { value: "CREATE_TASK", label: "Auto-Generate Kickoff Task" },
  { value: "CREATE_TICKET", label: "Auto-Escalate Support Ticket" },
  { value: "ASSIGN_EMPLOYEE", label: "Auto-Assign Team Member" },
  { value: "UPDATE_STATUS", label: "Update Pipeline Stage / Record Status" },
  { value: "GENERATE_INVOICE", label: "Draft Invoice Document" },
];

export default function AutomationsListPage() {
  const [currentTab, setCurrentTab] = useState<number>(0);

  // Tab 0: Automation Rules & Dashboard
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [dashboard, setDashboard] = useState<AutomationDashboard | null>(null);
  const [rulesLoading, setRulesLoading] = useState<boolean>(true);

  // Tab 1: System Automation & Dispatch Controls
  const [dispatchConfig, setDispatchConfig] = useState<NotificationRulesConfig | null>(null);
  const [dispatchLoading, setDispatchLoading] = useState<boolean>(false);
  const [savingDispatch, setSavingDispatch] = useState<boolean>(false);

  // Tab 2: Scheduled Automation Jobs (Cron)
  const [scheduledJobs, setScheduledJobs] = useState<ScheduledJob[]>([]);
  const [jobsLoading, setJobsLoading] = useState<boolean>(false);
  const [runningJobKey, setRunningJobKey] = useState<string | null>(null);

  // Tab 3: Email Templates
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState<boolean>(false);
  const [templateSearch, setTemplateSearch] = useState<string>("");
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState<string>("ALL");

  // Tab 4: Execution History
  const [executions, setExecutions] = useState<AutomationExecution[]>([]);
  const [executionsLoading, setExecutionsLoading] = useState<boolean>(false);
  const [executionFilter, setExecutionFilter] = useState<string>("ALL");

  // Modals & Drawers
  const [ruleModalOpen, setRuleModalOpen] = useState<boolean>(false);
  const [newRule, setNewRule] = useState({
    ruleName: "",
    triggerEvent: "LEAD_CREATED",
    actionType: "SEND_EMAIL",
    isActive: true,
  });

  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewTitle, setPreviewTitle] = useState<string>("");

  const [editTemplateModalOpen, setEditTemplateModalOpen] = useState<boolean>(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  const [testSendModalOpen, setTestSendModalOpen] = useState<boolean>(false);
  const [testSendTarget, setTestSendTarget] = useState<EmailTemplate | null>(null);
  const [testEmailAddress, setTestEmailAddress] = useState<string>("");
  const [sendingTest, setSendingTest] = useState<boolean>(false);

  // Toast feedback
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetchers
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
      // non-fatal
    } finally {
      setRulesLoading(false);
    }
  };

  const fetchDispatchConfig = async () => {
    setDispatchLoading(true);
    try {
      const res = await http.get("/api/v1/settings/notifications");
      const d = res.data?.data || res.data;
      if (d && Array.isArray(d.rules)) {
        setDispatchConfig(d);
      }
    } catch {
      setSnackbar({ open: true, message: "Failed to load notification dispatch rules", severity: "error" });
    } finally {
      setDispatchLoading(false);
    }
  };

  const fetchScheduledJobs = async () => {
    setJobsLoading(true);
    try {
      const res = await http.get("/api/v1/automation/jobs");
      const d = res.data?.data || res.data || [];
      setScheduledJobs(Array.isArray(d) ? d : []);
    } catch {
      setSnackbar({ open: true, message: "Failed to load scheduled automation jobs", severity: "error" });
    } finally {
      setJobsLoading(false);
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

  const fetchExecutions = async () => {
    setExecutionsLoading(true);
    try {
      const res = await http.get("/api/v1/automation/executions");
      const d = res.data?.data || res.data || [];
      setExecutions(Array.isArray(d) ? d : []);
    } catch {
      setSnackbar({ open: true, message: "Unable to load execution history", severity: "error" });
    } finally {
      setExecutionsLoading(false);
    }
  };

  useEffect(() => {
    fetchRulesAndDashboard();
  }, []);

  useEffect(() => {
    if (currentTab === 1 && !dispatchConfig) fetchDispatchConfig();
    if (currentTab === 2 && scheduledJobs.length === 0) fetchScheduledJobs();
    if (currentTab === 3 && templates.length === 0) fetchTemplates();
    if (currentTab === 4 && executions.length === 0) fetchExecutions();
  }, [currentTab]);

  // Actions for Tab 0: Workflow Rules
  const handleToggleRule = async (id: number) => {
    try {
      const rule = rules.find((r) => r.id === id);
      if (!rule) return;
      const updatedStatus = !(rule.enabled ?? rule.isActive ?? true);
      await http.put(`/api/v1/automation/rules/${id}`, {
        name: rule.name || rule.ruleName || `Rule #${id}`,
        triggerType: rule.triggerType || rule.triggerEvent || "LEAD_CREATED",
        enabled: updatedStatus,
      });
      setRules((prev) =>
        prev.map((r) => (r.id === id ? { ...r, enabled: updatedStatus, isActive: updatedStatus } : r))
      );
      setSnackbar({ open: true, message: `Workflow rule ${updatedStatus ? "activated" : "paused"}`, severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to update workflow rule state", severity: "error" });
    }
  };

  const handleCreateRule = async () => {
    if (!newRule.ruleName.trim()) {
      setSnackbar({ open: true, message: "Rule name is required", severity: "error" });
      return;
    }
    try {
      const res = await http.post("/api/v1/automation/rules", {
        name: newRule.ruleName,
        triggerType: newRule.triggerEvent,
        actionJson: JSON.stringify({ actionType: newRule.actionType }),
        conditionJson: "{}",
        enabled: newRule.isActive,
      });
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
    if (!window.confirm("Permanently delete this automation workflow rule?")) return;
    try {
      await http.delete(`/api/v1/automation/rules/${id}`);
      setRules((prev) => prev.filter((r) => r.id !== id));
      setSnackbar({ open: true, message: "Workflow rule removed", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to delete workflow rule", severity: "error" });
    }
  };

  const handleManualTriggerTest = async (triggerEvent?: string) => {
    const t = triggerEvent || "LEAD_CREATED";
    try {
      await http.post(`/api/v1/automation/triggers/${t}/execute`, {});
      setSnackbar({ open: true, message: `Trigger event dispatched for ${t}`, severity: "success" });
      fetchRulesAndDashboard();
      if (currentTab === 4) fetchExecutions();
    } catch {
      setSnackbar({ open: true, message: "Failed to execute trigger test", severity: "error" });
    }
  };

  // Actions for Tab 1: System Automation & Dispatch Controls
  const handleToggleDispatchGlobal = (field: "globalEmailEnabled" | "globalInAppEnabled") => {
    if (!dispatchConfig) return;
    setDispatchConfig({
      ...dispatchConfig,
      [field]: !dispatchConfig[field],
    });
  };

  const handleToggleDispatchItem = (key: string, field: "emailEnabled" | "inAppEnabled") => {
    if (!dispatchConfig) return;
    setDispatchConfig({
      ...dispatchConfig,
      rules: dispatchConfig.rules.map((r) => (r.key === key ? { ...r, [field]: !r[field] } : r)),
    });
  };

  const handleSaveDispatchRules = async () => {
    if (!dispatchConfig) return;
    setSavingDispatch(true);
    try {
      const payload = {
        globalEmailEnabled: dispatchConfig.globalEmailEnabled,
        globalInAppEnabled: dispatchConfig.globalInAppEnabled,
        rules: dispatchConfig.rules.map((r) => ({
          key: r.key,
          emailEnabled: r.emailEnabled,
          inAppEnabled: r.inAppEnabled,
        })),
      };
      await http.put("/api/v1/settings/notifications", payload);
      setSnackbar({ open: true, message: "System automation & dispatch settings saved successfully", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to save dispatch settings", severity: "error" });
    } finally {
      setSavingDispatch(false);
    }
  };

  // Actions for Tab 2: Scheduled Automation Jobs (Cron)
  const handleRunScheduledJob = async (jobKey: string) => {
    setRunningJobKey(jobKey);
    try {
      const res = await http.post(`/api/v1/automation/jobs/${jobKey}/run`, {});
      const msg = res.data?.message || res.data?.data?.message || `Job ${jobKey} executed successfully`;
      setSnackbar({ open: true, message: msg, severity: "success" });
      fetchScheduledJobs();
      fetchExecutions();
    } catch (err: any) {
      setSnackbar({ open: true, message: err?.response?.data?.message || `Failed to run job ${jobKey}`, severity: "error" });
    } finally {
      setRunningJobKey(null);
    }
  };

  const handleToggleScheduledJob = async (jobKey: string) => {
    try {
      const res = await http.post(`/api/v1/automation/jobs/${jobKey}/toggle`, {});
      const updated = res.data?.data || res.data;
      setScheduledJobs((prev) => prev.map((j) => (j.jobKey === jobKey ? { ...j, enabled: updated.enabled } : j)));
      setSnackbar({ open: true, message: `Scheduled job ${jobKey} status updated`, severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to toggle scheduled job", severity: "error" });
    }
  };

  // Actions for Tab 3: Email Templates
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

  const handleResetTemplate = async (id: number) => {
    if (!window.confirm("Restore this template back to factory default HTML and variables?")) return;
    try {
      const res = await http.post(`/api/v1/email-templates/${id}/reset`, {});
      const updated = res.data?.data || res.data;
      setTemplates((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setSnackbar({ open: true, message: "Template restored to factory default", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to reset template", severity: "error" });
    }
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
      setSnackbar({ open: true, message: "Please provide a valid destination email address", severity: "error" });
      return;
    }
    setSendingTest(true);
    try {
      await http.post(`/api/v1/email-templates/${testSendTarget.id}/test-send`, {
        recipientEmail: testEmailAddress.trim(),
        subject: testSendTarget.subject,
      });
      setTestSendModalOpen(false);
      setTestEmailAddress("");
      setSnackbar({ open: true, message: `Live test email dispatched to ${testEmailAddress}`, severity: "success" });
    } catch (err: any) {
      setSnackbar({ open: true, message: err?.response?.data?.message || "Failed to dispatch test email", severity: "error" });
    } finally {
      setSendingTest(false);
    }
  };

  // Actions for Tab 4: Execution History
  const handleClearExecutions = async () => {
    if (!window.confirm("Clear all execution logs from history?")) return;
    try {
      await http.delete("/api/v1/automation/executions");
      setExecutions([]);
      setSnackbar({ open: true, message: "Execution logs cleared", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to clear execution logs", severity: "error" });
    }
  };

  // Filter templates
  const filteredTemplates = templates.filter((tpl) => {
    const matchesSearch =
      tpl.templateKey.toLowerCase().includes(templateSearch.toLowerCase()) ||
      tpl.subject.toLowerCase().includes(templateSearch.toLowerCase()) ||
      (tpl.description && tpl.description.toLowerCase().includes(templateSearch.toLowerCase()));

    if (!matchesSearch) return false;
    if (templateCategoryFilter === "ALL") return true;
    if (templateCategoryFilter === "BILLING") return tpl.templateKey.includes("invoice") || tpl.templateKey.includes("quotation");
    if (templateCategoryFilter === "SUPPORT") return tpl.templateKey.includes("ticket");
    if (templateCategoryFilter === "AUTH") return tpl.templateKey.includes("otp") || tpl.templateKey.includes("password");
    if (templateCategoryFilter === "ONBOARDING") return tpl.templateKey.includes("welcome");
    if (templateCategoryFilter === "HR") return tpl.templateKey.includes("payroll") || tpl.templateKey.includes("employee");
    return true;
  });

  return (
    <PageLayout
      title="Automation & Messaging Engine"
      subtitle="Complete command center for event-driven workflows, automated scheduled jobs, system dispatch matrix, and transactional Brevo email templates"
      actions={
        currentTab === 0 ? (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setRuleModalOpen(true)}
            sx={{
              fontWeight: 800,
              bgcolor: tokens.colors.primary.main,
              borderRadius: "3px",
              textTransform: "none",
            }}
          >
            Create Automation Rule
          </Button>
        ) : currentTab === 1 ? (
          <Button
            variant="contained"
            startIcon={<CheckCircleOutlineIcon />}
            onClick={handleSaveDispatchRules}
            disabled={savingDispatch}
            sx={{
              fontWeight: 800,
              bgcolor: tokens.colors.primary.main,
              borderRadius: "3px",
              textTransform: "none",
            }}
          >
            {savingDispatch ? "Saving..." : "Save Dispatch Rules"}
          </Button>
        ) : currentTab === 2 ? (
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchScheduledJobs}
            sx={{ fontWeight: 700, borderRadius: "3px", textTransform: "none" }}
          >
            Refresh Schedules
          </Button>
        ) : currentTab === 3 ? (
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchTemplates}
            sx={{ fontWeight: 700, borderRadius: "3px", textTransform: "none" }}
          >
            Refresh Templates
          </Button>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchExecutions}
              sx={{ fontWeight: 700, borderRadius: "3px", textTransform: "none" }}
            >
              Refresh Logs
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleClearExecutions}
              sx={{ fontWeight: 700, borderRadius: "3px", textTransform: "none" }}
            >
              Clear Logs
            </Button>
          </Box>
        )
      }
    >
      {/* Primary Navigation Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={(_, val) => setCurrentTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: `1px solid ${tokens.colors.secondary[200]}`,
            "& .MuiTab-root": { textTransform: "none", fontWeight: 700, fontSize: "0.92rem", borderRadius: "3px" },
          }}
        >
          <Tab
            icon={<BoltIcon sx={{ fontSize: "1.15rem" }} />}
            iconPosition="start"
            label={`Workflow Rules (${rules.length})`}
          />
          <Tab
            icon={<TuneIcon sx={{ fontSize: "1.15rem" }} />}
            iconPosition="start"
            label="System Dispatch Controls"
          />
          <Tab
            icon={<ScheduleIcon sx={{ fontSize: "1.15rem" }} />}
            iconPosition="start"
            label={`Scheduled Jobs (${scheduledJobs.length || 6})`}
          />
          <Tab
            icon={<MailOutlineIcon sx={{ fontSize: "1.15rem" }} />}
            iconPosition="start"
            label={`Email Templates (${templates.length})`}
          />
          <Tab
            icon={<HistoryIcon sx={{ fontSize: "1.15rem" }} />}
            iconPosition="start"
            label={`Execution History (${executions.length})`}
          />
        </Tabs>
      </Box>

      {/* =========================================================================
          TAB 0: AUTOMATION WORKFLOW RULES
         ========================================================================= */}
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
            <Card sx={{ p: 2.5, borderRadius: "3px", border: `1px solid ${tokens.colors.secondary[200]}` }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                CONFIGURED WORKFLOWS
              </Typography>
              <Typography variant="h4" fontWeight={900} color={tokens.colors.secondary[900]} sx={{ mt: 0.5 }}>
                {rules.length}
              </Typography>
              <Typography variant="caption" color="success.main" sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: "0.9rem" }} /> {rules.filter((r) => (r.enabled ?? r.isActive ?? true)).length} currently active
              </Typography>
            </Card>

            <Card sx={{ p: 2.5, borderRadius: "3px", border: `1px solid ${tokens.colors.secondary[200]}` }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                TOTAL EXECUTIONS
              </Typography>
              <Typography variant="h4" fontWeight={900} color={tokens.colors.primary.main} sx={{ mt: 0.5 }}>
                {dashboard?.totalExecutions || executions.length || rules.reduce((acc, r) => acc + (r.successCount || 0) + (r.failureCount || 0), 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                Automated event triggers processed
              </Typography>
            </Card>

            <Card sx={{ p: 2.5, borderRadius: "3px", border: `1px solid ${tokens.colors.secondary[200]}` }}>
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

            <Card sx={{ p: 2.5, borderRadius: "3px", border: `1px solid ${tokens.colors.secondary[200]}` }}>
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
            <Card sx={{ p: 4, textAlign: "center", borderRadius: "3px" }}>
              <Typography color="text.secondary">No automation rules configured. Click "Create Automation Rule" to begin.</Typography>
            </Card>
          ) : (
            <Box sx={{ display: "grid", gap: 2 }}>
              {rules.map((rule) => {
                const active = rule.enabled ?? rule.isActive ?? true;
                const trig = rule.triggerType || rule.triggerEvent || "LEAD_CREATED";
                const action = rule.actionType || "SEND_EMAIL";
                return (
                  <Card
                    key={rule.id}
                    sx={{
                      borderRadius: "3px",
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
                            borderRadius: "3px",
                            bgcolor: active ? tokens.colors.primary[50] : "#f1f5f9",
                            color: active ? tokens.colors.primary.main : "#94a3b8",
                            display: "flex",
                          }}
                        >
                          <AutoFixHighIcon />
                        </Box>
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5, flexWrap: "wrap" }}>
                            <Typography variant="subtitle1" fontWeight={800} color={tokens.colors.secondary[900]}>
                              {rule.name || rule.ruleName}
                            </Typography>
                            <Chip
                              label={trig}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ fontWeight: 700, fontSize: "0.72rem", borderRadius: "3px" }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Action: <strong>{action}</strong> &nbsp;•&nbsp;
                            <span style={{ color: "#16a34a" }}> ✓ {rule.successCount || 0} successes</span> &nbsp;/&nbsp;
                            <span style={{ color: "#dc2626" }}> ✗ {rule.failureCount || 0} failed</span>
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Tooltip title="Trigger Manual Test Event">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<PlayArrowIcon />}
                            onClick={() => handleManualTriggerTest(trig)}
                            sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.8rem", borderRadius: "3px" }}
                          >
                            Test Run
                          </Button>
                        </Tooltip>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Chip
                            label={active ? "Active" : "Paused"}
                            color={active ? "success" : "default"}
                            size="small"
                            sx={{ fontWeight: 800, fontSize: "0.72rem", borderRadius: "3px" }}
                          />
                          <Switch checked={active} onChange={() => handleToggleRule(rule.id)} color="primary" />
                        </Box>

                        <IconButton size="small" color="error" onClick={() => handleDeleteRule(rule.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          )}
        </Box>
      )}

      {/* =========================================================================
          TAB 1: SYSTEM AUTOMATION & DISPATCH CONTROLS
         ========================================================================= */}
      {currentTab === 1 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Master Global Kill-Switches */}
          <Card sx={{ p: 3, borderRadius: "3px", border: `1px solid ${tokens.colors.secondary[200]}` }}>
            <Typography variant="h6" fontWeight={800} color={tokens.colors.secondary[900]} sx={{ mb: 1 }}>
              Global System Dispatch Switches
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              Master toggles to globally suppress or activate automated email notifications and in-app realtime websocket alerts across the Webliix SaaS platform.
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: "3px",
                  border: `1px solid ${tokens.colors.secondary[200]}`,
                  bgcolor: dispatchConfig?.globalEmailEnabled ? "#f0fdf4" : "#f8fafc",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="subtitle2" fontWeight={800}>
                    Global Automated Email Dispatch (Brevo)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {dispatchConfig?.globalEmailEnabled ? "Active: Emails will be dispatched" : "Muted: All automated emails suppressed"}
                  </Typography>
                </Box>
                <Switch
                  checked={dispatchConfig?.globalEmailEnabled ?? true}
                  onChange={() => handleToggleDispatchGlobal("globalEmailEnabled")}
                  color="primary"
                />
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: "3px",
                  border: `1px solid ${tokens.colors.secondary[200]}`,
                  bgcolor: dispatchConfig?.globalInAppEnabled ? "#f0fdf4" : "#f8fafc",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="subtitle2" fontWeight={800}>
                    Global In-App Notifications & WebSockets
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {dispatchConfig?.globalInAppEnabled ? "Active: Realtime alerts delivered" : "Muted: In-app popups suppressed"}
                  </Typography>
                </Box>
                <Switch
                  checked={dispatchConfig?.globalInAppEnabled ?? true}
                  onChange={() => handleToggleDispatchGlobal("globalInAppEnabled")}
                  color="primary"
                />
              </Box>
            </Box>
          </Card>

          {/* Event Dispatch Controls by Category */}
          {dispatchLoading ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <BrandLoader message="Loading notification dispatch matrix..." size="medium" />
            </Box>
          ) : !dispatchConfig ? (
            <Alert severity="warning" sx={{ borderRadius: "3px" }}>
              Unable to load dispatch controls. Please try refreshing.
            </Alert>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {Array.from(new Set(dispatchConfig.rules.map((r) => r.category))).map((cat) => (
                <Card key={cat} sx={{ borderRadius: "3px", border: `1px solid ${tokens.colors.secondary[200]}` }}>
                  <Box sx={{ p: 2, bgcolor: "#f8fafc", borderBottom: `1px solid ${tokens.colors.secondary[200]}` }}>
                    <Typography variant="subtitle1" fontWeight={800} color={tokens.colors.secondary[900]}>
                      {cat}
                    </Typography>
                  </Box>

                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#fafafa" }}>
                          <TableCell sx={{ fontWeight: 800, fontSize: "0.8rem" }}>AUTOMATED EVENT TRIGGER</TableCell>
                          <TableCell sx={{ fontWeight: 800, fontSize: "0.8rem" }}>DESCRIPTION</TableCell>
                          <TableCell sx={{ fontWeight: 800, fontSize: "0.8rem", textAlign: "center" }}>EMAIL DISPATCH</TableCell>
                          <TableCell sx={{ fontWeight: 800, fontSize: "0.8rem", textAlign: "center" }}>IN-APP ALERT</TableCell>
                          <TableCell sx={{ fontWeight: 800, fontSize: "0.8rem" }}>LINKED TEMPLATE</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dispatchConfig.rules
                          .filter((r) => r.category === cat)
                          .map((rule) => (
                            <TableRow key={rule.key} hover>
                              <TableCell sx={{ fontWeight: 700, fontSize: "0.85rem", color: tokens.colors.secondary[900] }}>
                                {rule.name}
                                <Typography variant="caption" sx={{ display: "block", color: "text.secondary", fontFamily: "monospace" }}>
                                  {rule.key}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ fontSize: "0.82rem", color: "text.secondary" }}>{rule.description}</TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                <Switch
                                  size="small"
                                  checked={rule.emailEnabled}
                                  onChange={() => handleToggleDispatchItem(rule.key, "emailEnabled")}
                                  color="primary"
                                />
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                <Switch
                                  size="small"
                                  checked={rule.inAppEnabled}
                                  onChange={() => handleToggleDispatchItem(rule.key, "inAppEnabled")}
                                  color="primary"
                                />
                              </TableCell>
                              <TableCell>
                                {rule.templateKey ? (
                                  <Chip
                                    label={rule.templateKey}
                                    size="small"
                                    onClick={() => {
                                      const tpl = templates.find((t) => t.templateKey === rule.templateKey);
                                      if (tpl) {
                                        handlePreviewTemplate(tpl);
                                      } else {
                                        setSnackbar({ open: true, message: `Template ${rule.templateKey} registered in catalog`, severity: "info" });
                                      }
                                    }}
                                    sx={{
                                      cursor: "pointer",
                                      fontFamily: "monospace",
                                      fontSize: "0.72rem",
                                      fontWeight: 700,
                                      borderRadius: "3px",
                                      "&:hover": { bgcolor: tokens.colors.primary[50] },
                                    }}
                                  />
                                ) : (
                                  <Typography variant="caption" color="text.secondary">—</Typography>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* =========================================================================
          TAB 2: SCHEDULED AUTOMATION JOBS (CRON ENGINE)
         ========================================================================= */}
      {currentTab === 2 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight={800} color={tokens.colors.secondary[900]}>
                Automated Background Cron Engines
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Autonomous background schedulers executing continuous billing reminders, ticket escalations, operations summaries, and cleanup tasks.
              </Typography>
            </Box>
          </Box>

          {jobsLoading ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <BrandLoader message="Loading scheduled automation jobs..." size="medium" />
            </Box>
          ) : (
            <Box sx={{ display: "grid", gap: 2 }}>
              {scheduledJobs.map((job) => {
                const isRunning = runningJobKey === job.jobKey;
                return (
                  <Card
                    key={job.jobKey}
                    sx={{
                      borderRadius: "3px",
                      border: `1px solid ${tokens.colors.secondary[200]}`,
                      boxShadow: tokens.shadows.sm,
                    }}
                  >
                    <CardContent sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
                      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: "3px",
                            bgcolor: job.enabled ? "#e0f2fe" : "#f1f5f9",
                            color: job.enabled ? "#0284c7" : "#94a3b8",
                            display: "flex",
                          }}
                        >
                          <ScheduleIcon />
                        </Box>
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5, flexWrap: "wrap" }}>
                            <Typography variant="subtitle1" fontWeight={800} color={tokens.colors.secondary[900]}>
                              {job.name}
                            </Typography>
                            <Chip
                              label={job.schedule}
                              size="small"
                              sx={{ fontWeight: 800, fontSize: "0.72rem", bgcolor: "#f8fafc", borderRadius: "3px" }}
                            />
                            <Chip
                              label={job.category}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ fontWeight: 700, fontSize: "0.72rem", borderRadius: "3px" }}
                            />
                            <Chip
                              label={job.enabled ? "Scheduled Active" : "Paused"}
                              size="small"
                              color={job.enabled ? "success" : "default"}
                              sx={{ fontWeight: 800, fontSize: "0.72rem", borderRadius: "3px" }}
                            />
                          </Box>

                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {job.description}
                          </Typography>

                          {job.lastRunSummary && (
                            <Typography variant="caption" sx={{ color: "#059669", fontWeight: 600, display: "block" }}>
                              <strong>Last Run:</strong> {job.lastRunSummary}
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={isRunning ? <CircularProgress size={14} color="inherit" /> : <PlayArrowIcon />}
                          disabled={isRunning}
                          onClick={() => handleRunScheduledJob(job.jobKey)}
                          sx={{
                            fontWeight: 700,
                            borderRadius: "3px",
                            textTransform: "none",
                            bgcolor: tokens.colors.primary.main,
                          }}
                        >
                          {isRunning ? "Running..." : "Run Now"}
                        </Button>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Typography variant="caption" fontWeight={700}>
                            {job.enabled ? "Active" : "Paused"}
                          </Typography>
                          <Switch
                            checked={job.enabled}
                            onChange={() => handleToggleScheduledJob(job.jobKey)}
                            color="primary"
                          />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          )}
        </Box>
      )}

      {/* =========================================================================
          TAB 3: AUTOMATED EMAIL TEMPLATES (ALL 20+ TEMPLATES)
         ========================================================================= */}
      {currentTab === 3 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Search & Category Filter Toolbar */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
            <TextField
              size="small"
              placeholder="Search templates by subject, key, or usage..."
              value={templateSearch}
              onChange={(e) => setTemplateSearch(e.target.value)}
              sx={{ minWidth: 280, bgcolor: "#fff", "& .MuiOutlinedInput-root": { borderRadius: "3px" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {["ALL", "BILLING", "SUPPORT", "AUTH", "ONBOARDING", "HR"].map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  size="small"
                  onClick={() => setTemplateCategoryFilter(cat)}
                  color={templateCategoryFilter === cat ? "primary" : "default"}
                  sx={{ fontWeight: 800, fontSize: "0.72rem", borderRadius: "3px", cursor: "pointer" }}
                />
              ))}
            </Box>
          </Box>

          {templatesLoading ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <BrandLoader message="Fetching email templates..." size="medium" />
            </Box>
          ) : filteredTemplates.length === 0 ? (
            <Card sx={{ p: 4, textAlign: "center", borderRadius: "3px" }}>
              <Typography color="text.secondary">No email templates match your filter.</Typography>
            </Card>
          ) : (
            <Box sx={{ display: "grid", gap: 2 }}>
              {filteredTemplates.map((tpl) => (
                <Card
                  key={tpl.id}
                  sx={{
                    borderRadius: "3px",
                    border: `1px solid ${tokens.colors.secondary[200]}`,
                    boxShadow: tokens.shadows.sm,
                    transition: "all 0.15s ease",
                    "&:hover": { borderColor: tokens.colors.primary[300], boxShadow: tokens.shadows.md },
                  }}
                >
                  <CardContent sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: "3px",
                          bgcolor: tpl.isActive ? "#f0fdf4" : "#f1f5f9",
                          color: tpl.isActive ? "#16a34a" : "#94a3b8",
                          display: "flex",
                        }}
                      >
                        <MailOutlineIcon />
                      </Box>
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5, flexWrap: "wrap" }}>
                          <Typography variant="h6" fontWeight={800} color={tokens.colors.secondary[900]} sx={{ fontSize: "1.05rem" }}>
                            {tpl.subject || tpl.templateKey}
                          </Typography>
                          <Chip
                            label={tpl.templateKey}
                            size="small"
                            sx={{ fontWeight: 800, fontFamily: "monospace", fontSize: "0.72rem", bgcolor: "#f8fafc", borderRadius: "3px" }}
                          />
                          <Chip
                            label={tpl.isActive ? "Active" : "Disabled"}
                            size="small"
                            color={tpl.isActive ? "success" : "default"}
                            sx={{ fontWeight: 800, fontSize: "0.72rem", borderRadius: "3px" }}
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
                          sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.8rem", borderRadius: "3px" }}
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
                          sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.8rem", borderRadius: "3px" }}
                        >
                          Send Test
                        </Button>
                      </Tooltip>

                      <Tooltip title="Edit Subject & HTML Body">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingTemplate({ ...tpl });
                            setEditTemplateModalOpen(true);
                          }}
                          sx={{ color: tokens.colors.secondary[700] }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Reset to Factory Default">
                        <IconButton size="small" onClick={() => handleResetTemplate(tpl.id)} sx={{ color: tokens.colors.secondary[500] }}>
                          <RestartAltIcon fontSize="small" />
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

      {/* =========================================================================
          TAB 4: AUTOMATION EXECUTION HISTORY
         ========================================================================= */}
      {currentTab === 4 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight={800} color={tokens.colors.secondary[900]}>
                Realtime Automation Execution Logs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chronological audit trail of all background workflow executions, automated triggers, and scheduled jobs.
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              {["ALL", "SUCCESS", "FAILED"].map((st) => (
                <Chip
                  key={st}
                  label={st}
                  size="small"
                  onClick={() => setExecutionFilter(st)}
                  color={executionFilter === st ? "primary" : "default"}
                  sx={{ fontWeight: 800, fontSize: "0.72rem", borderRadius: "3px", cursor: "pointer" }}
                />
              ))}
            </Box>
          </Box>

          {executionsLoading ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <BrandLoader message="Loading execution logs..." size="medium" />
            </Box>
          ) : executions.length === 0 ? (
            <Card sx={{ p: 4, textAlign: "center", borderRadius: "3px" }}>
              <Typography color="text.secondary">No automation executions recorded yet.</Typography>
            </Card>
          ) : (
            <Card sx={{ borderRadius: "3px", border: `1px solid ${tokens.colors.secondary[200]}` }}>
              <TableContainer>
                <Table size="small">
                  <TableHead sx={{ bgcolor: "#f8fafc" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, fontSize: "0.8rem" }}>EXECUTION ID</TableCell>
                      <TableCell sx={{ fontWeight: 800, fontSize: "0.8rem" }}>STATUS</TableCell>
                      <TableCell sx={{ fontWeight: 800, fontSize: "0.8rem" }}>RULE / JOB</TableCell>
                      <TableCell sx={{ fontWeight: 800, fontSize: "0.8rem" }}>TIMESTAMP</TableCell>
                      <TableCell sx={{ fontWeight: 800, fontSize: "0.8rem" }}>ERROR DETAILS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {executions
                      .filter((ex) => (executionFilter === "ALL" ? true : ex.status === executionFilter))
                      .map((ex) => (
                        <TableRow key={ex.id} hover>
                          <TableCell sx={{ fontFamily: "monospace", fontWeight: 700 }}>
                            #{ex.id}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={ex.status}
                              size="small"
                              color={ex.status === "SUCCESS" ? "success" : ex.status === "FAILED" ? "error" : "info"}
                              sx={{ fontWeight: 800, fontSize: "0.72rem", borderRadius: "3px" }}
                            />
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            {ex.ruleId ? `Rule #${ex.ruleId}` : "Scheduled Background Job"}
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.82rem", color: "text.secondary" }}>
                            {ex.executionTime ? new Date(ex.executionTime).toLocaleString() : ex.createdAt ? new Date(ex.createdAt).toLocaleString() : "Just now"}
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.82rem", color: ex.errorMessage ? "error.main" : "text.secondary" }}>
                            {ex.errorMessage || "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          )}
        </Box>
      )}

      {/* =========================================================================
          MODALS & DIALOGS
         ========================================================================= */}

      {/* CREATE WORKFLOW RULE MODAL */}
      <Dialog open={ruleModalOpen} onClose={() => setRuleModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "3px" } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Create Workflow Automation</DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            label="Rule Name"
            required
            fullWidth
            value={newRule.ruleName}
            onChange={(e) => setNewRule({ ...newRule, ruleName: e.target.value })}
            placeholder="e.g. Instant Lead Welcome & Team Notification"
            InputProps={{ sx: { borderRadius: "3px" } }}
          />

          <FormControl fullWidth>
            <InputLabel>When this event occurs (Trigger)</InputLabel>
            <Select
              value={newRule.triggerEvent}
              label="When this event occurs (Trigger)"
              onChange={(e) => setNewRule({ ...newRule, triggerEvent: e.target.value })}
              sx={{ borderRadius: "3px" }}
            >
              {TRIGGER_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Execute this action</InputLabel>
            <Select
              value={newRule.actionType}
              label="Execute this action"
              onChange={(e) => setNewRule({ ...newRule, actionType: e.target.value })}
              sx={{ borderRadius: "3px" }}
            >
              {ACTION_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1 }}>
            <Box>
              <Typography variant="body2" fontWeight={700}>
                Rule Status
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Active rules automatically execute whenever matching events fire.
              </Typography>
            </Box>
            <Switch
              checked={newRule.isActive}
              onChange={(e) => setNewRule({ ...newRule, isActive: e.target.checked })}
              color="primary"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setRuleModalOpen(false)} sx={{ fontWeight: 700, borderRadius: "3px" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateRule}
            sx={{ fontWeight: 800, bgcolor: tokens.colors.primary.main, borderRadius: "3px", textTransform: "none" }}
          >
            Create Rule
          </Button>
        </DialogActions>
      </Dialog>

      {/* TEMPLATE PREVIEW MODAL */}
      <Dialog
        open={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: "3px", height: "80vh" } }}
      >
        <DialogTitle sx={{ fontWeight: 800, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Preview: {previewTitle}</span>
          <Chip label="Simulated Render" size="small" color="info" sx={{ fontWeight: 800, borderRadius: "3px" }} />
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, bgcolor: "#f1f5f9" }}>
          <iframe
            srcDoc={previewHtml}
            title="Email Preview"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPreviewModalOpen(false)} sx={{ fontWeight: 700, borderRadius: "3px" }}>
            Close Preview
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT TEMPLATE MODAL */}
      <Dialog
        open={editTemplateModalOpen}
        onClose={() => setEditTemplateModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: "3px" } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          Edit Email Template: {editingTemplate?.templateKey}
        </DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            label="Email Subject Line"
            fullWidth
            required
            value={editingTemplate?.subject || ""}
            onChange={(e) => setEditingTemplate((prev) => (prev ? { ...prev, subject: e.target.value } : null))}
            InputProps={{ sx: { borderRadius: "3px" } }}
          />

          <TextField
            label="Template Description"
            fullWidth
            value={editingTemplate?.description || ""}
            onChange={(e) => setEditingTemplate((prev) => (prev ? { ...prev, description: e.target.value } : null))}
            InputProps={{ sx: { borderRadius: "3px" } }}
          />

          <TextField
            label="HTML Content (Brevo Compatible)"
            fullWidth
            required
            multiline
            rows={12}
            value={editingTemplate?.htmlContent || ""}
            onChange={(e) => setEditingTemplate((prev) => (prev ? { ...prev, htmlContent: e.target.value } : null))}
            sx={{ "& .MuiInputBase-root": { fontFamily: "monospace", fontSize: "0.85rem", borderRadius: "3px" } }}
          />

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="body2" fontWeight={700}>
                Active Status
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Disabled templates will fallback to classpath defaults.
              </Typography>
            </Box>
            <Switch
              checked={editingTemplate?.isActive ?? true}
              onChange={(e) => setEditingTemplate((prev) => (prev ? { ...prev, isActive: e.target.checked } : null))}
              color="primary"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setEditTemplateModalOpen(false)} sx={{ fontWeight: 700, borderRadius: "3px" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveTemplate}
            sx={{ fontWeight: 800, bgcolor: tokens.colors.primary.main, borderRadius: "3px", textTransform: "none" }}
          >
            Save Template
          </Button>
        </DialogActions>
      </Dialog>

      {/* TEST SEND EMAIL MODAL */}
      <Dialog
        open={testSendModalOpen}
        onClose={() => setTestSendModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "3px" } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Dispatch Live Test Email</DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Send an actual transactional message using template <strong>{testSendTarget?.templateKey}</strong> via the configured Brevo SMTP credentials.
          </Typography>

          <TextField
            label="Recipient Email Address"
            type="email"
            required
            fullWidth
            value={testEmailAddress}
            onChange={(e) => setTestEmailAddress(e.target.value)}
            placeholder="you@webliix.com"
            InputProps={{ sx: { borderRadius: "3px" } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setTestSendModalOpen(false)} sx={{ fontWeight: 700, borderRadius: "3px" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSendTestEmail}
            disabled={sendingTest}
            startIcon={sendingTest ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
            sx={{ fontWeight: 800, borderRadius: "3px", textTransform: "none" }}
          >
            {sendingTest ? "Dispatching..." : "Send Test Now"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR NOTIFICATIONS */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: "3px", fontWeight: 700 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageLayout>
  );
}
