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
import Checkbox from "@mui/material/Checkbox";
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
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

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

interface AttendanceItem {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeCode: string;
  attendanceDate: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: string;
  notes?: string;
  workingHours?: number;
}

interface LeaveItem {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeCode: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  totalDays?: number;
  approvedBy?: string;
  approvalNotes?: string;
  createdAt: string;
}

interface LeaveBalanceItem {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeCode: string;
  leaveType: string;
  year: number;
  totalAllocated: number;
  usedDays: number;
  remainingDays: number;
}

interface RoleItem {
  id: number;
  name: string;
  displayName?: string;
  description?: string;
}

interface PermissionCatalogItem {
  id: number;
  code?: string;
  name?: string;
  module: string;
  action: string;
  description?: string;
}

interface UserOverrideItem {
  id: number;
  userId: number;
  permission: {
    id: number;
    code?: string;
    name?: string;
    description?: string;
    module?: string;
  };
  granted: boolean;
  scope: string;
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

  // Tab 3: Attendance State
  const [attendances, setAttendances] = useState<AttendanceItem[]>([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [attendanceDateFilter, setAttendanceDateFilter] = useState("");
  const [markAttendanceModalOpen, setMarkAttendanceModalOpen] = useState(false);
  const [submittingAttendance, setSubmittingAttendance] = useState(false);
  const [attendanceFormData, setAttendanceFormData] = useState({
    employeeId: "" as number | string,
    attendanceDate: new Date().toISOString().split("T")[0],
    checkInTime: "",
    checkOutTime: "",
    status: "PRESENT",
    notes: "",
  });

  // Tab 4: Leaves State
  const [leaves, setLeaves] = useState<LeaveItem[]>([]);
  const [loadingLeaves, setLoadingLeaves] = useState(false);
  const [leaveStatusFilter, setLeaveStatusFilter] = useState("ALL");
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalanceItem[]>([]);
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [quotaModalOpen, setQuotaModalOpen] = useState(false);
  const [submittingQuota, setSubmittingQuota] = useState(false);
  const [quotaFormData, setQuotaFormData] = useState({
    employeeId: "" as number | string,
    leaveType: "CASUAL",
    year: new Date().getFullYear(),
    totalAllocated: 12,
  });

  // Permissions & Roles Modal State
  const [permsModalOpen, setPermsModalOpen] = useState(false);
  const [selectedEmpForPerms, setSelectedEmpForPerms] = useState<EmployeeItem | null>(null);
  const [allRoles, setAllRoles] = useState<RoleItem[]>([]);
  const [selectedRoleNames, setSelectedRoleNames] = useState<string[]>([]);
  const [permissionCatalog, setPermissionCatalog] = useState<Record<string, PermissionCatalogItem[]>>({});
  const [userOverrides, setUserOverrides] = useState<UserOverrideItem[]>([]);
  const [loadingPermsData, setLoadingPermsData] = useState(false);
  const [savingRoles, setSavingRoles] = useState(false);
  const [overridePermId, setOverridePermId] = useState<number | string>("");
  const [overrideScope, setOverrideScope] = useState<string>("ALL");
  const [savingOverride, setSavingOverride] = useState(false);

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

  // Portal Access & Credentials Modal
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [selectedEmpForAccess, setSelectedEmpForAccess] = useState<EmployeeItem | null>(null);
  const [accessPassword, setAccessPassword] = useState("");
  const [accessEnabled, setAccessEnabled] = useState(true);
  const [submittingAccess, setSubmittingAccess] = useState(false);

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

  const loadAttendance = async () => {
    setLoadingAttendance(true);
    try {
      const res = await http.get("/api/v1/attendance", { params: { page: 0, size: 100 } });
      const data = res.data?.data?.content || res.data?.data || [];
      setAttendances(Array.isArray(data) ? data : []);
    } catch {
      setNotification({ message: "Failed to load attendance records", severity: "error" });
      setAttendances([]);
    } finally {
      setLoadingAttendance(false);
    }
  };

  const loadLeaves = async () => {
    setLoadingLeaves(true);
    setLoadingBalances(true);
    try {
      const [leavesRes, balRes] = await Promise.allSettled([
        http.get("/api/v1/leaves", { params: { page: 0, size: 100 } }),
        http.get("/api/v1/leaves/balances", { params: { page: 0, size: 100 } }),
      ]);
      if (leavesRes.status === "fulfilled") {
        const d = leavesRes.value.data?.data?.content || leavesRes.value.data?.data || [];
        setLeaves(Array.isArray(d) ? d : []);
      }
      if (balRes.status === "fulfilled") {
        const b = balRes.value.data?.data?.content || balRes.value.data?.data || [];
        setLeaveBalances(Array.isArray(b) ? b : []);
      }
    } catch {
      setNotification({ message: "Failed to load leave requests", severity: "error" });
      setLeaves([]);
    } finally {
      setLoadingLeaves(false);
      setLoadingBalances(false);
    }
  };

  const handleApproveLeave = async (id: number) => {
    try {
      await http.put(`/api/v1/leaves/${id}/approve`);
      setNotification({ message: "Leave request approved successfully!", severity: "success" });
      loadLeaves();
    } catch (err: any) {
      setNotification({ message: err.response?.data?.message || "Failed to approve leave", severity: "error" });
    }
  };

  const handleRejectLeave = async (id: number) => {
    try {
      await http.put(`/api/v1/leaves/${id}/reject`);
      setNotification({ message: "Leave request rejected.", severity: "success" });
      loadLeaves();
    } catch (err: any) {
      setNotification({ message: err.response?.data?.message || "Failed to reject leave", severity: "error" });
    }
  };

  const handleSaveAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendanceFormData.employeeId) {
      setNotification({ message: "Please select an employee", severity: "error" });
      return;
    }
    setSubmittingAttendance(true);
    try {
      await http.post("/api/v1/attendance", {
        employeeId: Number(attendanceFormData.employeeId),
        attendanceDate: attendanceFormData.attendanceDate,
        checkInTime: attendanceFormData.checkInTime ? `${attendanceFormData.attendanceDate}T${attendanceFormData.checkInTime}:00` : null,
        checkOutTime: attendanceFormData.checkOutTime ? `${attendanceFormData.attendanceDate}T${attendanceFormData.checkOutTime}:00` : null,
        status: attendanceFormData.status,
        notes: attendanceFormData.notes,
      });
      setNotification({ message: "Attendance record saved successfully!", severity: "success" });
      setMarkAttendanceModalOpen(false);
      loadAttendance();
    } catch (err: any) {
      setNotification({ message: err.response?.data?.message || "Failed to record attendance", severity: "error" });
    } finally {
      setSubmittingAttendance(false);
    }
  };

  const handleSaveQuota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotaFormData.employeeId) {
      setNotification({ message: "Please select an employee", severity: "error" });
      return;
    }
    setSubmittingQuota(true);
    try {
      await http.post("/api/v1/leaves/balances", {
        employeeId: Number(quotaFormData.employeeId),
        leaveType: quotaFormData.leaveType,
        year: Number(quotaFormData.year),
        totalAllocated: Number(quotaFormData.totalAllocated),
      });
      setNotification({ message: "Leave balance quota allocated successfully!", severity: "success" });
      setQuotaModalOpen(false);
      loadLeaves();
    } catch (err: any) {
      setNotification({ message: err.response?.data?.message || "Failed to allocate leave quota", severity: "error" });
    } finally {
      setSubmittingQuota(false);
    }
  };

  const handleOpenPermissionsModal = async (emp: EmployeeItem) => {
    setSelectedEmpForPerms(emp);
    setPermsModalOpen(true);
    setLoadingPermsData(true);
    try {
      const [rolesRes, permsRes] = await Promise.all([
        http.get("/api/v1/admin/roles"),
        http.get("/api/v1/admin/permissions"),
      ]);
      setAllRoles(rolesRes.data?.data || []);
      setPermissionCatalog(permsRes.data?.data || {});

      if (emp.userId) {
        try {
          const userRes = await http.get(`/api/v1/users/${emp.userId}`);
          const uRoles = userRes.data?.data?.roles || [];
          setSelectedRoleNames(uRoles);
        } catch {
          setSelectedRoleNames(["EMPLOYEE"]);
        }

        try {
          const overridesRes = await http.get(`/api/v1/users/${emp.userId}/permission-overrides`);
          setUserOverrides(overridesRes.data?.data || []);
        } catch {
          setUserOverrides([]);
        }
      } else {
        setSelectedRoleNames(["EMPLOYEE"]);
        setUserOverrides([]);
      }
    } catch (err) {
      console.error("Failed to load permissions catalog", err);
    } finally {
      setLoadingPermsData(false);
    }
  };

  const handleSaveUserRoles = async () => {
    if (!selectedEmpForPerms?.userId) {
      setNotification({ message: "This employee does not have a linked user login account yet. Set credentials first.", severity: "error" });
      return;
    }
    setSavingRoles(true);
    try {
      await http.put(`/api/v1/users/${selectedEmpForPerms.userId}/roles`, {
        roles: selectedRoleNames,
      });
      setNotification({ message: `Updated roles for ${selectedEmpForPerms.firstName} successfully!`, severity: "success" });
    } catch (err: any) {
      setNotification({ message: err.response?.data?.message || "Failed to update roles", severity: "error" });
    } finally {
      setSavingRoles(false);
    }
  };

  const handleAddOverride = async () => {
    if (!selectedEmpForPerms?.userId || !overridePermId) return;
    setSavingOverride(true);
    try {
      await http.put(`/api/v1/users/${selectedEmpForPerms.userId}/permission-overrides`, {
        permissionId: Number(overridePermId),
        granted: true,
        scope: overrideScope,
      });
      setNotification({ message: "Permission grant saved successfully!", severity: "success" });
      const overridesRes = await http.get(`/api/v1/users/${selectedEmpForPerms.userId}/permission-overrides`);
      setUserOverrides(overridesRes.data?.data || []);
      setOverridePermId("");
    } catch (err: any) {
      setNotification({ message: err.response?.data?.message || "Failed to grant permission", severity: "error" });
    } finally {
      setSavingOverride(false);
    }
  };

  const handleDeleteOverride = async (permissionId: number) => {
    if (!selectedEmpForPerms?.userId) return;
    try {
      await http.delete(`/api/v1/users/${selectedEmpForPerms.userId}/permission-overrides/${permissionId}`);
      setNotification({ message: "Permission override removed.", severity: "success" });
      setUserOverrides((prev) => prev.filter((o) => o.permission?.id !== permissionId));
    } catch (err: any) {
      setNotification({ message: err.response?.data?.message || "Failed to delete override", severity: "error" });
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    if (newValue === 1) loadWorkLogs();
    if (newValue === 2) loadPayments();
    if (newValue === 3) loadAttendance();
    if (newValue === 4) loadLeaves();
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
          message: "Employee profile & portal login created! Credentials dispatched from noreply@webliix.com.",
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

  const handleOpenAccessModal = (emp: EmployeeItem) => {
    setSelectedEmpForAccess(emp);
    setAccessPassword("");
    setAccessEnabled(emp.active !== false);
    setAccessModalOpen(true);
  };

  const handleSaveAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpForAccess) return;
    setSubmittingAccess(true);
    try {
      const payload: any = {
        firstName: selectedEmpForAccess.firstName,
        lastName: selectedEmpForAccess.lastName,
        email: selectedEmpForAccess.email,
        phone: selectedEmpForAccess.phone,
        departmentId: selectedEmpForAccess.departmentId,
        designationId: selectedEmpForAccess.designationId,
        employmentType: selectedEmpForAccess.employmentType || "FULL_TIME",
        joiningDate: selectedEmpForAccess.joiningDate ? selectedEmpForAccess.joiningDate.split("T")[0] : new Date().toISOString().split("T")[0],
        salary: selectedEmpForAccess.salary,
        active: accessEnabled,
        address: selectedEmpForAccess.address || "",
        city: selectedEmpForAccess.city || "",
        state: selectedEmpForAccess.state || "",
        country: selectedEmpForAccess.country || "",
        emergencyContact: selectedEmpForAccess.emergencyContact || "",
      };

      if (accessPassword.trim()) {
        payload.password = accessPassword.trim();
      }

      await http.put(`/api/v1/employees/${selectedEmpForAccess.id}`, payload);
      setNotification({
        message: accessPassword.trim()
          ? "Employee login password and portal access updated successfully!"
          : "Employee portal status updated successfully!",
        severity: "success",
      });
      setAccessModalOpen(false);
      loadEmployees();
    } catch (err: any) {
      setNotification({
        message: err.response?.data?.message || "Failed to update employee access",
        severity: "error",
      });
    } finally {
      setSubmittingAccess(false);
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
        ) : currentTab === 3 ? (
          <Button
            variant="contained"
            startIcon={<EventAvailableIcon />}
            onClick={() => {
              setAttendanceFormData({
                employeeId: employees[0]?.id || "",
                attendanceDate: new Date().toISOString().split("T")[0],
                checkInTime: "09:00",
                checkOutTime: "18:00",
                status: "PRESENT",
                notes: "",
              });
              setMarkAttendanceModalOpen(true);
            }}
            sx={{ fontWeight: 700 }}
          >
            Mark / Adjust Attendance
          </Button>
        ) : currentTab === 4 ? (
          <Button
            variant="contained"
            startIcon={<FactCheckIcon />}
            onClick={() => {
              setQuotaFormData({
                employeeId: employees[0]?.id || "",
                leaveType: "CASUAL",
                year: new Date().getFullYear(),
                totalAllocated: 12,
              });
              setQuotaModalOpen(true);
            }}
            sx={{ fontWeight: 700 }}
          >
            Configure Leave Quotas
          </Button>
        ) : undefined
      }
    >
      {/* Tabs Bar */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3, width: "100%", overflowX: "auto" }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            "& .MuiTab-root": { minHeight: 48, whiteSpace: "nowrap" }
          }}
        >
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
          <Tab
            label="Attendance Management"
            icon={<EventAvailableIcon />}
            iconPosition="start"
            sx={{ fontWeight: 700, minHeight: 48 }}
          />
          <Tab
            label="Leave Requests & Quotas"
            icon={<FactCheckIcon />}
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
                          <Tooltip title="Manage Roles & Permissions">
                            <IconButton size="small" onClick={() => handleOpenPermissionsModal(e)} sx={{ color: tokens.colors.primary.main }}>
                              <AdminPanelSettingsIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Manage Access & Credentials">
                            <IconButton size="small" onClick={() => handleOpenAccessModal(e)} color="info">
                              <VpnKeyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
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

      {/* ==================== TAB 3: ATTENDANCE MANAGEMENT ==================== */}
      {currentTab === 3 && (
        <Box sx={{ display: "grid", gap: 3 }}>
          {/* Header & Date Filter */}
          <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Staff Attendance & Work Hours
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View employee clock-in records, track shift hours, and record or adjust attendance manually
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
              <TextField
                type="date"
                size="small"
                label="Filter by Date"
                InputLabelProps={{ shrink: true }}
                value={attendanceDateFilter}
                onChange={(e) => setAttendanceDateFilter(e.target.value)}
                sx={{ minWidth: 160 }}
              />
              {attendanceDateFilter && (
                <Button size="small" variant="text" onClick={() => setAttendanceDateFilter("")}>
                  Clear Date
                </Button>
              )}
              <Button size="small" variant="outlined" onClick={loadAttendance}>
                Refresh
              </Button>
            </Box>
          </Box>

          {/* Attendance Table */}
          {loadingAttendance ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <BrandLoader message="Fetching attendance records..." size="medium" />
            </Box>
          ) : (
            <Card
              sx={{
                borderRadius: tokens.borderRadius.lg,
                border: `1px solid ${tokens.colors.secondary[200]}`,
                overflow: "hidden",
              }}
            >
              <TableContainer sx={{ overflowX: "auto", width: "100%" }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead sx={{ bgcolor: tokens.colors.secondary[50] }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Check-In Time</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Check-Out Time</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Total Hours</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Notes / Remarks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendances
                      .filter((a) => !attendanceDateFilter || (a.attendanceDate && a.attendanceDate.startsWith(attendanceDateFilter)))
                      .length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ textAlign: "center", py: 5, color: "text.secondary" }}>
                          No attendance records found for this period. Use "Mark / Adjust Attendance" to record.
                        </TableCell>
                      </TableRow>
                    ) : (
                      attendances
                        .filter((a) => !attendanceDateFilter || (a.attendanceDate && a.attendanceDate.startsWith(attendanceDateFilter)))
                        .map((att) => (
                          <TableRow key={att.id} hover>
                            <TableCell sx={{ fontWeight: 600 }}>
                              {att.attendanceDate ? new Date(att.attendanceDate).toLocaleDateString() : "—"}
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight={700}>
                                {att.employeeName || `Employee #${att.employeeId}`}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {att.employeeCode || "—"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {att.checkInTime ? new Date(att.checkInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                            </TableCell>
                            <TableCell>
                              {att.checkOutTime ? new Date(att.checkOutTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                              {att.workingHours != null ? `${att.workingHours.toFixed(2)} hrs` : "—"}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={att.status || "PRESENT"}
                                color={statusColor(att.status) as any}
                                size="small"
                                sx={{ fontWeight: 700 }}
                              />
                            </TableCell>
                            <TableCell sx={{ color: "text.secondary", maxWidth: 200, fontSize: "0.8125rem" }}>
                              {att.notes || "—"}
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          )}
        </Box>
      )}

      {/* ==================== TAB 4: LEAVE REQUESTS & QUOTAS ==================== */}
      {currentTab === 4 && (
        <Box sx={{ display: "grid", gap: 3 }}>
          {/* Header & Status Filter */}
          <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Leave Requests & Vacation Approvals
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Review absence requests from staff, grant 1-click approvals or rejections, and monitor leave balances
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={leaveStatusFilter}
                  label="Status Filter"
                  onChange={(e) => setLeaveStatusFilter(e.target.value)}
                >
                  <MenuItem value="ALL">All Statuses</MenuItem>
                  <MenuItem value="PENDING">Pending Review</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                </Select>
              </FormControl>
              <Button size="small" variant="outlined" onClick={loadLeaves}>
                Refresh
              </Button>
            </Box>
          </Box>

          {/* Leave Requests Table */}
          {loadingLeaves ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <BrandLoader message="Fetching leave requests..." size="medium" />
            </Box>
          ) : (
            <Card
              sx={{
                borderRadius: tokens.borderRadius.lg,
                border: `1px solid ${tokens.colors.secondary[200]}`,
                overflow: "hidden",
              }}
            >
              <TableContainer sx={{ overflowX: "auto", width: "100%" }}>
                <Table sx={{ minWidth: 850 }}>
                  <TableHead sx={{ bgcolor: tokens.colors.secondary[50] }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Leave Type</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Start Date</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>End Date</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Reason / Purpose</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Review Notes</TableCell>
                      <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaves
                      .filter((l) => leaveStatusFilter === "ALL" || l.status?.toUpperCase() === leaveStatusFilter)
                      .length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} sx={{ textAlign: "center", py: 5, color: "text.secondary" }}>
                          No leave applications found matching current filter.
                        </TableCell>
                      </TableRow>
                    ) : (
                      leaves
                        .filter((l) => leaveStatusFilter === "ALL" || l.status?.toUpperCase() === leaveStatusFilter)
                        .map((l) => (
                          <TableRow key={l.id} hover>
                            <TableCell>
                              <Typography variant="body2" fontWeight={700}>
                                {l.employeeName || `Employee #${l.employeeId}`}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {l.employeeCode || "—"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={l.leaveType}
                                size="small"
                                sx={{
                                  fontWeight: 700,
                                  bgcolor: tokens.colors.primary[50],
                                  color: tokens.colors.primary.main,
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ whiteSpace: "nowrap" }}>
                              {l.startDate ? new Date(l.startDate).toLocaleDateString() : "—"}
                            </TableCell>
                            <TableCell sx={{ whiteSpace: "nowrap" }}>
                              {l.endDate ? new Date(l.endDate).toLocaleDateString() : "—"}
                            </TableCell>
                            <TableCell sx={{ maxWidth: 220, wordBreak: "break-word" }}>
                              {l.reason || "—"}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={l.status}
                                color={statusColor(l.status) as any}
                                size="small"
                                sx={{ fontWeight: 700 }}
                              />
                            </TableCell>
                            <TableCell sx={{ color: "text.secondary", fontSize: "0.8125rem" }}>
                              {l.approvalNotes || "—"}
                            </TableCell>
                            <TableCell sx={{ textAlign: "right", whiteSpace: "nowrap" }}>
                              {l.status === "PENDING" ? (
                                <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    startIcon={<ThumbUpIcon />}
                                    onClick={() => handleApproveLeave(l.id)}
                                    sx={{ fontWeight: 700, textTransform: "none" }}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    startIcon={<ThumbDownIcon />}
                                    onClick={() => handleRejectLeave(l.id)}
                                    sx={{ fontWeight: 700, textTransform: "none" }}
                                  >
                                    Reject
                                  </Button>
                                </Box>
                              ) : (
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                  Completed
                                </Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          )}

          {/* Leave Quota Balances Summary */}
          {!loadingBalances && leaveBalances.length > 0 && (
            <Card
              sx={{
                borderRadius: tokens.borderRadius.lg,
                border: `1px solid ${tokens.colors.secondary[200]}`,
                p: 3,
                mt: 1,
              }}
            >
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                Configured Staff Leave Quotas & Allocation
              </Typography>
              <TableContainer sx={{ overflowX: "auto" }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: tokens.colors.secondary[50] }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Leave Category</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Year</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Allocated</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Used Days</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Remaining Days</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaveBalances.map((b) => (
                      <TableRow key={b.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{b.employeeName || `#${b.employeeId}`}</TableCell>
                        <TableCell>{b.leaveType}</TableCell>
                        <TableCell>{b.year}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{b.totalAllocated} days</TableCell>
                        <TableCell sx={{ color: "text.secondary" }}>{b.usedDays} days</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: tokens.colors.primary.main }}>
                          {b.remainingDays} days
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
                placeholder={editingEmployee ? "Leave blank to keep unchanged" : "Set password or leave blank to auto-generate"}
                value={employeeFormData.password}
                onChange={(e) => setEmployeeFormData({ ...employeeFormData, password: e.target.value })}
                helperText={
                  editingEmployee
                    ? "Leave blank to preserve current password"
                    : "Leave blank to auto-generate a secure password. Credentials will be automatically emailed to the employee from noreply@webliix.com."
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
                  <MenuItem value="PERMANENT">Permanent</MenuItem>
                  <MenuItem value="PART_TIME">Part Time</MenuItem>
                  <MenuItem value="CONTRACT">Contract</MenuItem>
                  <MenuItem value="INTERN">Intern</MenuItem>
                  <MenuItem value="FREELANCER">Freelancer</MenuItem>
                  <MenuItem value="PROBATION">Probation</MenuItem>
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

      {/* ==================== PORTAL ACCESS & CREDENTIALS DIALOG ==================== */}
      <Dialog
        open={accessModalOpen}
        onClose={() => setAccessModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: tokens.borderRadius.lg } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
          <VpnKeyIcon color="primary" />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Employee Portal Access & Credentials
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Provision, reset passwords, and manage self-service portal permissions
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedEmpForAccess && (
            <Box component="form" onSubmit={handleSaveAccess} sx={{ display: "grid", gap: 2.5, pt: 1 }}>
              {/* Employee Summary Card */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: "action.hover",
                  borderRadius: tokens.borderRadius.md,
                  border: `1px solid ${tokens.colors.secondary[200]}`,
                  display: "grid",
                  gap: 1,
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {selectedEmpForAccess.firstName} {selectedEmpForAccess.lastName}
                  </Typography>
                  <Chip
                    size="small"
                    label={selectedEmpForAccess.hasLoginAccount ? "Login Active" : "No Account"}
                    color={selectedEmpForAccess.hasLoginAccount ? "primary" : "default"}
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Code: <strong>{selectedEmpForAccess.employeeCode}</strong> | Email: <strong>{selectedEmpForAccess.email}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Department: <strong>{selectedEmpForAccess.departmentName || "Unassigned"}</strong> | Designation: <strong>{selectedEmpForAccess.designationName || "Unassigned"}</strong>
                </Typography>
              </Box>

              {/* Status Switch */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 1 }}>
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    Portal & System Access
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Enable or disable the employee's active status and portal access
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={accessEnabled}
                      onChange={(e) => setAccessEnabled(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={accessEnabled ? "Active" : "Disabled"}
                  sx={{ m: 0 }}
                />
              </Box>

              {/* Password Management */}
              <Box sx={{ display: "grid", gap: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  {selectedEmpForAccess.hasLoginAccount ? "Reset Portal Password" : "Set Initial Portal Password"}
                </Typography>
                <TextField
                  type="password"
                  fullWidth
                  size="small"
                  label="Password"
                  placeholder={
                    selectedEmpForAccess.hasLoginAccount
                      ? "Leave blank to keep current password"
                      : "Enter a strong password (min 6 chars)"
                  }
                  value={accessPassword}
                  onChange={(e) => setAccessPassword(e.target.value)}
                  helperText={
                    selectedEmpForAccess.hasLoginAccount
                      ? "Provide a new password only if you wish to reset the employee's login credentials."
                      : "Setting a password creates a new portal account linked to this employee's email."
                  }
                />
              </Box>

              {/* Resource Allocation & Scoping Notice */}
              <Alert severity="info" sx={{ borderRadius: tokens.borderRadius.sm, fontSize: "0.85rem" }}>
                <strong>Role & Scoping Note:</strong> Staff access permissions and departmental scoping (Own, Department, All) are governed centrally via the <strong>Roles & Permissions Matrix</strong> tab under System Users. Resource items (Assigned Tickets, Project Tasks) are linked directly to this employee profile.
              </Alert>

              <DialogActions sx={{ px: 0, pt: 1 }}>
                <Button onClick={() => setAccessModalOpen(false)} color="inherit">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submittingAccess}
                >
                  {submittingAccess ? <CircularProgress size={20} /> : "Update Credentials & Access"}
                </Button>
              </DialogActions>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* ==================== MARK / ADJUST ATTENDANCE DIALOG ==================== */}
      <Dialog
        open={markAttendanceModalOpen}
        onClose={() => setMarkAttendanceModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: tokens.borderRadius.lg } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
          <EventAvailableIcon color="primary" />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Mark / Adjust Attendance
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Record daily employee punch-in or adjust attendance status
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleSaveAttendance} sx={{ display: "grid", gap: 2.5, pt: 1 }}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Select Employee</InputLabel>
              <Select
                value={attendanceFormData.employeeId}
                label="Select Employee"
                onChange={(e) => setAttendanceFormData({ ...attendanceFormData, employeeId: e.target.value })}
              >
                {employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.employeeCode})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <TextField
                label="Attendance Date"
                type="date"
                size="small"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={attendanceFormData.attendanceDate}
                onChange={(e) => setAttendanceFormData({ ...attendanceFormData, attendanceDate: e.target.value })}
              />
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={attendanceFormData.status}
                  label="Status"
                  onChange={(e) => setAttendanceFormData({ ...attendanceFormData, status: e.target.value })}
                >
                  <MenuItem value="PRESENT">PRESENT</MenuItem>
                  <MenuItem value="ABSENT">ABSENT</MenuItem>
                  <MenuItem value="HALF_DAY">HALF DAY</MenuItem>
                  <MenuItem value="ON_LEAVE">ON LEAVE</MenuItem>
                  <MenuItem value="LATE">LATE</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <TextField
                label="Check-In Time"
                type="time"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={attendanceFormData.checkInTime}
                onChange={(e) => setAttendanceFormData({ ...attendanceFormData, checkInTime: e.target.value })}
              />
              <TextField
                label="Check-Out Time"
                type="time"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={attendanceFormData.checkOutTime}
                onChange={(e) => setAttendanceFormData({ ...attendanceFormData, checkOutTime: e.target.value })}
              />
            </Box>

            <TextField
              label="Notes / Justification"
              multiline
              rows={2}
              fullWidth
              size="small"
              placeholder="e.g. Approved remote work, manual override, late transit"
              value={attendanceFormData.notes}
              onChange={(e) => setAttendanceFormData({ ...attendanceFormData, notes: e.target.value })}
            />

            <DialogActions sx={{ px: 0, pt: 1 }}>
              <Button onClick={() => setMarkAttendanceModalOpen(false)} color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={submittingAttendance}>
                {submittingAttendance ? <CircularProgress size={20} /> : "Save Attendance"}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      {/* ==================== CONFIGURE LEAVE QUOTA DIALOG ==================== */}
      <Dialog
        open={quotaModalOpen}
        onClose={() => setQuotaModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: tokens.borderRadius.lg } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
          <FactCheckIcon color="primary" />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Configure Leave Quota
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Allocate annual leave allowances for employees
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleSaveQuota} sx={{ display: "grid", gap: 2.5, pt: 1 }}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Select Employee</InputLabel>
              <Select
                value={quotaFormData.employeeId}
                label="Select Employee"
                onChange={(e) => setQuotaFormData({ ...quotaFormData, employeeId: e.target.value })}
              >
                {employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.employeeCode})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Leave Type</InputLabel>
                <Select
                  value={quotaFormData.leaveType}
                  label="Leave Type"
                  onChange={(e) => setQuotaFormData({ ...quotaFormData, leaveType: e.target.value })}
                >
                  <MenuItem value="CASUAL">Casual Leave</MenuItem>
                  <MenuItem value="SICK">Sick Leave</MenuItem>
                  <MenuItem value="ANNUAL">Annual Leave</MenuItem>
                  <MenuItem value="MATERNITY">Maternity Leave</MenuItem>
                  <MenuItem value="UNPAID">Unpaid Leave</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Year"
                type="number"
                size="small"
                fullWidth
                required
                value={quotaFormData.year}
                onChange={(e) => setQuotaFormData({ ...quotaFormData, year: Number(e.target.value) })}
              />
            </Box>

            <TextField
              label="Allocated Days"
              type="number"
              size="small"
              fullWidth
              required
              inputProps={{ min: 0, step: 0.5 }}
              value={quotaFormData.totalAllocated}
              onChange={(e) => setQuotaFormData({ ...quotaFormData, totalAllocated: Number(e.target.value) })}
              helperText="Annual quota credited for this leave category"
            />

            <DialogActions sx={{ px: 0, pt: 1 }}>
              <Button onClick={() => setQuotaModalOpen(false)} color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={submittingQuota}>
                {submittingQuota ? <CircularProgress size={20} /> : "Save Quota"}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      {/* ==================== MANAGE ROLES & PERMISSIONS DIALOG ==================== */}
      <Dialog
        open={permsModalOpen}
        onClose={() => setPermsModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: tokens.borderRadius.lg } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
          <AdminPanelSettingsIcon color="primary" />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Employee Permissions & Roles Management
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Configure system roles, access scoping, and granular capability overrides
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {loadingPermsData ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : selectedEmpForPerms ? (
            <Box sx={{ display: "grid", gap: 3, pt: 1 }}>
              {/* Employee Summary Card */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: "action.hover",
                  borderRadius: tokens.borderRadius.md,
                  border: `1px solid ${tokens.colors.secondary[200]}`,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1.5,
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {selectedEmpForPerms.firstName} {selectedEmpForPerms.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedEmpForPerms.employeeCode} &bull; {selectedEmpForPerms.email} &bull; {selectedEmpForPerms.departmentName || "General Staff"}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label={selectedEmpForPerms.userId ? `User ID #${selectedEmpForPerms.userId}` : "No Login Profile"}
                  color={selectedEmpForPerms.userId ? "primary" : "warning"}
                  variant="outlined"
                />
              </Box>

              {!selectedEmpForPerms.userId && (
                <Alert severity="warning">
                  This employee does not have a linked user account. Please open the "Portal Access" key icon in the directory to set credentials before roles and overrides can take effect.
                </Alert>
              )}

              {/* Roles Multi-Select Card */}
              <Card variant="outlined" sx={{ p: 2.5, borderRadius: tokens.borderRadius.md }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                      Assigned System Roles
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Roles assign grouped bundles of permissions automatically
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    disabled={!selectedEmpForPerms.userId || savingRoles}
                    onClick={handleSaveUserRoles}
                  >
                    {savingRoles ? <CircularProgress size={16} /> : "Save Roles"}
                  </Button>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                  {allRoles.map((role) => {
                    const isChecked = selectedRoleNames.includes(role.name);
                    return (
                      <FormControlLabel
                        key={role.id}
                        control={
                          <Checkbox
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRoleNames((prev) => [...prev, role.name]);
                              } else {
                                setSelectedRoleNames((prev) => prev.filter((r) => r !== role.name));
                              }
                            }}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {role.name}
                            </Typography>
                            {role.description && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                {role.description}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    );
                  })}
                </Box>
              </Card>

              {/* Direct Overrides Card */}
              <Card variant="outlined" sx={{ p: 2.5, borderRadius: tokens.borderRadius.md }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                  Granular Permission Overrides
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                  Explicitly grant specific capabilities and scopes to this user on top of their roles
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr auto" },
                    gap: 1.5,
                    alignItems: "center",
                    mb: 2.5,
                  }}
                >
                  <FormControl fullWidth size="small">
                    <InputLabel>Select Permission</InputLabel>
                    <Select
                      value={overridePermId}
                      label="Select Permission"
                      onChange={(e) => setOverridePermId(e.target.value)}
                    >
                      {Object.entries(permissionCatalog).flatMap(([mod, perms]) =>
                        perms.map((p) => (
                          <MenuItem key={p.id} value={p.id}>
                            [{mod}] {p.code || p.name} - {p.description || p.code || p.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel>Access Scope</InputLabel>
                    <Select
                      value={overrideScope}
                      label="Access Scope"
                      onChange={(e) => setOverrideScope(e.target.value)}
                    >
                      <MenuItem value="ALL">ALL (Company Wide)</MenuItem>
                      <MenuItem value="DEPARTMENT">DEPARTMENT (Departmental)</MenuItem>
                      <MenuItem value="OWN">OWN (Self Only)</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    variant="outlined"
                    color="primary"
                    disabled={!selectedEmpForPerms.userId || !overridePermId || savingOverride}
                    onClick={handleAddOverride}
                    sx={{ height: 40 }}
                  >
                    {savingOverride ? <CircularProgress size={16} /> : "Grant Override"}
                  </Button>
                </Box>

                {/* Overrides Table */}
                <TableContainer sx={{ border: `1px solid ${tokens.colors.secondary[200]}`, borderRadius: tokens.borderRadius.sm, maxHeight: 240, overflowX: "auto" }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Permission</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Module</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Scope</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userOverrides.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 3, color: "text.secondary" }}>
                            No custom permission overrides defined. Roles govern access.
                          </TableCell>
                        </TableRow>
                      ) : (
                        userOverrides.map((ov) => (
                          <TableRow key={ov.id}>
                            <TableCell sx={{ fontWeight: 600 }}>{ov.permission?.code || ov.permission?.name || `Perm #${ov.id}`}</TableCell>
                            <TableCell>
                              <Chip size="small" label={ov.permission?.module || "GENERAL"} variant="outlined" />
                            </TableCell>
                            <TableCell>
                              <Chip
                                size="small"
                                label={ov.scope}
                                color={ov.scope === "ALL" ? "primary" : ov.scope === "DEPARTMENT" ? "secondary" : "default"}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip size="small" label={ov.granted ? "GRANTED" : "REVOKED"} color={ov.granted ? "success" : "error"} />
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteOverride(ov.permission?.id || ov.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setPermsModalOpen(false)} color="inherit">
            Close
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
