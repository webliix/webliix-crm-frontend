import { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import SecurityIcon from "@mui/icons-material/Security";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LoginIcon from "@mui/icons-material/Login";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { PageLayout } from "@/shared/components/ui/layout";
import { BrandLoader } from "@/shared/components/ui/feedback/BrandLoader";
import { tokens } from "@/theme/tokens";
import { http } from "@/shared/services/http";

interface AuditLogItem {
  id: number;
  userId?: number;
  username: string;
  action: string;
  module: string;
  entityType?: string;
  entityId?: string;
  ipAddress?: string;
  status: string;
  createdAt: string;
}

interface AuditDashboardStats {
  todayActivities: number;
  failedActivities: number;
  loginsToday: number;
  exportsToday: number;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(20);
  const [totalElements, setTotalElements] = useState<number>(0);

  // Filters
  const [moduleFilter, setModuleFilter] = useState<string>("ALL");
  const [actionFilter, setActionFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Stats
  const [stats, setStats] = useState<AuditDashboardStats>({
    todayActivities: 0,
    failedActivities: 0,
    loginsToday: 0,
    exportsToday: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await http.get("/api/v1/audit/dashboard");
      const data = res.data?.data ?? res.data;
      if (data) {
        setStats({
          todayActivities: data.todayActivities ?? 0,
          failedActivities: data.failedActivities ?? 0,
          loginsToday: data.loginsToday ?? 0,
          exportsToday: data.exportsToday ?? 0,
        });
      }
    } catch {
      // Keep defaults
    }
  };

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload: any = {
        page,
        size,
        module: moduleFilter !== "ALL" ? moduleFilter : null,
        action: actionFilter !== "ALL" ? actionFilter : null,
        status: statusFilter !== "ALL" ? statusFilter : null,
        entityType: searchQuery.trim() ? searchQuery.trim() : null,
      };

      const res = await http.post("/api/v1/audit/logs", payload);
      const data = res.data?.data ?? res.data;

      if (Array.isArray(data)) {
        setLogs(data);
        setTotalElements(data.length);
      } else if (data?.content) {
        setLogs(data.content);
        setTotalElements(data.totalElements ?? data.content.length);
      } else {
        setLogs([]);
        setTotalElements(0);
      }
    } catch {
      setError("Failed to load audit logs. Please try again.");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, size, moduleFilter, actionFilter, statusFilter, searchQuery]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getActionColor = (action: string) => {
    if (!action) return "default";
    const act = action.toUpperCase();
    if (act.includes("DELETE") || act.includes("FAIL") || act.includes("REJECT")) return "error";
    if (act.includes("CREATE") || act.includes("SUCCESS") || act.includes("APPROVE")) return "success";
    if (act.includes("UPDATE") || act.includes("ASSIGN")) return "warning";
    if (act.includes("LOGIN") || act.includes("LOGOUT")) return "info";
    return "default";
  };

  return (
    <PageLayout
      title="System Audit & Security Logs"
      subtitle="Track security events, user access, administrative actions, and data modifications"
      actions={
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => {
            fetchStats();
            fetchLogs();
          }}
          sx={{ fontWeight: 700 }}
        >
          Refresh Logs
        </Button>
      }
    >
      {/* Metric Stat Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
          gap: 2.5,
          mb: 3,
        }}
      >
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: tokens.colors.primary[50], color: tokens.colors.primary.main }}>
              <ShieldOutlinedIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} color={tokens.colors.secondary[900]}>
                {stats.todayActivities}
              </Typography>
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                Today's Audit Events
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: tokens.colors.error[50], color: tokens.colors.error.main }}>
              <ErrorOutlineIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} color={tokens.colors.error.main}>
                {stats.failedActivities}
              </Typography>
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                Security / Failed Events
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: tokens.colors.info[50], color: tokens.colors.info.main }}>
              <LoginIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} color={tokens.colors.info.main}>
                {stats.loginsToday}
              </Typography>
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                User Logins Today
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: tokens.colors.success[50], color: tokens.colors.success.main }}>
              <FileDownloadOutlinedIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} color={tokens.colors.success.main}>
                {stats.exportsToday}
              </Typography>
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                Data Export Events
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Filter Toolbar */}
      <Card variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
          <TextField
            placeholder="Search by entity type or keyword..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            size="small"
            sx={{ minWidth: 260, flex: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            label="Module"
            value={moduleFilter}
            onChange={(e) => {
              setModuleFilter(e.target.value);
              setPage(0);
            }}
            size="small"
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="ALL">All Modules</MenuItem>
            <MenuItem value="AUTH">AUTH</MenuItem>
            <MenuItem value="CRM">CRM</MenuItem>
            <MenuItem value="CUSTOMER">CUSTOMER</MenuItem>
            <MenuItem value="PROJECT">PROJECT</MenuItem>
            <MenuItem value="FINANCE">FINANCE</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="PAYROLL">PAYROLL</MenuItem>
            <MenuItem value="TICKET">TICKET</MenuItem>
            <MenuItem value="NOTIFICATION">NOTIFICATION</MenuItem>
            <MenuItem value="AUTOMATION">AUTOMATION</MenuItem>
          </TextField>

          <TextField
            select
            label="Action"
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(0);
            }}
            size="small"
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="ALL">All Actions</MenuItem>
            <MenuItem value="CREATE">CREATE</MenuItem>
            <MenuItem value="UPDATE">UPDATE</MenuItem>
            <MenuItem value="DELETE">DELETE</MenuItem>
            <MenuItem value="LOGIN">LOGIN</MenuItem>
            <MenuItem value="LOGOUT">LOGOUT</MenuItem>
            <MenuItem value="APPROVE">APPROVE</MenuItem>
            <MenuItem value="REJECT">REJECT</MenuItem>
            <MenuItem value="ASSIGN">ASSIGN</MenuItem>
            <MenuItem value="GENERATE">GENERATE</MenuItem>
            <MenuItem value="EXPORT">EXPORT</MenuItem>
          </TextField>

          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            size="small"
            sx={{ minWidth: 130 }}
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            <MenuItem value="SUCCESS">SUCCESS</MenuItem>
            <MenuItem value="FAILED">FAILED</MenuItem>
          </TextField>
        </Box>
      </Card>

      {/* Main Table */}
      {loading ? (
        <Box sx={{ py: 8, textAlign: "center" }}>
          <BrandLoader message="Fetching audit & security logs..." size="medium" />
        </Box>
      ) : error ? (
        <Card variant="outlined" sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <Typography color="error" fontWeight={600}>
            {error}
          </Typography>
        </Card>
      ) : logs.length === 0 ? (
        <Card variant="outlined" sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} color={tokens.colors.secondary[800]}>
            No audit logs found matching criteria.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            System events will be logged here as users interact with the CRM.
          </Typography>
        </Card>
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
                  <TableCell sx={{ fontWeight: 700 }}>Timestamp</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Module</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Entity</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>IP Address</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((l) => (
                  <TableRow key={l.id} hover>
                    <TableCell sx={{ fontSize: "0.8125rem", color: "text.secondary", whiteSpace: "nowrap" }}>
                      {l.createdAt ? new Date(l.createdAt).toLocaleString() : "-"}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: tokens.colors.secondary[900] }}>
                      {l.username || (l.userId ? `User #${l.userId}` : "System")}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<SecurityIcon style={{ fontSize: 13 }} />}
                        label={l.action}
                        size="small"
                        color={getActionColor(l.action) as any}
                        sx={{ fontWeight: 700, fontSize: "0.75rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={l.module}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          bgcolor: tokens.colors.primary[50],
                          color: tokens.colors.primary.main,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: tokens.colors.secondary[800], fontSize: "0.8125rem" }}>
                      {l.entityType || "SYSTEM"}
                      {l.entityId ? ` #${l.entityId}` : ""}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: "0.8125rem", color: "text.secondary" }}>
                      {l.ipAddress || "-"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={l.status || "SUCCESS"}
                        size="small"
                        color={String(l.status).toUpperCase() === "SUCCESS" ? "success" : "error"}
                        sx={{ fontWeight: 700, fontSize: "0.72rem" }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={totalElements}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={size}
            onRowsPerPageChange={(e) => {
              setSize(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 20, 50, 100]}
          />
        </Card>
      )}
    </PageLayout>
  );
}

