import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
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
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";

import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import BadgeIcon from "@mui/icons-material/Badge";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PaymentsIcon from "@mui/icons-material/Payments";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import RateReviewIcon from "@mui/icons-material/RateReview";
import VpnKeyIcon from "@mui/icons-material/VpnKey";

import { PageLayout } from "@/shared/components/ui/layout";
import { BrandLoader } from "@/shared/components/ui/feedback/BrandLoader";
import { tokens } from "@/theme/tokens";
import { http } from "@/shared/services/http";

// --- Types ---
interface EmployeeItem {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId?: number;
  departmentName?: string;
  designationId?: number;
  designationName?: string;
  salary?: number;
  joiningDate?: string;
  employmentType?: string;
  active: boolean;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  emergencyContact?: string;
  userId?: number;
  hasLoginAccount?: boolean;
}

interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  newThisMonth: number;
}

interface DepartmentItem {
  id: number;
  departmentName: string;
}

interface DesignationItem {
  id: number;
  designationName: string;
}

interface WorkLogItem {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeCode: string;
  logDate: string;
  workSummary: string;
  hoursWorked: number;
  projectId?: number;
  projectName?: string;
  tasksCompleted?: string;
  blockers?: string;
  status: string;
  reviewedBy?: string;
  reviewNotes?: string;
  reviewedAt?: string;
  createdAt?: string;
}

interface PaymentSubmissionItem {
  id: number;
  employeeId: number;
  employeeName: string;
  projectId?: number;
  projectName?: string;
  customerId?: number;
  customerName?: string;
  amount: number;
  currency: string;
  paymentDate: string;
  paymentMethod?: string;
  referenceNumber?: string;
  notes?: string;
  status: string;
  reviewedBy?: string;
  reviewNotes?: string;
  reviewedAt?: string;
  linkedInvoiceId?: number;
  createdAt?: string;
}

const statusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
    case "APPROVED":
      return "success";
    case "SUBMITTED":
    case "PENDING_REVIEW":
    case "PENDING":
      return "warning";
    case "REJECTED":
    case "TERMINATED":
    case "CANCELLED":
      return "error";
    case "INACTIVE":
      return "default";
    default:
      return "default";
  }
};

export default function EmployeeListPage() {
  const [currentTab, setCurrentTab] = useState(0);

  // Tab 0: Employees State
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [designations, setDesignations] = useState<DesignationItem[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [searchEmployee, setSearchEmployee] = useState("");

  // Tab 1: Work Logs State
  const [workLogs, setWorkLogs] = useState<WorkLogItem[]>([]);
  const [loadingWorkLogs, setLoadingWorkLogs] = useState(false);
  const [workLogStatusFilter, setWorkLogStatusFilter] = useState("ALL");

  // Tab 2: Payment Submissions State
  const [payments, setPayments] = useState<PaymentSubmissionItem[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("ALL");

  // Shared Modal & Alert State
  const [notification, setNotification] = useState<{ message: string; severity: "success" | "error" } | null>(null);

  // Employee Form Modal (Create / Edit)
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeItem | null>(null);
  const [submittingEmployee, setSubmittingEmployee] = useState(false);
  const [employeeFormData, setEmployeeFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    departmentId: "" as number | string,
    designationId: "" as number | string,
    salary: "" as number | string,
    joiningDate: new Date().toISOString().split("T")[0],
    employmentType: "FULL_TIME",
    active: true,
    address: "",
    city: "",
    state: "",
    country: "",
    emergencyContact: "",
  });

  // Delete Employee Confirmation Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Work Log Review Modal
  const [workLogReviewModalOpen, setWorkLogReviewModalOpen] = useState(false);
  const [selectedWorkLog, setSelectedWorkLog] = useState<WorkLogItem | null>(null);
  const [reviewWorkLogStatus, setReviewWorkLogStatus] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [reviewWorkLogNotes, setReviewWorkLogNotes] = useState("");
  const [submittingWorkLogReview, setSubmittingWorkLogReview] = useState(false);

  // Payment Submission Review Modal
  const [paymentReviewModalOpen, setPaymentReviewModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentSubmissionItem | null>(null);
  const [reviewPaymentStatus, setReviewPaymentStatus] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [reviewPaymentNotes, setReviewPaymentNotes] = useState("");
  const [submittingPaymentReview, setSubmittingPaymentReview] = useState(false);

  // Fetch Employees & Reference Data
  const loadEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const [empRes, statsRes, deptRes, desigRes] = await Promise.all([
        http.get("/api/v1/employees", { params: { page: 0, size: 50 } }),
        http.get("/api/v1/employees/statistics"),
        http.get("/api/v1/departments", { params: { page: 0, size: 100 } }),
        http.get("/api/v1/designations", { params: { page: 0, size: 100 } }),
      ]);

      const empData = empRes.data?.data;
      if (Array.isArray(empData)) {
        setEmployees(empData);
      } else if (empData?.content) {
        setEmployees(empData.content);
      } else {
        setEmployees([]);
      }

      if (statsRes.data?.data) {
        setStats(statsRes.data.data);
      }

      const depts = deptRes.data?.data?.content || deptRes.data?.data || [];
      setDepartments(Array.isArray(depts) ? depts : []);

      const desigs = desigRes.data?.data?.content || desigRes.data?.data || [];
      setDesignations(Array.isArray(desigs) ? desigs : []);
    } catch {
      setNotification({ message: "Failed to load employee records", severity: "error" });
    } finally {
      setLoadingEmployees(false);
    }
  };

  // Fetch Work Logs
  const loadWorkLogs = async () => {
    setLoadingWorkLogs(true);
    try {
      const res = await http.get("/api/v1/work-logs", { params: { page: 0, size: 50 } });
      const data = res.data?.data?.content || res.data?.data || [];
      setWorkLogs(Array.isArray(data) ? data : []);
    } catch {
      setNotification({ message: "Failed to load daily work logs", severity: "error" });
    } finally {
      setLoadingWorkLogs(false);
    }
  };

  // Fetch Payment Submissions
  const loadPayments = async () => {
    setLoadingPayments(true);
    try {
      const res = await http.get("/api/v1/payment-submissions", { params: { page: 0, size: 50 } });
      const data = res.data?.data?.content || res.data?.data || [];
      setPayments(Array.isArray(data) ? data : []);
    } catch {
      setNotification({ message: "Failed to load payment submissions", severity: "error" });
    } finally {
      setLoadingPayments(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    if (newValue === 1) loadWorkLogs();
    if (newValue === 2) loadPayments();
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingEmployee(null);
    setEmployeeFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      departmentId: departments[0]?.id || "",
      designationId: designations[0]?.id || "",
      salary: "",
      joiningDate: new Date().toISOString().split("T")[0],
      employmentType: "FULL_TIME",
      active: true,
      address: "",
      city: "",
      state: "",
      country: "",
      emergencyContact: "",
    });
    setEmployeeModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (emp: EmployeeItem) => {
    setEditingEmployee(emp);
    setEmployeeFormData({
      firstName: emp.firstName || "",
      lastName: emp.lastName || "",
      email: emp.email || "",
      password: "", // Leave blank unless updating
      phone: emp.phone || "",
      departmentId: emp.departmentId || "",
      designationId: emp.designationId || "",
      salary: emp.salary || "",
      joiningDate: emp.joiningDate ? emp.joiningDate.split("T")[0] : new Date().toISOString().split("T")[0],
      employmentType: emp.employmentType || "FULL_TIME",
      active: emp.active !== false,
      address: emp.address || "",
      city: emp.city || "",
      state: emp.state || "",
      country: emp.country || "",
      emergencyContact: emp.emergencyContact || "",
    });
    setEmployeeModalOpen(true);
  };

  // Handle Save Employee (Create or Edit)
  const handleSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeFormData.firstName.trim() || !employeeFormData.lastName.trim() || !employeeFormData.email.trim()) {
      setNotification({ message: "First name, last name, and email are required.", severity: "error" });
      return;
    }
    if (!employeeFormData.departmentId || !employeeFormData.designationId) {
      setNotification({ message: "Please select a department and designation.", severity: "error" });
      return;
    }

    setSubmittingEmployee(true);
    try {
      const payload: any = {
        firstName: employeeFormData.firstName.trim(),
        lastName: employeeFormData.lastName.trim(),
        email: employeeFormData.email.trim(),
        phone: employeeFormData.phone.trim(),
        departmentId: Number(employeeFormData.departmentId),
        designationId: Number(employeeFormData.designationId),
        employmentType: employeeFormData.employmentType,
        joiningDate: employeeFormData.joiningDate,
        salary: employeeFormData.salary ? Number(employeeFormData.salary) : null,
        active: employeeFormData.active,
        address: employeeFormData.address.trim(),
        city: employeeFormData.city.trim(),
        state: employeeFormData.state.trim(),
        country: employeeFormData.country.trim(),
        emergencyContact: employeeFormData.emergencyContact.trim(),
      };

      if (employeeFormData.password.trim()) {
        payload.password = employeeFormData.password.trim();
      }

      if (editingEmployee) {
        await http.put(`/api/v1/employees/${editingEmployee.id}`, payload);
        setNotification({ message: "Employee profile updated successfully.", severity: "success" });
      } else {
        await http.post("/api/v1/employees", payload);
        setNotification({
          message: employeeFormData.password
            ? "Employee created with active portal login account!"
            : "Employee created successfully.",
          severity: "success",
        });
      }

      setEmployeeModalOpen(false);
      loadEmployees();
    } catch (err: any) {
      setNotification({
        message: err.response?.data?.message || "Failed to save employee profile.",
        severity: "error",
      });
    } finally {
      setSubmittingEmployee(false);
    }
  };

  // Handle Delete Employee
  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    setDeleting(true);
    try {
      await http.delete(`/api/v1/employees/${employeeToDelete.id}`);
      setNotification({ message: "Employee deleted and linked account deactivated.", severity: "success" });
      setDeleteModalOpen(false);
      setEmployeeToDelete(null);
      loadEmployees();
    } catch (err: any) {
      setNotification({
        message: err.response?.data?.message || "Failed to delete employee.",
        severity: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Handle Review Work Log
  const handleReviewWorkLog = async () => {
    if (!selectedWorkLog) return;
    setSubmittingWorkLogReview(true);
    try {
      await http.patch(`/api/v1/work-logs/${selectedWorkLog.id}/review`, {
        status: reviewWorkLogStatus,
        reviewNotes: reviewWorkLogNotes.trim(),
      });
      setNotification({ message: `Work log marked as ${reviewWorkLogStatus}.`, severity: "success" });
      setWorkLogReviewModalOpen(false);
      setSelectedWorkLog(null);
      loadWorkLogs();
    } catch (err: any) {
      setNotification({
        message: err.response?.data?.message || "Failed to review work log.",
        severity: "error",
      });
    } finally {
      setSubmittingWorkLogReview(false);
    }
  };

  // Handle Review Payment Submission
  const handleReviewPayment = async () => {
    if (!selectedPayment) return;
    setSubmittingPaymentReview(true);
    try {
      await http.patch(`/api/v1/payment-submissions/${selectedPayment.id}/review`, {
        status: reviewPaymentStatus,
        reviewNotes: reviewPaymentNotes.trim(),
      });
      setNotification({ message: `Payment submission marked as ${reviewPaymentStatus}.`, severity: "success" });
      setPaymentReviewModalOpen(false);
      setSelectedPayment(null);
      loadPayments();
    } catch (err: any) {
      setNotification({
        message: err.response?.data?.message || "Failed to review payment submission.",
        severity: "error",
      });
    } finally {
      setSubmittingPaymentReview(false);
    }
  };

  // Filtered Lists
  const filteredEmployees = employees.filter((e) => {
    const q = searchEmployee.toLowerCase();
    return (
      e.firstName?.toLowerCase().includes(q) ||
      e.lastName?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q) ||
      e.employeeCode?.toLowerCase().includes(q) ||
      e.departmentName?.toLowerCase().includes(q)
    );
  });

  const filteredWorkLogs = workLogs.filter((w) => {
    if (workLogStatusFilter === "ALL") return true;
    return w.status?.toUpperCase() === workLogStatusFilter;
  });

  const filteredPayments = payments.filter((p) => {
    if (paymentStatusFilter === "ALL") return true;
    return p.status?.toUpperCase() === paymentStatusFilter;
  });

  const statCards = [
    {
      label: "Total Employees",
      value: stats?.totalEmployees ?? employees.length,
      icon: <PeopleIcon fontSize="large" />,
      color: tokens.colors.primary.main,
      bg: tokens.colors.primary[50],
    },
    {
      label: "Active",
      value: stats?.activeEmployees ?? employees.filter((e) => e.active).length,
      icon: <BadgeIcon fontSize="large" />,
      color: tokens.colors.success[700],
      bg: tokens.colors.success[50],
    },
    {
      label: "Inactive",
      value: stats?.inactiveEmployees ?? employees.filter((e) => !e.active).length,
      icon: <PersonOffIcon fontSize="large" />,
      color: tokens.colors.secondary[600],
      bg: tokens.colors.secondary[100],
    },
    {
      label: "New This Month",
      value: stats?.newThisMonth ?? 0,
      icon: <PersonAddIcon fontSize="large" />,
      color: tokens.colors.warning[700],
      bg: tokens.colors.warning[50],
    },
  ];

  return (
    <PageLayout
      title="Staff & Workforce Management"
      subtitle="Directory, login account provisioning, daily work reports review, and payment collection approvals"
      actions={
        currentTab === 0 ? (
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleOpenCreateModal}
            sx={{ fontWeight: 700 }}
          >
            Add New Employee
          </Button>
        ) : undefined
      }
    >
      {/* Tabs Bar */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
          <Tab
            label="Employees Directory"
            icon={<PeopleIcon />}
            iconPosition="start"
            sx={{ fontWeight: 700, minHeight: 48 }}
          />
          <Tab
            label="Daily Work Reports"
            icon={<AssignmentTurnedInIcon />}
            iconPosition="start"
            sx={{ fontWeight: 700, minHeight: 48 }}
          />
          <Tab
            label="Payment Collections"
            icon={<PaymentsIcon />}
            iconPosition="start"
            sx={{ fontWeight: 700, minHeight: 48 }}
          />
        </Tabs>
      </Box>

      {/* ==================== TAB 0: EMPLOYEES DIRECTORY ==================== */}
      {currentTab === 0 && (
        <Box sx={{ display: "grid", gap: 3 }}>
          {/* Stat Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 2,
            }}
          >
            {statCards.map((card) => (
              <Card
                key={card.label}
                sx={{
                  borderRadius: tokens.borderRadius.lg,
                  border: `1px solid ${tokens.colors.secondary[200]}`,
                  p: 2.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: tokens.borderRadius.md,
                    bgcolor: card.bg,
                    color: card.color,
                    display: "flex",
                  }}
                >
                  {card.icon}
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={800} color={card.color}>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.label}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>

          {/* Search Bar */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
            <TextField
              placeholder="Search by name, code, email, or department..."
              size="small"
              value={searchEmployee}
              onChange={(e) => setSearchEmployee(e.target.value)}
              sx={{ width: { xs: "100%", sm: 380 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Typography variant="body2" color="text.secondary">
              Showing {filteredEmployees.length} of {employees.length} employees
            </Typography>
          </Box>

          {/* Table */}
          {loadingEmployees ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <BrandLoader message="Loading employees directory..." size="medium" />
            </Box>
          ) : filteredEmployees.length === 0 ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <Typography color="text.secondary">No matching employees found.</Typography>
            </Box>
          ) : (
            <Card
              sx={{
                borderRadius: tokens.borderRadius.lg,
                border: `1px solid ${tokens.colors.secondary[200]}`,
                overflow: "hidden",
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: tokens.colors.secondary[50] }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Email / Phone</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Designation</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Portal Access</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Joining Date</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredEmployees.map((e) => (
                      <TableRow key={e.id} hover>
                        <TableCell sx={{ fontFamily: "monospace", color: tokens.colors.secondary[600] }}>
                          {e.employeeCode}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: tokens.colors.secondary[900] }}>
                          {e.firstName} {e.lastName}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{e.email}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {e.phone || "—"}
                          </Typography>
                        </TableCell>
                        <TableCell>{e.departmentName || "—"}</TableCell>
                        <TableCell>{e.designationName || "—"}</TableCell>
                        <TableCell>
                          {e.hasLoginAccount ? (
                            <Chip
                              icon={<VpnKeyIcon sx={{ fontSize: "14px !important" }} />}
                              label="Login Active"
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ fontWeight: 600 }}
                            />
                          ) : (
                            <Chip label="No Account" size="small" variant="outlined" sx={{ color: "text.disabled" }} />
                          )}
                        </TableCell>
                        <TableCell>
                          {e.joiningDate ? new Date(e.joiningDate).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={e.active ? "ACTIVE" : "INACTIVE"}
                            color={e.active ? "success" : "default"}
                            size="small"
                            sx={{ fontWeight: 700 }}
                          />
                        </TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          <Tooltip title="Edit Employee">
                            <IconButton size="small" onClick={() => handleOpenEditModal(e)} color="primary">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Employee">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setEmployeeToDelete(e);
                                setDeleteModalOpen(true);
                              }}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
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

      {/* ==================== TAB 1: DAILY WORK REPORTS REVIEW ==================== */}
      {currentTab === 1 && (
        <Box sx={{ display: "grid", gap: 3 }}>
          {/* Header & Filter */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Employee Work Logs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Review daily reports, tasks accomplished, and blockers submitted by staff members
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={workLogStatusFilter}
                  label="Status Filter"
                  onChange={(e) => setWorkLogStatusFilter(e.target.value)}
                >
                  <MenuItem value="ALL">All Statuses</MenuItem>
                  <MenuItem value="SUBMITTED">Submitted (Pending)</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                </Select>
              </FormControl>
              <Button variant="outlined" size="small" onClick={loadWorkLogs}>
                Refresh
              </Button>
            </Box>
          </Box>

          {/* Table */}
          {loadingWorkLogs ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <BrandLoader message="Loading daily work logs..." size="medium" />
            </Box>
          ) : filteredWorkLogs.length === 0 ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <Typography color="text.secondary">No work logs found for this filter.</Typography>
            </Box>
          ) : (
            <Card
              sx={{
                borderRadius: tokens.borderRadius.lg,
                border: `1px solid ${tokens.colors.secondary[200]}`,
                overflow: "hidden",
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: tokens.colors.secondary[50] }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Log Date</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Project</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Hours</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Work Summary</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Blockers</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Reviewed By</TableCell>
                      <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredWorkLogs.map((log) => (
                      <TableRow key={log.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {log.logDate ? new Date(log.logDate).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={700}>
                            {log.employeeName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                            {log.employeeCode}
                          </Typography>
                        </TableCell>
                        <TableCell>{log.projectName || "General"}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{log.hoursWorked ? `${log.hoursWorked} hrs` : "—"}</TableCell>
                        <TableCell sx={{ maxWidth: 280 }}>
                          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                            {log.workSummary}
                          </Typography>
                          {log.tasksCompleted && (
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                              <strong>Tasks:</strong> {log.tasksCompleted}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ maxWidth: 180 }}>
                          {log.blockers ? (
                            <Typography variant="caption" color="error.main">
                              {log.blockers}
                            </Typography>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={log.status}
                            color={statusColor(log.status) as any}
                            size="small"
                            sx={{ fontWeight: 700 }}
                          />
                        </TableCell>
                        <TableCell>
                          {log.reviewedBy ? (
                            <Box>
                              <Typography variant="caption" fontWeight={600} display="block">
                                {log.reviewedBy}
                              </Typography>
                              {log.reviewNotes && (
                                <Typography variant="caption" color="text.secondary">
                                  {log.reviewNotes}
                                </Typography>
                              )}
                            </Box>
                          ) : (
                            <Typography variant="caption" color="text.disabled">
                              Not reviewed
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<RateReviewIcon />}
                            onClick={() => {
                              setSelectedWorkLog(log);
                              setReviewWorkLogStatus(log.status === "REJECTED" ? "REJECTED" : "APPROVED");
                              setReviewWorkLogNotes(log.reviewNotes || "");
                              setWorkLogReviewModalOpen(true);
                            }}
                          >
                            Review
                          </Button>
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

      {/* ==================== TAB 2: PAYMENT SUBMISSIONS REVIEW ==================== */}
      {currentTab === 2 && (
        <Box sx={{ display: "grid", gap: 3 }}>
          {/* Header & Filter */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Staff Payment & Collection Submissions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Audit and verify client payment receipts submitted by team members before reconciliation
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={paymentStatusFilter}
                  label="Status Filter"
                  onChange={(e) => setPaymentStatusFilter(e.target.value)}
                >
                  <MenuItem value="ALL">All Statuses</MenuItem>
                  <MenuItem value="PENDING_REVIEW">Pending Review</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                </Select>
              </FormControl>
              <Button variant="outlined" size="small" onClick={loadPayments}>
                Refresh
              </Button>
            </Box>
          </Box>

          {/* Table */}
          {loadingPayments ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <BrandLoader message="Loading payment submissions..." size="medium" />
            </Box>
          ) : filteredPayments.length === 0 ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <Typography color="text.secondary">No payment submissions found for this filter.</Typography>
            </Box>
          ) : (
            <Card
              sx={{
                borderRadius: tokens.borderRadius.lg,
                border: `1px solid ${tokens.colors.secondary[200]}`,
                overflow: "hidden",
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: tokens.colors.secondary[50] }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Client / Project</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Method / Ref #</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Notes</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Reviewed By</TableCell>
                      <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPayments.map((p) => (
                      <TableRow key={p.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{p.employeeName}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {p.customerName || "—"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {p.projectName ? `Project: ${p.projectName}` : ""}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800, color: tokens.colors.success[700] }}>
                          {p.currency} {Number(p.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{p.paymentMethod || "—"}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                            {p.referenceNumber || ""}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>{p.notes || "—"}</TableCell>
                        <TableCell>
                          <Chip
                            label={p.status}
                            color={statusColor(p.status) as any}
                            size="small"
                            sx={{ fontWeight: 700 }}
                          />
                        </TableCell>
                        <TableCell>
                          {p.reviewedBy ? (
                            <Box>
                              <Typography variant="caption" fontWeight={600} display="block">
                                {p.reviewedBy}
                              </Typography>
                              {p.reviewNotes && (
                                <Typography variant="caption" color="text.secondary">
                                  {p.reviewNotes}
                                </Typography>
                              )}
                            </Box>
                          ) : (
                            <Typography variant="caption" color="text.disabled">
                              Not reviewed
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<RateReviewIcon />}
                            onClick={() => {
                              setSelectedPayment(p);
                              setReviewPaymentStatus(p.status === "REJECTED" ? "REJECTED" : "APPROVED");
                              setReviewPaymentNotes(p.reviewNotes || "");
                              setPaymentReviewModalOpen(true);
                            }}
                          >
                            Review
                          </Button>
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

      {/* ==================== CREATE / EDIT EMPLOYEE MODAL ==================== */}
      <Dialog
        open={employeeModalOpen}
        onClose={() => setEmployeeModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <form onSubmit={handleSaveEmployee}>
          <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
            {editingEmployee ? `Edit Employee: ${editingEmployee.employeeCode}` : "Add New Employee & Provision Login"}
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5, mt: 1 }}>
              <TextField
                label="First Name"
                required
                value={employeeFormData.firstName}
                onChange={(e) => setEmployeeFormData({ ...employeeFormData, firstName: e.target.value })}
              />
              <TextField
                label="Last Name"
                required
                value={employeeFormData.lastName}
                onChange={(e) => setEmployeeFormData({ ...employeeFormData, lastName: e.target.value })}
              />
              <TextField
                label="Work Email"
                type="email"
                required
                value={employeeFormData.email}
                onChange={(e) => setEmployeeFormData({ ...employeeFormData, email: e.target.value })}
              />
              <TextField
                label={editingEmployee ? "Update Password (Optional)" : "Account Password (Login Provisioning)"}
                type="password"
                placeholder={editingEmployee ? "Leave blank to keep unchanged" : "Set password for employee portal access"}
                value={employeeFormData.password}
                onChange={(e) => setEmployeeFormData({ ...employeeFormData, password: e.target.value })}
                helperText={
                  editingEmployee
                    ? "Leave blank to preserve current password"
                    : "If entered, automatically creates a linked portal login account with EMPLOYEE role."
                }
              />
              <TextField
                label="Phone"
                value={employeeFormData.phone}
                onChange={(e) => setEmployeeFormData({ ...employeeFormData, phone: e.target.value })}
              />
              <FormControl fullWidth required>
                <InputLabel>Department</InputLabel>
                <Select
                  value={employeeFormData.departmentId}
                  label="Department"
                  onChange={(e) => setEmployeeFormData({ ...employeeFormData, departmentId: e.target.value })}
                >
                  {departments.map((d) => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.departmentName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth required>
                <InputLabel>Designation</InputLabel>
                <Select
                  value={employeeFormData.designationId}
                  label="Designation"
                  onChange={(e) => setEmployeeFormData({ ...employeeFormData, designationId: e.target.value })}
                >
                  {designations.map((d) => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.designationName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Employment Type</InputLabel>
                <Select
                  value={employeeFormData.employmentType}
                  label="Employment Type"
                  onChange={(e) => setEmployeeFormData({ ...employeeFormData, employmentType: e.target.value })}
                >
                  <MenuItem value="FULL_TIME">Full Time</MenuItem>
                  <MenuItem value="PART_TIME">Part Time</MenuItem>
                  <MenuItem value="CONTRACT">Contract</MenuItem>
                  <MenuItem value="INTERN">Intern</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Monthly Salary (₹)"
                type="number"
                value={employeeFormData.salary}
                onChange={(e) => setEmployeeFormData({ ...employeeFormData, salary: e.target.value })}
              />
              <TextField
                label="Joining Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={employeeFormData.joiningDate}
                onChange={(e) => setEmployeeFormData({ ...employeeFormData, joiningDate: e.target.value })}
              />
              <TextField
                label="City"
                value={employeeFormData.city}
                onChange={(e) => setEmployeeFormData({ ...employeeFormData, city: e.target.value })}
              />
              <TextField
                label="State / Province"
                value={employeeFormData.state}
                onChange={(e) => setEmployeeFormData({ ...employeeFormData, state: e.target.value })}
              />
              <TextField
                label="Country"
                value={employeeFormData.country}
                onChange={(e) => setEmployeeFormData({ ...employeeFormData, country: e.target.value })}
              />
              <TextField
                label="Emergency Contact"
                value={employeeFormData.emergencyContact}
                onChange={(e) => setEmployeeFormData({ ...employeeFormData, emergencyContact: e.target.value })}
              />
              <Box sx={{ gridColumn: { xs: "1fr", sm: "1 / -1" } }}>
                <TextField
                  label="Residential Address"
                  fullWidth
                  multiline
                  rows={2}
                  value={employeeFormData.address}
                  onChange={(e) => setEmployeeFormData({ ...employeeFormData, address: e.target.value })}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: "1fr", sm: "1 / -1" } }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={employeeFormData.active}
                      onChange={(e) => setEmployeeFormData({ ...employeeFormData, active: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Active Employment Status"
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setEmployeeModalOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={submittingEmployee} sx={{ fontWeight: 700 }}>
              {submittingEmployee ? <CircularProgress size={24} /> : editingEmployee ? "Update Employee" : "Save & Provision"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ==================== DELETE CONFIRMATION MODAL ==================== */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, maxWidth: 450 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Employee Record?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete <strong>{employeeToDelete?.firstName} {employeeToDelete?.lastName}</strong> (
            {employeeToDelete?.employeeCode})? This will also disable their linked portal login account.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDeleteModalOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteEmployee} variant="contained" color="error" disabled={deleting}>
            {deleting ? <CircularProgress size={20} /> : "Delete Employee"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ==================== WORK LOG REVIEW MODAL ==================== */}
      <Dialog
        open={workLogReviewModalOpen}
        onClose={() => setWorkLogReviewModalOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, maxWidth: 500 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Review Daily Work Log</DialogTitle>
        <DialogContent dividers>
          {selectedWorkLog && (
            <Box sx={{ display: "grid", gap: 2, pt: 1 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Employee: <strong>{selectedWorkLog.employeeName}</strong> ({selectedWorkLog.employeeCode})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: <strong>{selectedWorkLog.logDate}</strong> | Hours: <strong>{selectedWorkLog.hoursWorked} hrs</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Project: <strong>{selectedWorkLog.projectName || "General"}</strong>
                </Typography>
              </Box>
              <Box sx={{ bgcolor: tokens.colors.secondary[50], p: 1.5, borderRadius: 1.5 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  Work Summary:
                </Typography>
                <Typography variant="body2">{selectedWorkLog.workSummary}</Typography>
                {selectedWorkLog.tasksCompleted && (
                  <>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ mt: 1, display: "block" }}>
                      Tasks Completed:
                    </Typography>
                    <Typography variant="body2">{selectedWorkLog.tasksCompleted}</Typography>
                  </>
                )}
                {selectedWorkLog.blockers && (
                  <>
                    <Typography variant="caption" color="error.main" fontWeight={700} sx={{ mt: 1, display: "block" }}>
                      Blockers:
                    </Typography>
                    <Typography variant="body2" color="error.main">
                      {selectedWorkLog.blockers}
                    </Typography>
                  </>
                )}
              </Box>
              <FormControl fullWidth size="small">
                <InputLabel>Review Decision</InputLabel>
                <Select
                  value={reviewWorkLogStatus}
                  label="Review Decision"
                  onChange={(e) => setReviewWorkLogStatus(e.target.value as "APPROVED" | "REJECTED")}
                >
                  <MenuItem value="APPROVED">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "success.main" }}>
                      <CheckCircleIcon fontSize="small" /> Approve Log
                    </Box>
                  </MenuItem>
                  <MenuItem value="REJECTED">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "error.main" }}>
                      <CancelIcon fontSize="small" /> Reject Log
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Reviewer Notes / Feedback"
                multiline
                rows={3}
                value={reviewWorkLogNotes}
                onChange={(e) => setReviewWorkLogNotes(e.target.value)}
                placeholder="Optional notes or feedback for the employee..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setWorkLogReviewModalOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleReviewWorkLog}
            variant="contained"
            color={reviewWorkLogStatus === "APPROVED" ? "primary" : "error"}
            disabled={submittingWorkLogReview}
          >
            {submittingWorkLogReview ? <CircularProgress size={20} /> : `Submit as ${reviewWorkLogStatus}`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ==================== PAYMENT SUBMISSION REVIEW MODAL ==================== */}
      <Dialog
        open={paymentReviewModalOpen}
        onClose={() => setPaymentReviewModalOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, maxWidth: 500 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Review Payment Submission</DialogTitle>
        <DialogContent dividers>
          {selectedPayment && (
            <Box sx={{ display: "grid", gap: 2, pt: 1 }}>
              <Alert severity="info" sx={{ fontSize: 13 }}>
                Approving confirms receipt for verification and records. Payment submissions do not automatically mark
                invoices paid without accounting reconciliation.
              </Alert>
              <Box>
                <Typography variant="body2">
                  Employee: <strong>{selectedPayment.employeeName}</strong>
                </Typography>
                <Typography variant="body2">
                  Client: <strong>{selectedPayment.customerName || "—"}</strong>
                </Typography>
                <Typography variant="body2">
                  Project: <strong>{selectedPayment.projectName || "—"}</strong>
                </Typography>
                <Typography variant="body2">
                  Amount:{" "}
                  <strong>
                    {selectedPayment.currency} {Number(selectedPayment.amount).toLocaleString()}
                  </strong>
                </Typography>
                <Typography variant="body2">
                  Date: <strong>{selectedPayment.paymentDate}</strong> | Method:{" "}
                  <strong>{selectedPayment.paymentMethod || "—"}</strong>
                </Typography>
                {selectedPayment.referenceNumber && (
                  <Typography variant="body2">
                    Reference: <strong>{selectedPayment.referenceNumber}</strong>
                  </Typography>
                )}
                {selectedPayment.notes && (
                  <Typography variant="body2" color="text.secondary">
                    Notes: {selectedPayment.notes}
                  </Typography>
                )}
              </Box>
              <FormControl fullWidth size="small">
                <InputLabel>Review Decision</InputLabel>
                <Select
                  value={reviewPaymentStatus}
                  label="Review Decision"
                  onChange={(e) => setReviewPaymentStatus(e.target.value as "APPROVED" | "REJECTED")}
                >
                  <MenuItem value="APPROVED">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "success.main" }}>
                      <CheckCircleIcon fontSize="small" /> Approve Submission
                    </Box>
                  </MenuItem>
                  <MenuItem value="REJECTED">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "error.main" }}>
                      <CancelIcon fontSize="small" /> Reject Submission
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Reviewer Notes / Feedback"
                multiline
                rows={3}
                value={reviewPaymentNotes}
                onChange={(e) => setReviewPaymentNotes(e.target.value)}
                placeholder="Optional review notes..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setPaymentReviewModalOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleReviewPayment}
            variant="contained"
            color={reviewPaymentStatus === "APPROVED" ? "primary" : "error"}
            disabled={submittingPaymentReview}
          >
            {submittingPaymentReview ? <CircularProgress size={20} /> : `Submit as ${reviewPaymentStatus}`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ==================== GLOBAL NOTIFICATION SNACKBAR ==================== */}
      <Snackbar
        open={Boolean(notification)}
        autoHideDuration={4000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {notification ? (
          <Alert onClose={() => setNotification(null)} severity={notification.severity} sx={{ width: "100%" }}>
            {notification.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </PageLayout>
  );
}
