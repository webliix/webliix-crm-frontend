import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";

import AddIcon from "@mui/icons-material/Add";
import PaymentsIcon from "@mui/icons-material/Payments";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

import { PageLayout } from "@/shared/components/ui/layout";
import { BrandLoader } from "@/shared/components/ui/feedback/BrandLoader";
import { tokens } from "@/theme/tokens";
import { http } from "@/shared/services/http";

interface PayrollItem {
  id: number;
  employeeName?: string;
  employeeCode?: string;
  employee?: {
    id: number;
    employeeCode: string;
    firstName: string;
    lastName: string;
  };
  payrollMonth?: string;
  month?: number;
  year?: number;
  basicSalary?: number;
  grossSalary?: number;
  allowances?: number;
  deductions?: number;
  netSalary?: number;
  status: string;
  createdAt?: string;
}

interface AttendanceItem {
  id: number;
  employeeId?: number;
  employeeName?: string;
  employeeCode?: string;
  attendanceDate: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: string;
}

interface LeaveItem {
  id: number;
  employeeId?: number;
  employeeName?: string;
  employeeCode?: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason?: string;
  status: string;
}

const statusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "PAID":
    case "PROCESSED":
    case "APPROVED":
    case "PRESENT":
      return "success";
    case "PENDING":
    case "HALF_DAY":
      return "warning";
    case "CANCELLED":
    case "REJECTED":
    case "FAILED":
    case "ABSENT":
      return "error";
    default:
      return "default";
  }
};

export default function PayrollListPage() {
  const [currentTab, setCurrentTab] = useState(0);

  // Data states
  const [payrolls, setPayrolls] = useState<PayrollItem[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [leaves, setLeaves] = useState<LeaveItem[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  // Loading & Notifications
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; severity: "success" | "error" | "info" } | null>(null);

  // Generate Payroll Run Dialog
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [genEmployeeId, setGenEmployeeId] = useState<number | "">("");
  const [genMonth, setGenMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const [submittingGenerate, setSubmittingGenerate] = useState(false);

  // Mark Attendance Dialog
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [attEmployeeId, setAttEmployeeId] = useState<number | "">("");
  const [attDate, setAttDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [attStatus, setAttStatus] = useState("PRESENT");
  const [submittingAttendance, setSubmittingAttendance] = useState(false);

  // Action status
  const [actioningLeaveId, setActioningLeaveId] = useState<number | null>(null);

  const loadPayrollData = async () => {
    setLoading(true);
    try {
      const [payRes, dashRes] = await Promise.allSettled([
        http.get("/api/v1/payrolls", { params: { size: 100 } }),
        http.get("/api/v1/payrolls/dashboard"),
      ]);

      if (payRes.status === "fulfilled") {
        const data = payRes.value.data?.data?.content || payRes.value.data?.data || [];
        setPayrolls(Array.isArray(data) ? data : []);
      }
      if (dashRes.status === "fulfilled") {
        setDashboardStats(dashRes.value.data?.data || null);
      }
    } catch {
      setError("Failed to load payroll records.");
    } finally {
      setLoading(false);
    }
  };

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const res = await http.get("/api/v1/attendance", { params: { size: 100 } });
      const data = res.data?.data?.content || res.data?.data || [];
      setAttendance(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load attendance records.");
    } finally {
      setLoading(false);
    }
  };

  const loadLeaves = async () => {
    setLoading(true);
    try {
      const res = await http.get("/api/v1/leaves", { params: { size: 100 } });
      const data = res.data?.data?.content || res.data?.data || [];
      setLeaves(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load leave requests.");
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const res = await http.get("/api/v1/employees", { params: { size: 100 } });
      const data = res.data?.data?.content || res.data?.data || [];
      setEmployees(Array.isArray(data) ? data : []);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadPayrollData();
    loadEmployees();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    if (newValue === 0) loadPayrollData();
    if (newValue === 1) loadAttendance();
    if (newValue === 2) loadLeaves();
  };

  const handleGeneratePayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genEmployeeId) {
      setNotification({ message: "Please select an employee.", severity: "error" });
      return;
    }
    setSubmittingGenerate(true);
    try {
      await http.post("/api/v1/payrolls/generate", {
        employeeId: genEmployeeId,
        payrollMonth: genMonth,
      });
      setNotification({ message: `Payroll disbursement generated for ${genMonth}!`, severity: "success" });
      setGenerateModalOpen(false);
      setGenEmployeeId("");
      loadPayrollData();
    } catch (err: any) {
      setNotification({
        message: err.response?.data?.message || "Failed to generate payroll run.",
        severity: "error",
      });
    } finally {
      setSubmittingGenerate(false);
    }
  };

  const handleRecordAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attEmployeeId) {
      setNotification({ message: "Please select an employee.", severity: "error" });
      return;
    }
    setSubmittingAttendance(true);
    try {
      await http.post("/api/v1/attendance", {
        employeeId: attEmployeeId,
        attendanceDate: attDate,
        status: attStatus,
      });
      setNotification({ message: "Attendance logged successfully!", severity: "success" });
      setAttendanceModalOpen(false);
      loadAttendance();
    } catch (err: any) {
      setNotification({
        message: err.response?.data?.message || "Failed to log attendance.",
        severity: "error",
      });
    } finally {
      setSubmittingAttendance(false);
    }
  };

  const handleApproveLeave = async (id: number) => {
    setActioningLeaveId(id);
    try {
      await http.put(`/api/v1/leaves/${id}/approve`);
      setNotification({ message: "Leave request approved!", severity: "success" });
      setLeaves((prev) => prev.map((l) => (l.id === id ? { ...l, status: "APPROVED" } : l)));
    } catch (err: any) {
      setNotification({ message: err.response?.data?.message || "Failed to approve leave.", severity: "error" });
    } finally {
      setActioningLeaveId(null);
    }
  };

  const handleRejectLeave = async (id: number) => {
    setActioningLeaveId(id);
    try {
      await http.put(`/api/v1/leaves/${id}/reject`);
      setNotification({ message: "Leave request rejected.", severity: "info" });
      setLeaves((prev) => prev.map((l) => (l.id === id ? { ...l, status: "REJECTED" } : l)));
    } catch (err: any) {
      setNotification({ message: err.response?.data?.message || "Failed to reject leave.", severity: "error" });
    } finally {
      setActioningLeaveId(null);
    }
  };

  const selectedEmployeeObj = employees.find((e) => e.id === genEmployeeId);

  return (
    <PageLayout
      title="HR & Payroll Management"
      subtitle="Manage team salaries, monthly disbursements, attendance records, and leave requests"
      actions={
        currentTab === 0 ? (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setGenerateModalOpen(true)}
            sx={{ fontWeight: 700 }}
          >
            Generate Payroll Run
          </Button>
        ) : currentTab === 1 ? (
          <Button
            variant="contained"
            startIcon={<EventAvailableIcon />}
            onClick={() => setAttendanceModalOpen(true)}
            sx={{ fontWeight: 700 }}
          >
            Log Attendance
          </Button>
        ) : undefined
      }
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab icon={<PaymentsIcon />} iconPosition="start" label="Payroll Disbursements" sx={{ fontWeight: 700 }} />
          <Tab icon={<EventAvailableIcon />} iconPosition="start" label="Attendance Register" sx={{ fontWeight: 700 }} />
          <Tab icon={<TimeToLeaveIcon />} iconPosition="start" label="Leave Requests & Approvals" sx={{ fontWeight: 700 }} />
        </Tabs>
      </Box>

      {/* ==================== TAB 0: PAYROLL DISBURSEMENTS ==================== */}
      {currentTab === 0 && (
        <Box sx={{ display: "grid", gap: 3 }}>
          {/* KPI Dashboard Cards */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(4, 1fr)" }, gap: 2 }}>
            <Card sx={{ p: 2.5, borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}` }}>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>Total Disbursements</Typography>
              <Typography variant="h5" fontWeight={800} color="primary.main">
                {dashboardStats?.totalPayrolls != null ? dashboardStats.totalPayrolls : payrolls.length}
              </Typography>
            </Card>

            <Card sx={{ p: 2.5, borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}` }}>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>Gross Disbursed</Typography>
              <Typography variant="h5" fontWeight={800} color={tokens.colors.primary.main}>
                ₹{((dashboardStats?.totalGrossSalary || payrolls.reduce((sum, p) => sum + (p.grossSalary || p.basicSalary || 0), 0)) || 0).toLocaleString()}
              </Typography>
            </Card>

            <Card sx={{ p: 2.5, borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}` }}>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>Total Deductions</Typography>
              <Typography variant="h5" fontWeight={800} color="error.main">
                -₹{((dashboardStats?.totalDeductions || payrolls.reduce((sum, p) => sum + (p.deductions || 0), 0)) || 0).toLocaleString()}
              </Typography>
            </Card>

            <Card sx={{ p: 2.5, borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}` }}>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>Net Disbursed</Typography>
              <Typography variant="h5" fontWeight={800} color="success.main">
                ₹{((dashboardStats?.totalNetSalary || payrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0)) || 0).toLocaleString()}
              </Typography>
            </Card>
          </Box>

          {loading ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <BrandLoader message="Loading payroll disbursements..." size="medium" />
            </Box>
          ) : error ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <Typography color="error">{error}</Typography>
            </Box>
          ) : payrolls.length === 0 ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <Typography color="text.secondary">No payroll records found.</Typography>
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
                      <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Month / Year</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Gross Salary</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Deductions</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Net Disbursed</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payrolls.map((p) => {
                      const empName = p.employeeName || (p.employee ? `${p.employee.firstName} ${p.employee.lastName || ""}`.trim() : "Staff Member");
                      const empCode = p.employeeCode || p.employee?.employeeCode || "—";
                      const gross = p.grossSalary != null ? p.grossSalary : p.basicSalary || 0;
                      return (
                        <TableRow key={p.id} hover>
                          <TableCell sx={{ fontWeight: 700, color: tokens.colors.secondary[900] }}>
                            {empName}
                          </TableCell>
                          <TableCell sx={{ fontFamily: "monospace", color: tokens.colors.secondary[600] }}>
                            {empCode}
                          </TableCell>
                          <TableCell>
                            {p.payrollMonth || (p.month && p.year ? `${p.month}/${p.year}` : "—")}
                          </TableCell>
                          <TableCell>₹{gross.toLocaleString()}</TableCell>
                          <TableCell sx={{ color: "error.main" }}>
                            -₹{(p.deductions || 0).toLocaleString()}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 800, color: tokens.colors.success[700] }}>
                            ₹{(p.netSalary || 0).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={p.status}
                              color={statusColor(p.status) as any}
                              size="small"
                              sx={{ fontWeight: 700 }}
                            />
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

      {/* ==================== TAB 1: ATTENDANCE REGISTER ==================== */}
      {currentTab === 1 && (
        <Box sx={{ display: "grid", gap: 3 }}>
          {loading ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <BrandLoader message="Loading attendance register..." size="medium" />
            </Box>
          ) : attendance.length === 0 ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <Typography color="text.secondary">No attendance records logged yet.</Typography>
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
                      <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Check In</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Check Out</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendance.map((a) => (
                      <TableRow key={a.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{a.employeeName || "Staff Member"}</TableCell>
                        <TableCell sx={{ fontFamily: "monospace" }}>{a.employeeCode || "—"}</TableCell>
                        <TableCell>{a.attendanceDate ? new Date(a.attendanceDate).toLocaleDateString() : "—"}</TableCell>
                        <TableCell>{a.checkInTime ? new Date(a.checkInTime).toLocaleTimeString() : "09:00 AM"}</TableCell>
                        <TableCell>{a.checkOutTime ? new Date(a.checkOutTime).toLocaleTimeString() : "06:00 PM"}</TableCell>
                        <TableCell>
                          <Chip label={a.status} color={statusColor(a.status) as any} size="small" sx={{ fontWeight: 700 }} />
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

      {/* ==================== TAB 2: LEAVE REQUESTS ==================== */}
      {currentTab === 2 && (
        <Box sx={{ display: "grid", gap: 3 }}>
          {loading ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <BrandLoader message="Loading leave applications..." size="medium" />
            </Box>
          ) : leaves.length === 0 ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <Typography color="text.secondary">No leave requests currently pending.</Typography>
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
                      <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Leave Type</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Reason</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>Review Decision</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaves.map((l) => (
                      <TableRow key={l.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{l.employeeName || "Staff Member"}</TableCell>
                        <TableCell>
                          <Chip label={l.leaveType} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          {l.startDate ? new Date(l.startDate).toLocaleDateString() : "—"} to{" "}
                          {l.endDate ? new Date(l.endDate).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell sx={{ maxWidth: 220 }}>{l.reason || "—"}</TableCell>
                        <TableCell>
                          <Chip label={l.status} color={statusColor(l.status) as any} size="small" sx={{ fontWeight: 700 }} />
                        </TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          {l.status === "PENDING" && (
                            <Box sx={{ display: "inline-flex", gap: 1 }}>
                              <Tooltip title="Approve Leave">
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  startIcon={<CheckCircleIcon />}
                                  disabled={actioningLeaveId === l.id}
                                  onClick={() => handleApproveLeave(l.id)}
                                >
                                  Approve
                                </Button>
                              </Tooltip>
                              <Tooltip title="Reject Leave">
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  startIcon={<CancelIcon />}
                                  disabled={actioningLeaveId === l.id}
                                  onClick={() => handleRejectLeave(l.id)}
                                >
                                  Reject
                                </Button>
                              </Tooltip>
                            </Box>
                          )}
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

      {/* ==================== GENERATE PAYROLL MODAL ==================== */}
      <Dialog
        open={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: tokens.borderRadius.lg } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
          <AccountBalanceWalletIcon color="primary" />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Generate Payroll Run
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Calculate and disburse monthly employee salary based on employment contracts
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleGeneratePayroll} sx={{ display: "grid", gap: 2.5, pt: 1 }}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Select Employee</InputLabel>
              <Select
                value={genEmployeeId}
                label="Select Employee"
                onChange={(e) => setGenEmployeeId(Number(e.target.value))}
              >
                {employees.map((e) => (
                  <MenuItem key={e.id} value={e.id}>
                    {e.firstName} {e.lastName} ({e.employeeCode}) — Base: ₹{(e.salary || 0).toLocaleString()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              type="month"
              label="Payroll Disbursement Month"
              size="small"
              fullWidth
              required
              value={genMonth}
              onChange={(e) => setGenMonth(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            {selectedEmployeeObj && (
              <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 2, display: "grid", gap: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Employee Code:</Typography>
                  <Typography variant="body2" fontWeight={600}>{selectedEmployeeObj.employeeCode}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Base Contract Salary:</Typography>
                  <Typography variant="body2" fontWeight={700}>₹{(selectedEmployeeObj.salary || 0).toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Standard Deductions:</Typography>
                  <Typography variant="body2" color="text.secondary">₹0</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1" fontWeight={800}>Estimated Net Salary:</Typography>
                  <Typography variant="subtitle1" fontWeight={800} color="success.main">
                    ₹{(selectedEmployeeObj.salary || 0).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            )}

            <DialogActions sx={{ px: 0, pt: 1 }}>
              <Button onClick={() => setGenerateModalOpen(false)} color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={submittingGenerate}>
                {submittingGenerate ? <CircularProgress size={20} /> : "Disburse Payroll"}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      {/* ==================== LOG ATTENDANCE MODAL ==================== */}
      <Dialog
        open={attendanceModalOpen}
        onClose={() => setAttendanceModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: tokens.borderRadius.lg } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
          <EventAvailableIcon color="primary" />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Record Staff Attendance
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Manually register or adjust daily employee presence
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleRecordAttendance} sx={{ display: "grid", gap: 2.5, pt: 1 }}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Select Employee</InputLabel>
              <Select
                value={attEmployeeId}
                label="Select Employee"
                onChange={(e) => setAttEmployeeId(Number(e.target.value))}
              >
                {employees.map((e) => (
                  <MenuItem key={e.id} value={e.id}>
                    {e.firstName} {e.lastName} ({e.employeeCode})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              type="date"
              label="Attendance Date"
              size="small"
              fullWidth
              required
              value={attDate}
              onChange={(e) => setAttDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth size="small">
              <InputLabel>Attendance Status</InputLabel>
              <Select
                value={attStatus}
                label="Attendance Status"
                onChange={(e) => setAttStatus(e.target.value)}
              >
                <MenuItem value="PRESENT">Present (Full Day)</MenuItem>
                <MenuItem value="HALF_DAY">Half Day</MenuItem>
                <MenuItem value="ON_LEAVE">On Leave</MenuItem>
                <MenuItem value="ABSENT">Absent</MenuItem>
              </Select>
            </FormControl>

            <DialogActions sx={{ px: 0, pt: 1 }}>
              <Button onClick={() => setAttendanceModalOpen(false)} color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={submittingAttendance}>
                {submittingAttendance ? <CircularProgress size={20} /> : "Record Attendance"}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      {/* ==================== GLOBAL SNACKBAR ==================== */}
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
