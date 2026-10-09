import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HourglassTopOutlinedIcon from "@mui/icons-material/HourglassTopOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import { PageLayout } from "@/shared/components/ui/layout";
import { BrandLoader } from "@/shared/components/ui/feedback/BrandLoader";
import {
  expenseApi,
  type ExpenseItem,
  type CreateExpensePayload,
  type ExpenseStatistics,
} from "../api/expenseApi";

const CATEGORIES = [
  { value: "ALL", label: "All Categories" },
  { value: "OFFICE", label: "Office Supplies" },
  { value: "SOFTWARE", label: "Software & SaaS" },
  { value: "MARKETING", label: "Marketing & Ads" },
  { value: "HOSTING", label: "Cloud & Hosting" },
  { value: "TRAVEL", label: "Travel & Fuel" },
  { value: "HARDWARE", label: "Hardware & Devices" },
  { value: "SALARY", label: "Contract & Payroll" },
  { value: "OTHER", label: "Miscellaneous / Other" },
];

const PAYMENT_METHODS = [
  { value: "BANK_TRANSFER", label: "Bank Transfer / Wire" },
  { value: "UPI", label: "UPI / Digital Wallet" },
  { value: "CREDIT_CARD", label: "Credit Card" },
  { value: "DEBIT_CARD", label: "Debit Card" },
  { value: "CASH", label: "Cash" },
  { value: "CHEQUE", label: "Cheque" },
  { value: "PAYPAL", label: "PayPal" },
  { value: "OTHER", label: "Other" },
];

const categoryColor = (cat: string) => {
  switch (cat) {
    case "SOFTWARE":
    case "HOSTING":
      return { bgcolor: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" };
    case "MARKETING":
      return { bgcolor: "#fdf4ff", color: "#c026d3", border: "1px solid #f5d0fe" };
    case "OFFICE":
      return { bgcolor: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" };
    case "TRAVEL":
      return { bgcolor: "#fffbeb", color: "#d97706", border: "1px solid #fde68a" };
    case "SALARY":
      return { bgcolor: "#f5f3ff", color: "#7c3aed", border: "1px solid #ddd6fe" };
    case "HARDWARE":
      return { bgcolor: "#f8fafc", color: "#475569", border: "1px solid #cbd5e1" };
    default:
      return { bgcolor: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" };
  }
};

const statusColor = (st: string) => {
  switch (st) {
    case "APPROVED":
      return { color: "success" as const, bg: "#ecfdf5", border: "#a7f3d0", text: "#065f46" };
    case "PAID":
      return { color: "primary" as const, bg: "#eff6ff", border: "#bfdbfe", text: "#1e40af" };
    case "PENDING":
      return { color: "warning" as const, bg: "#fffbeb", border: "#fde68a", text: "#92400e" };
    case "REJECTED":
      return { color: "error" as const, bg: "#fef2f2", border: "#fecaca", text: "#991b1b" };
    default:
      return { color: "default" as const, bg: "#f8fafc", border: "#e2e8f0", text: "#475569" };
  }
};

export default function ExpenseListPage() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [stats, setStats] = useState<ExpenseStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Create Modal State
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [submittingCreate, setSubmittingCreate] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState<CreateExpensePayload>({
    title: "",
    category: "OFFICE",
    amount: 0,
    expenseDate: new Date().toISOString().split("T")[0],
    paymentMethod: "BANK_TRANSFER",
    vendor: "",
    status: "APPROVED",
    referenceNumber: "",
    notes: "",
  });

  // Edit Modal State
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
  const [editingExpenseNumber, setEditingExpenseNumber] = useState<string>("");
  const [submittingEdit, setSubmittingEdit] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<CreateExpensePayload>({
    title: "",
    category: "OFFICE",
    amount: 0,
    expenseDate: "",
    paymentMethod: "BANK_TRANSFER",
    vendor: "",
    status: "APPROVED",
    referenceNumber: "",
    notes: "",
  });

  // Delete Modal State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deletingExpense, setDeletingExpense] = useState<ExpenseItem | null>(null);
  const [submittingDelete, setSubmittingDelete] = useState<boolean>(false);

  const loadData = () => {
    setLoading(true);
    setError(null);

    const categoryParam = selectedCategory !== "ALL" ? selectedCategory : undefined;
    const statusParam = selectedStatus !== "ALL" ? selectedStatus : undefined;
    const keywordParam = searchQuery.trim() ? searchQuery.trim() : undefined;

    Promise.all([
      expenseApi.getExpenses({
        category: categoryParam,
        status: statusParam,
        keyword: keywordParam,
        size: 100,
      }),
      expenseApi.getExpenseStatistics(),
    ])
      .then(([resExpenses, resStats]) => {
        setExpenses(resExpenses.content);
        setStats(resStats);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load expenses. Please check backend connection.");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleOpenCreate = () => {
    setCreateForm({
      title: "",
      category: "OFFICE",
      amount: 0,
      expenseDate: new Date().toISOString().split("T")[0],
      paymentMethod: "BANK_TRANSFER",
      vendor: "",
      status: "APPROVED",
      referenceNumber: "",
      notes: "",
    });
    setCreateError(null);
    setCreateDialogOpen(true);
  };

  const handleCreateSubmit = async () => {
    if (!createForm.title.trim()) {
      setCreateError("Expense title or reason is required.");
      return;
    }
    if (!createForm.amount || Number(createForm.amount) <= 0) {
      setCreateError("Please enter a valid expense amount greater than 0.");
      return;
    }

    setSubmittingCreate(true);
    setCreateError(null);
    try {
      const res = await expenseApi.createExpense({
        ...createForm,
        amount: Number(createForm.amount),
      });
      if (res) {
        setCreateDialogOpen(false);
        loadData();
      } else {
        setCreateError("Failed to record expense.");
      }
    } catch (err: any) {
      setCreateError(err?.response?.data?.message || "Failed to record expense.");
    } finally {
      setSubmittingCreate(false);
    }
  };

  const handleOpenEdit = (item: ExpenseItem) => {
    setEditingExpenseId(item.id);
    setEditingExpenseNumber(item.expenseNumber);
    setEditForm({
      title: item.title || item.description || "",
      category: item.category || "OFFICE",
      amount: item.amount || 0,
      expenseDate: item.expenseDate ? item.expenseDate.split("T")[0] : "",
      paymentMethod: item.paymentMethod || "BANK_TRANSFER",
      vendor: item.vendor || "",
      status: item.status || "APPROVED",
      referenceNumber: item.referenceNumber || "",
      notes: item.notes || item.description || "",
    });
    setEditError(null);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingExpenseId) return;
    if (!editForm.title.trim()) {
      setEditError("Expense title is required.");
      return;
    }
    if (!editForm.amount || Number(editForm.amount) <= 0) {
      setEditError("Please enter a valid expense amount greater than 0.");
      return;
    }

    setSubmittingEdit(true);
    setEditError(null);
    try {
      const res = await expenseApi.updateExpense(editingExpenseId, {
        ...editForm,
        amount: Number(editForm.amount),
      });
      if (res) {
        setEditDialogOpen(false);
        setEditingExpenseId(null);
        loadData();
      } else {
        setEditError("Failed to update expense.");
      }
    } catch (err: any) {
      setEditError(err?.response?.data?.message || "Failed to update expense.");
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleOpenDelete = (item: ExpenseItem) => {
    setDeletingExpense(item);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingExpense) return;
    setSubmittingDelete(true);
    try {
      const success = await expenseApi.deleteExpense(deletingExpense.id);
      if (success) {
        setDeleteDialogOpen(false);
        setDeletingExpense(null);
        loadData();
      } else {
        alert("Failed to delete expense record.");
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete expense record.");
    } finally {
      setSubmittingDelete(false);
    }
  };

  const handleQuickStatusChange = async (item: ExpenseItem, newStatus: string) => {
    try {
      await expenseApi.updateExpenseStatus(item.id, newStatus);
      setExpenses((prev) =>
        prev.map((e) => (e.id === item.id ? { ...e, status: newStatus } : e))
      );
      expenseApi.getExpenseStatistics().then(setStats);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update status.");
    }
  };

  return (
    <PageLayout
      title="Expense Management"
      subtitle="Track corporate expenditures, SaaS tools, vendor bills, reimbursements, and operational budgets"
      actions={
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshOutlinedIcon />}
            onClick={loadData}
            sx={{ fontWeight: "bold" }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{ fontWeight: "bold" }}
          >
            Record New Expense
          </Button>
        </Box>
      }
    >
      {/* KPI Cards */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 2.5, mb: 3 }}>
        <Card variant="outlined" sx={{ borderRadius: 2, border: "1px solid #e2e8f0" }}>
          <CardContent sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.25, borderRadius: "10px", bgcolor: "#eff6ff", color: "#2563eb", display: "flex" }}>
              <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="caption" fontWeight="bold" color="text.secondary" textTransform="uppercase">
                Total Expenses
              </Typography>
              <Typography variant="h5" fontWeight="800" sx={{ mt: 0.25, color: "#0f172a" }}>
                ₹{(stats?.totalExpenses || 0).toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 2, border: "1px solid #e2e8f0" }}>
          <CardContent sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.25, borderRadius: "10px", bgcolor: "#fdf4ff", color: "#c026d3", display: "flex" }}>
              <CalendarTodayOutlinedIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="caption" fontWeight="bold" color="text.secondary" textTransform="uppercase">
                Month-To-Date Spend
              </Typography>
              <Typography variant="h5" fontWeight="800" sx={{ mt: 0.25, color: "#c026d3" }}>
                ₹{(stats?.monthToDateExpenses || 0).toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 2, border: "1px solid #e2e8f0" }}>
          <CardContent sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.25, borderRadius: "10px", bgcolor: "#ecfdf5", color: "#10b981", display: "flex" }}>
              <CheckCircleOutlinedIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="caption" fontWeight="bold" color="text.secondary" textTransform="uppercase">
                Approved & Paid
              </Typography>
              <Typography variant="h5" fontWeight="800" sx={{ mt: 0.25, color: "#10b981" }}>
                ₹{(stats?.approvedExpenses || 0).toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 2, border: "1px solid #e2e8f0" }}>
          <CardContent sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.25, borderRadius: "10px", bgcolor: "#fffbeb", color: "#f59e0b", display: "flex" }}>
              <HourglassTopOutlinedIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="caption" fontWeight="bold" color="text.secondary" textTransform="uppercase">
                Pending Verification
              </Typography>
              <Typography variant="h5" fontWeight="800" sx={{ mt: 0.25, color: "#f59e0b" }}>
                ₹{(stats?.pendingExpenses || 0).toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Filters and Search Bar */}
      <Card variant="outlined" sx={{ borderRadius: 2, p: 2, mb: 3, border: "1px solid #e2e8f0" }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: "flex", gap: 1.5, flex: 1, minWidth: 280 }}>
            <TextField
              size="small"
              placeholder="Search by title, expense #, vendor, or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained" sx={{ px: 2.5, fontWeight: "bold" }}>
              Search
            </Button>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <TextField
              select
              size="small"
              label="Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              sx={{ minWidth: 170 }}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              label="Status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="ALL">All Statuses</MenuItem>
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="PAID">Paid</MenuItem>
              <MenuItem value="PENDING">Pending Review</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </TextField>
          </Box>
        </Box>
      </Card>

      {/* Table Content */}
      {loading ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <BrandLoader message="Loading corporate expense entries..." size="medium" />
        </Box>
      ) : error ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Alert severity="error" sx={{ maxWidth: 500, mx: "auto" }}>
            {error}
          </Alert>
        </Box>
      ) : expenses.length === 0 ? (
        <Card variant="outlined" sx={{ borderRadius: 2, p: 6, textAlign: "center", border: "1px dashed #cbd5e1" }}>
          <ReceiptLongOutlinedIcon sx={{ fontSize: 56, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            No Expense Records Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 440, mx: "auto", mb: 3 }}>
            There are no recorded company expenditures matching your criteria. Click &quot;Record New Expense&quot; to add your first expense entry.
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate} sx={{ fontWeight: "bold" }}>
            Record First Expense
          </Button>
        </Card>
      ) : (
        <Card variant="outlined" sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid #e2e8f0" }}>
          <TableContainer>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Expense #</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Title & Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Payment Method</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Vendor / Payee</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((item) => {
                  const catStyle = categoryColor(item.category);
                  const stStyle = statusColor(item.status);
                  return (
                    <TableRow key={item.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>
                        {item.expenseNumber}
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: "#0f172a" }}>
                          {item.title || item.description || "Corporate Expense"}
                        </Typography>
                        {item.notes && item.notes !== item.title && (
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ maxWidth: 260 }}>
                            {item.notes}
                          </Typography>
                        )}
                        {item.referenceNumber && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            Ref: <strong>{item.referenceNumber}</strong>
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        <Box
                          component="span"
                          sx={{
                            display: "inline-block",
                            px: 1.25,
                            py: 0.25,
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            ...catStyle,
                          }}
                        >
                          {item.category}
                        </Box>
                      </TableCell>

                      <TableCell sx={{ fontWeight: "bold", fontSize: "0.95rem", color: "#0f172a" }}>
                        ₹{(item.amount || 0).toLocaleString()}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={item.paymentMethod ? item.paymentMethod.replace("_", " ") : "Bank"}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: "0.75rem", fontWeight: 600 }}
                        />
                      </TableCell>

                      <TableCell sx={{ fontWeight: 500, color: "text.secondary" }}>
                        {item.vendor || "Direct Payee"}
                      </TableCell>

                      <TableCell sx={{ color: "text.secondary", fontSize: "0.8125rem" }}>
                        {item.expenseDate ? new Date(item.expenseDate).toLocaleDateString() : "—"}
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: "inline-flex", alignItems: "center" }}>
                          <TextField
                            select
                            size="small"
                            value={item.status || "APPROVED"}
                            onChange={(e) => handleQuickStatusChange(item, e.target.value)}
                            sx={{
                              "& .MuiSelect-select": {
                                py: 0.4,
                                px: 1.2,
                                fontSize: "0.75rem",
                                fontWeight: "bold",
                                bgcolor: stStyle.bg,
                                color: stStyle.text,
                                border: `1px solid ${stStyle.border}`,
                                borderRadius: "6px",
                              },
                              "& fieldset": { border: "none" },
                            }}
                          >
                            <MenuItem value="APPROVED">Approved</MenuItem>
                            <MenuItem value="PAID">Paid</MenuItem>
                            <MenuItem value="PENDING">Pending</MenuItem>
                            <MenuItem value="REJECTED">Rejected</MenuItem>
                          </TextField>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ textAlign: "right" }}>
                        <Box sx={{ display: "flex", gap: 0.75, justifyContent: "flex-end", alignItems: "center" }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<EditNoteOutlinedIcon sx={{ fontSize: 16 }} />}
                            onClick={() => handleOpenEdit(item)}
                            sx={{
                              borderRadius: "6px",
                              textTransform: "none",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              px: 1.5,
                              py: 0.4,
                            }}
                          >
                            Edit
                          </Button>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOpenDelete(item)}
                            title="Delete Expense"
                            sx={{ border: "1px solid #fecaca", borderRadius: "6px", p: 0.5 }}
                          >
                            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Record New Expense Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => !submittingCreate && setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Record New Business Expense
        </DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {createError && <Alert severity="error">{createError}</Alert>}

          <TextField
            label="Expense Title / Description"
            required
            fullWidth
            size="small"
            placeholder="e.g. AWS Cloud Hosting Bill, Office Stationery, Team Lunch"
            value={createForm.title}
            onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
          />

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField
              label="Amount (₹)"
              type="number"
              required
              fullWidth
              size="small"
              value={createForm.amount}
              onChange={(e) => setCreateForm({ ...createForm, amount: Number(e.target.value) })}
            />
            <TextField
              select
              label="Expense Category"
              required
              fullWidth
              size="small"
              value={createForm.category}
              onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
            >
              {CATEGORIES.filter((c) => c.value !== "ALL").map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField
              label="Expense Date"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={createForm.expenseDate}
              onChange={(e) => setCreateForm({ ...createForm, expenseDate: e.target.value })}
            />
            <TextField
              select
              label="Payment Method"
              size="small"
              fullWidth
              value={createForm.paymentMethod}
              onChange={(e) => setCreateForm({ ...createForm, paymentMethod: e.target.value })}
            >
              {PAYMENT_METHODS.map((m) => (
                <MenuItem key={m.value} value={m.value}>
                  {m.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField
              label="Vendor / Payee / Merchant"
              size="small"
              fullWidth
              placeholder="e.g. Amazon Web Services, Staples, Uber"
              value={createForm.vendor}
              onChange={(e) => setCreateForm({ ...createForm, vendor: e.target.value })}
            />
            <TextField
              select
              label="Status"
              size="small"
              fullWidth
              value={createForm.status}
              onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
            >
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="PAID">Paid</MenuItem>
              <MenuItem value="PENDING">Pending Review</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </TextField>
          </Box>

          <TextField
            label="Transaction Ref / Invoice Number"
            size="small"
            fullWidth
            placeholder="e.g. INV-90421, UTR-8812739"
            value={createForm.referenceNumber}
            onChange={(e) => setCreateForm({ ...createForm, referenceNumber: e.target.value })}
          />

          <TextField
            label="Notes / Business Justification"
            multiline
            rows={2}
            size="small"
            fullWidth
            placeholder="e.g. Monthly cloud server renewal for production clusters"
            value={createForm.notes}
            onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCreateDialogOpen(false)} disabled={submittingCreate}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={submittingCreate || !createForm.title.trim() || Number(createForm.amount) <= 0}
            onClick={handleCreateSubmit}
            sx={{ fontWeight: "bold" }}
          >
            {submittingCreate ? "Recording..." : "Record Expense"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Expense Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => !submittingEdit && setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Edit Expense {editingExpenseNumber}
        </DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {editError && <Alert severity="error">{editError}</Alert>}

          <TextField
            label="Expense Title / Description"
            required
            fullWidth
            size="small"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
          />

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField
              label="Amount (₹)"
              type="number"
              required
              fullWidth
              size="small"
              value={editForm.amount}
              onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
            />
            <TextField
              select
              label="Expense Category"
              required
              fullWidth
              size="small"
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
            >
              {CATEGORIES.filter((c) => c.value !== "ALL").map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField
              label="Expense Date"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={editForm.expenseDate}
              onChange={(e) => setEditForm({ ...editForm, expenseDate: e.target.value })}
            />
            <TextField
              select
              label="Payment Method"
              size="small"
              fullWidth
              value={editForm.paymentMethod}
              onChange={(e) => setEditForm({ ...editForm, paymentMethod: e.target.value })}
            >
              {PAYMENT_METHODS.map((m) => (
                <MenuItem key={m.value} value={m.value}>
                  {m.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField
              label="Vendor / Payee / Merchant"
              size="small"
              fullWidth
              value={editForm.vendor}
              onChange={(e) => setEditForm({ ...editForm, vendor: e.target.value })}
            />
            <TextField
              select
              label="Status"
              size="small"
              fullWidth
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
            >
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="PAID">Paid</MenuItem>
              <MenuItem value="PENDING">Pending Review</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </TextField>
          </Box>

          <TextField
            label="Transaction Ref / Invoice Number"
            size="small"
            fullWidth
            value={editForm.referenceNumber}
            onChange={(e) => setEditForm({ ...editForm, referenceNumber: e.target.value })}
          />

          <TextField
            label="Notes / Business Justification"
            multiline
            rows={2}
            size="small"
            fullWidth
            value={editForm.notes}
            onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditDialogOpen(false)} disabled={submittingEdit}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={submittingEdit || !editForm.title.trim() || Number(editForm.amount) <= 0}
            onClick={handleEditSubmit}
            sx={{ fontWeight: "bold" }}
          >
            {submittingEdit ? "Saving..." : "Save Expense Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !submittingDelete && setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "error.main" }}>
          Delete Expense
        </DialogTitle>
        <DialogContent dividers>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to permanently delete expense record <strong>{deletingExpense?.expenseNumber}</strong>?
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Title: <strong>{deletingExpense?.title || deletingExpense?.description}</strong>
            <br />
            Amount: <strong>₹{(deletingExpense?.amount || 0).toLocaleString()}</strong>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={submittingDelete}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={submittingDelete}
            onClick={handleConfirmDelete}
            sx={{ fontWeight: "bold" }}
          >
            {submittingDelete ? "Deleting..." : "Delete Expense"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
}
