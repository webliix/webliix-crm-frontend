import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { BrandLoader } from "@/shared/components/ui/feedback/BrandLoader";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HourglassTopOutlinedIcon from "@mui/icons-material/HourglassTopOutlined";
import AddIcon from "@mui/icons-material/Add";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import Divider from "@mui/material/Divider";
import { tokens } from "@/theme/tokens";
import { invoiceApi, type InvoiceItem } from "../api/invoiceApi";
import { customerService } from "@/modules/customers/services/customer.service";
import { projectApi, type ProjectItem } from "@/modules/projects/api/projectApi";
import type { CustomerResponse } from "@/modules/customers/types/customer.types";

export default function InvoiceListPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Create Invoice Dialog State
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | "">("");
  const [selectedProjectId, setSelectedProjectId] = useState<number | "">("");
  const [issueDate, setIssueDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState<string>("");
  const [invoiceItems, setInvoiceItems] = useState<{ itemName: string; description: string; quantity: number; unitPrice: number }[]>([
    { itemName: "Consulting & Deliverables", description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [submittingInvoice, setSubmittingInvoice] = useState<boolean>(false);
  const [createSuccessMsg, setCreateSuccessMsg] = useState<string | null>(null);

  // Edit Invoice Dialog State
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState<number | null>(null);
  const [editingInvoiceNumber, setEditingInvoiceNumber] = useState<string>("");
  const [editStatus, setEditStatus] = useState<string>("DRAFT");
  const [editPaidAmount, setEditPaidAmount] = useState<number>(0);
  const [editIssueDate, setEditIssueDate] = useState<string>("");
  const [editDueDate, setEditDueDate] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");
  const [editTax, setEditTax] = useState<number>(0);
  const [editDiscount, setEditDiscount] = useState<number>(0);
  const [editItems, setEditItems] = useState<{ itemName: string; description: string; quantity: number; unitPrice: number }[]>([]);
  const [submittingEdit, setSubmittingEdit] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete Invoice Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deletingInvoiceId, setDeletingInvoiceId] = useState<number | null>(null);
  const [deletingInvoiceNumber, setDeletingInvoiceNumber] = useState<string>("");
  const [deletingInvoice, setDeletingInvoice] = useState<boolean>(false);

  // Record Payment Dialog State
  const [paymentDialogOpen, setPaymentDialogOpen] = useState<boolean>(false);
  const [paymentInvoice, setPaymentInvoice] = useState<InvoiceItem | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("BANK_TRANSFER");
  const [paymentRef, setPaymentRef] = useState<string>("");
  const [paymentNotes, setPaymentNotes] = useState<string>("");
  const [submittingPayment, setSubmittingPayment] = useState<boolean>(false);

  // Preview / Print Official Invoice State
  const [previewInvoice, setPreviewInvoice] = useState<InvoiceItem | null>(null);

  const handleOpenPreview = async (inv: InvoiceItem) => {
    try {
      const details = await invoiceApi.getInvoice(inv.id);
      setPreviewInvoice(details || inv);
    } catch {
      setPreviewInvoice(inv);
    }
  };

  const handleOpenEdit = (inv: InvoiceItem) => {
    setEditingInvoiceId(inv.id);
    setEditingInvoiceNumber(inv.invoiceNumber);
    setEditStatus(inv.status || "DRAFT");
    setEditPaidAmount(inv.paidAmount || 0);
    setEditIssueDate(inv.issueDate ? inv.issueDate.split("T")[0] : "");
    setEditDueDate(inv.dueDate ? inv.dueDate.split("T")[0] : "");
    setEditNotes(inv.notes || "");
    setEditTax(0);
    setEditDiscount(0);
    setEditItems([
      { itemName: "Consulting & Deliverables", description: "", quantity: 1, unitPrice: inv.totalAmount || 0 },
    ]);
    setEditError(null);
    setEditDialogOpen(true);
  };

  const handleAddEditItem = () => {
    setEditItems((prev) => [...prev, { itemName: "", description: "", quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveEditItem = (index: number) => {
    setEditItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditItemChange = (index: number, field: string, val: any) => {
    setEditItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const handleSaveEdit = async () => {
    if (!editingInvoiceId) return;
    setSubmittingEdit(true);
    setEditError(null);
    try {
      const updated = await invoiceApi.updateInvoice(editingInvoiceId, {
        status: editStatus,
        paidAmount: Number(editPaidAmount) || 0,
        issueDate: editIssueDate || undefined,
        dueDate: editDueDate || undefined,
        notes: editNotes,
        taxAmount: Number(editTax) || 0,
        discountAmount: Number(editDiscount) || 0,
        items: editItems.map((item) => ({
          itemName: item.itemName || "Consulting & Services",
          description: item.description,
          quantity: Number(item.quantity) || 1,
          unitPrice: Number(item.unitPrice) || 0,
        })),
      });
      if (updated) {
        setEditDialogOpen(false);
        setEditingInvoiceId(null);
        loadData();
      } else {
        setEditError("Failed to update invoice.");
      }
    } catch (err: any) {
      setEditError(err?.response?.data?.message || "Failed to update invoice.");
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleOpenDelete = (inv: InvoiceItem) => {
    setDeletingInvoiceId(inv.id);
    setDeletingInvoiceNumber(inv.invoiceNumber);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingInvoiceId) return;
    setDeletingInvoice(true);
    try {
      const success = await invoiceApi.deleteInvoice(deletingInvoiceId);
      if (success) {
        setDeleteDialogOpen(false);
        setDeletingInvoiceId(null);
        loadData();
      } else {
        alert("Failed to delete invoice.");
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete invoice.");
    } finally {
      setDeletingInvoice(false);
    }
  };

  const loadData = () => {
    setLoading(true);
    Promise.all([
      invoiceApi.getInvoices(0, 100),
      customerService.getAllCustomers(),
      projectApi.getProjects(0, 100),
    ]).then(([resInv, resCust, resProj]) => {
      setInvoices(resInv.content);
      setCustomers(resCust);
      setProjects(resProj.content);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalBilling = invoices.reduce((sum, i) => sum + (i.totalAmount || 0), 0);
  const totalPaid = invoices.reduce((sum, i) => sum + (i.paidAmount || 0), 0);
  const totalPending = invoices.reduce((sum, i) => sum + (i.pendingAmount || 0), 0);

  const getStatusChip = (status: string) => {
    const st = (status || "").toUpperCase();
    if (st === "PAID") {
      return (
        <Chip
          icon={<CheckCircleOutlinedIcon style={{ fontSize: 14 }} />}
          label="Paid"
          size="small"
          sx={{ bgcolor: tokens.colors.success[100], color: tokens.colors.success[700], fontWeight: 700 }}
        />
      );
    }
    if (st === "PARTIALLY_PAID") {
      return (
        <Chip
          label="Partially Paid"
          size="small"
          sx={{ bgcolor: tokens.colors.primary[50], color: tokens.colors.primary.main, fontWeight: 700 }}
        />
      );
    }
    if (st === "PENDING" || st === "SENT") {
      return (
        <Chip
          icon={<HourglassTopOutlinedIcon style={{ fontSize: 14 }} />}
          label="Pending"
          size="small"
          sx={{ bgcolor: tokens.colors.warning[100], color: tokens.colors.warning[700], fontWeight: 700 }}
        />
      );
    }
    if (st === "OVERDUE") {
      return (
        <Chip
          label="Overdue"
          size="small"
          sx={{ bgcolor: tokens.colors.error[50], color: tokens.colors.error.main, fontWeight: 700 }}
        />
      );
    }
    return (
      <Chip
        label={status || "Draft"}
        size="small"
        sx={{ bgcolor: tokens.colors.secondary[200], color: tokens.colors.secondary[800], fontWeight: 600 }}
      />
    );
  };

  // Add Item to Invoice
  const handleAddItem = () => {
    setInvoiceItems((prev) => [...prev, { itemName: "", description: "", quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setInvoiceItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setInvoiceItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const invoiceSubtotal = invoiceItems.reduce((acc, it) => acc + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0);
  const invoiceTotal = Math.max(0, invoiceSubtotal + (Number(taxAmount) || 0) - (Number(discountAmount) || 0));

  const handleCreateInvoiceSubmit = async () => {
    if (!selectedCustomerId) {
      alert("Please select a customer.");
      return;
    }
    if (invoiceItems.length === 0 || invoiceItems.some((i) => !i.itemName.trim() || Number(i.unitPrice) <= 0)) {
      alert("Please ensure all items have a name and a positive unit price.");
      return;
    }

    setSubmittingInvoice(true);
    try {
      const res = await invoiceApi.createInvoice({
        customerId: Number(selectedCustomerId),
        projectId: selectedProjectId ? Number(selectedProjectId) : undefined,
        issueDate: issueDate || undefined,
        dueDate: dueDate || undefined,
        items: invoiceItems,
        taxAmount: Number(taxAmount) || 0,
        discountAmount: Number(discountAmount) || 0,
        notes,
      });
      if (res) {
        setCreateSuccessMsg("Invoice created successfully!");
        loadData();
        setTimeout(() => {
          setCreateDialogOpen(false);
          setCreateSuccessMsg(null);
          // reset fields
          setSelectedCustomerId("");
          setSelectedProjectId("");
          setInvoiceItems([{ itemName: "Deliverables", description: "", quantity: 1, unitPrice: 0 }]);
          setTaxAmount(0);
          setDiscountAmount(0);
          setNotes("");
        }, 1500);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to create invoice.");
    } finally {
      setSubmittingInvoice(false);
    }
  };

  const handleOpenRecordPayment = (inv: InvoiceItem) => {
    setPaymentInvoice(inv);
    setPaymentAmount(inv.pendingAmount || 0);
    setPaymentMethod("BANK_TRANSFER");
    setPaymentRef("");
    setPaymentNotes("");
    setPaymentDialogOpen(true);
  };

  const handleRecordPaymentSubmit = async () => {
    if (!paymentInvoice) return;
    if (Number(paymentAmount) <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }
    setSubmittingPayment(true);
    try {
      await invoiceApi.recordPayment(paymentInvoice.id, {
        amount: Number(paymentAmount),
        paymentMethod,
        referenceNumber: paymentRef,
        notes: paymentNotes,
      });
      loadData();
      setPaymentDialogOpen(false);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to record payment.");
    } finally {
      setSubmittingPayment(false);
    }
  };

  // Filter projects by customer if customer selected
  const availableProjects = selectedCustomerId
    ? projects.filter((p) => p.customerId === Number(selectedCustomerId) || p.customer?.id === Number(selectedCustomerId))
    : projects;

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      {/* Page Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color={tokens.colors.secondary[900]} gutterBottom>
            Invoices & Billing Hub
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage customer invoicing, project milestone billings, and payment settlements.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ fontWeight: "bold", px: 2.5, py: 1 }}
        >
          Create New Invoice
        </Button>
      </Box>

      {/* Summary KPI Cards */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 3, mb: 4 }}>
        <Card sx={{ borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}` }}>
          <CardContent sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: tokens.borderRadius.md, bgcolor: tokens.colors.primary[50], color: tokens.colors.primary.main }}>
              <AccountBalanceWalletOutlinedIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase">
                Total Invoiced
              </Typography>
              <Typography variant="h5" fontWeight={800} color={tokens.colors.secondary[900]}>
                ₹{totalBilling.toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}` }}>
          <CardContent sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: tokens.borderRadius.md, bgcolor: tokens.colors.success[50], color: tokens.colors.success.main }}>
              <CheckCircleOutlinedIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase">
                Total Paid
              </Typography>
              <Typography variant="h5" fontWeight={800} color={tokens.colors.success[700]}>
                ₹{totalPaid.toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}` }}>
          <CardContent sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: tokens.borderRadius.md, bgcolor: tokens.colors.warning[50], color: tokens.colors.warning.main }}>
              <HourglassTopOutlinedIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase">
                Pending Balance
              </Typography>
              <Typography variant="h5" fontWeight={800} color={tokens.colors.warning[700]}>
                ₹{totalPending.toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Invoice Table */}
      {loading ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <BrandLoader message="Loading invoices & billing history..." size="medium" />
        </Box>
      ) : invoices.length === 0 ? (
        <Card sx={{ borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}`, p: 6, textAlign: "center" }}>
          <ReceiptLongOutlinedIcon sx={{ fontSize: 56, color: tokens.colors.secondary[300], mb: 2 }} />
          <Typography variant="h6" fontWeight={700} color={tokens.colors.secondary[800]} gutterBottom>
            No Invoices Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You do not have any invoices generated yet. Click &quot;Create New Invoice&quot; to issue your first invoice.
          </Typography>
        </Card>
      ) : (
        <Card sx={{ borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}`, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: tokens.colors.secondary[50] }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Invoice #</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Customer / Company</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Project</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Issue Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Total Billed</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Paid</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Pending Due</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 700, color: tokens.colors.primary.main }}>
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {invoice.customer?.companyName || invoice.customer?.contactPerson || "Direct Client"}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: "text.secondary" }}>
                      {invoice.project?.projectName || "General Service"}
                    </TableCell>
                    <TableCell color="text.secondary">
                      {invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell color="text.secondary">
                      {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      ₹{(invoice.totalAmount || 0).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ color: tokens.colors.success[700], fontWeight: 600 }}>
                      ₹{(invoice.paidAmount || 0).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ color: (invoice.pendingAmount || 0) > 0 ? tokens.colors.warning[700] : "text.secondary", fontWeight: 600 }}>
                      ₹{(invoice.pendingAmount || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusChip(invoice.status)}</TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", alignItems: "center" }}>
                        {invoice.status !== "PAID" && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<PaymentOutlinedIcon />}
                            onClick={() => handleOpenRecordPayment(invoice)}
                            sx={{ fontWeight: "bold" }}
                          >
                            Record Payment
                          </Button>
                        )}
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityOutlinedIcon />}
                          onClick={() => handleOpenPreview(invoice)}
                          sx={{ fontWeight: "bold" }}
                        >
                          View / Print
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EditNoteOutlinedIcon />}
                          onClick={() => handleOpenEdit(invoice)}
                          sx={{ fontWeight: "bold" }}
                        >
                          Edit
                        </Button>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleOpenDelete(invoice)}
                          title="Delete Invoice"
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Create New Invoice Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => !submittingInvoice && setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Create & Issue New Invoice
        </DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {createSuccessMsg && <Alert severity="success">{createSuccessMsg}</Alert>}

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
            <TextField
              select
              label="Select Customer"
              required
              fullWidth
              size="small"
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value ? Number(e.target.value) : "")}
            >
              {customers.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.companyName} {c.contactPerson ? `(${c.contactPerson})` : ""}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Associated Project (Optional)"
              fullWidth
              size="small"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value ? Number(e.target.value) : "")}
            >
              <MenuItem value="">None / General Billing</MenuItem>
              {availableProjects.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.projectName} ({p.projectCode})
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
            <TextField
              label="Issue Date"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
            <TextField
              label="Due Date"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </Box>

          <Typography variant="subtitle2" fontWeight="bold">
            Invoice Items
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {invoiceItems.map((item, idx) => (
              <Box key={idx} sx={{ display: "flex", gap: 1, alignItems: "center", p: 1.5, border: 1, borderColor: "divider", borderRadius: 2 }}>
                <TextField
                  label="Item / Service Name"
                  size="small"
                  value={item.itemName}
                  onChange={(e) => handleItemChange(idx, "itemName", e.target.value)}
                  sx={{ flex: 2 }}
                />
                <TextField
                  label="Description"
                  size="small"
                  value={item.description}
                  onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                  sx={{ flex: 2 }}
                />
                <TextField
                  label="Qty"
                  type="number"
                  size="small"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))}
                  sx={{ width: 90 }}
                />
                <TextField
                  label="Unit Price (₹)"
                  type="number"
                  size="small"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(idx, "unitPrice", Number(e.target.value))}
                  sx={{ width: 120 }}
                />
                <Typography variant="body2" fontWeight="bold" sx={{ width: 100, textAlign: "right" }}>
                  ₹{((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)).toLocaleString()}
                </Typography>
                <IconButton size="small" color="error" onClick={() => handleRemoveItem(idx)} disabled={invoiceItems.length === 1}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            <Button startIcon={<AddIcon />} onClick={handleAddItem} sx={{ alignSelf: "flex-start", fontWeight: "bold" }}>
              Add Item
            </Button>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Tax Amount (₹)"
              type="number"
              size="small"
              value={taxAmount}
              onChange={(e) => setTaxAmount(Number(e.target.value))}
            />
            <TextField
              label="Discount Amount (₹)"
              type="number"
              size="small"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(Number(e.target.value))}
            />
          </Box>

          <TextField
            label="Payment Instructions / Notes"
            multiline
            rows={2}
            fullWidth
            size="small"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Box sx={{ p: 2, bgcolor: tokens.colors.primary[50], borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="subtitle1" fontWeight="bold" color={tokens.colors.primary.main}>
              Total Invoice Amount
            </Typography>
            <Typography variant="h5" fontWeight="bold" color={tokens.colors.primary.main}>
              ₹{invoiceTotal.toLocaleString()}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCreateDialogOpen(false)} disabled={submittingInvoice}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateInvoiceSubmit}
            disabled={submittingInvoice || !selectedCustomerId || invoiceTotal <= 0}
            startIcon={submittingInvoice ? <CircularProgress size={16} /> : <ReceiptLongOutlinedIcon />}
            sx={{ fontWeight: "bold" }}
          >
            {submittingInvoice ? "Generating..." : "Generate Invoice"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog
        open={paymentDialogOpen}
        onClose={() => !submittingPayment && setPaymentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Record Payment for Invoice {paymentInvoice?.invoiceNumber}
        </DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Total Invoice: <strong>₹{(paymentInvoice?.totalAmount || 0).toLocaleString()}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Already Paid: <strong>₹{(paymentInvoice?.paidAmount || 0).toLocaleString()}</strong>
            </Typography>
            <Typography variant="body2" fontWeight="bold" color="warning.main">
              Pending Balance: ₹{(paymentInvoice?.pendingAmount || 0).toLocaleString()}
            </Typography>
          </Box>

          <TextField
            label="Payment Amount (₹)"
            type="number"
            fullWidth
            size="small"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(Number(e.target.value))}
          />

          <TextField
            select
            label="Payment Method"
            fullWidth
            size="small"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <MenuItem value="BANK_TRANSFER">Bank Wire / NEFT / IMPS</MenuItem>
            <MenuItem value="CREDIT_CARD">Credit / Debit Card</MenuItem>
            <MenuItem value="UPI">UPI / Digital Wallet</MenuItem>
            <MenuItem value="CASH">Cash</MenuItem>
            <MenuItem value="CHEQUE">Cheque</MenuItem>
          </TextField>

          <TextField
            label="Transaction / Reference Number"
            fullWidth
            size="small"
            placeholder="e.g. UTR / Reference ID"
            value={paymentRef}
            onChange={(e) => setPaymentRef(e.target.value)}
          />

          <TextField
            label="Notes"
            multiline
            rows={2}
            fullWidth
            size="small"
            value={paymentNotes}
            onChange={(e) => setPaymentNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPaymentDialogOpen(false)} disabled={submittingPayment}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleRecordPaymentSubmit}
            disabled={submittingPayment || paymentAmount <= 0}
            startIcon={submittingPayment ? <CircularProgress size={16} /> : <PaymentOutlinedIcon />}
            sx={{ fontWeight: "bold" }}
          >
            {submittingPayment ? "Recording..." : "Confirm & Apply Payment"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Invoice Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => !submittingEdit && setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Edit Invoice {editingInvoiceNumber}
        </DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {editError && <Alert severity="error">{editError}</Alert>}

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField
              select
              label="Invoice Status"
              fullWidth
              size="small"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
            >
              <MenuItem value="DRAFT">Draft</MenuItem>
              <MenuItem value="SENT">Sent</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="PARTIALLY_PAID">Partially Paid</MenuItem>
              <MenuItem value="PAID">Paid</MenuItem>
              <MenuItem value="OVERDUE">Overdue</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </TextField>

            <TextField
              label="Recorded Paid Amount (₹)"
              type="number"
              fullWidth
              size="small"
              value={editPaidAmount}
              onChange={(e) => setEditPaidAmount(Number(e.target.value))}
            />
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField
              label="Issue Date"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={editIssueDate}
              onChange={(e) => setEditIssueDate(e.target.value)}
            />
            <TextField
              label="Due Date"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
            />
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField
              label="Tax Amount (₹)"
              type="number"
              size="small"
              value={editTax}
              onChange={(e) => setEditTax(Number(e.target.value))}
            />
            <TextField
              label="Discount Amount (₹)"
              type="number"
              size="small"
              value={editDiscount}
              onChange={(e) => setEditDiscount(Number(e.target.value))}
            />
          </Box>

          <Typography variant="subtitle2" fontWeight="bold">
            Invoice Line Items
          </Typography>

          {editItems.map((item, index) => (
            <Box key={index} sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <TextField
                placeholder="Item Description / Service"
                size="small"
                sx={{ flex: 3 }}
                value={item.itemName}
                onChange={(e) => handleEditItemChange(index, "itemName", e.target.value)}
              />
              <TextField
                placeholder="Qty"
                type="number"
                size="small"
                sx={{ flex: 1 }}
                value={item.quantity}
                onChange={(e) => handleEditItemChange(index, "quantity", Number(e.target.value))}
              />
              <TextField
                placeholder="Unit Price"
                type="number"
                size="small"
                sx={{ flex: 1.5 }}
                value={item.unitPrice}
                onChange={(e) => handleEditItemChange(index, "unitPrice", Number(e.target.value))}
              />
              <Typography variant="body2" fontWeight="bold" sx={{ minWidth: 70, textAlign: "right" }}>
                ₹{(item.quantity * item.unitPrice).toLocaleString()}
              </Typography>
              {editItems.length > 1 && (
                <IconButton size="small" color="error" onClick={() => handleRemoveEditItem(index)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))}

          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddEditItem}
            sx={{ alignSelf: "flex-start", fontWeight: "bold" }}
          >
            Add Item
          </Button>

          <TextField
            label="Notes & Terms"
            multiline
            rows={2}
            fullWidth
            size="small"
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditDialogOpen(false)} disabled={submittingEdit}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={submittingEdit}
            onClick={handleSaveEdit}
            sx={{ fontWeight: "bold" }}
          >
            {submittingEdit ? "Saving..." : "Save Invoice Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Invoice Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deletingInvoice && setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "error.main" }}>
          Delete Invoice
        </DialogTitle>
        <DialogContent dividers>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to delete invoice <strong>{deletingInvoiceNumber}</strong>?
          </Alert>
          <Typography variant="body2" color="text.secondary">
            This invoice will be permanently removed. Any associated payments will be safely unlinked.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deletingInvoice}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={deletingInvoice}
            onClick={handleConfirmDelete}
            sx={{ fontWeight: "bold" }}
          >
            {deletingInvoice ? "Deleting..." : "Delete Invoice"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Official Invoice Statement Preview & Print Dialog */}
      <Dialog
        open={Boolean(previewInvoice)}
        onClose={() => setPreviewInvoice(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          id: "printable-crm-invoice-modal",
          sx: {
            borderRadius: 2,
            "@media print": {
              boxShadow: "none",
              margin: 0,
              maxWidth: "100%",
              width: "100%",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e2e8f0",
            "@media print": { display: "none" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ReceiptLongOutlinedIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Official Tax Invoice — {previewInvoice?.invoiceNumber}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<PrintOutlinedIcon />}
              onClick={() => window.print()}
              sx={{ fontWeight: "bold" }}
            >
              Print / Save PDF
            </Button>
            <Button onClick={() => setPreviewInvoice(null)}>Close</Button>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          {previewInvoice && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {/* Header: Logo and Invoice Date */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", pb: 1.5, borderBottom: "2px solid #0f172a" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    component="img"
                    src="https://res.cloudinary.com/vhth8clt/image/upload/v1788210409/logo.png"
                    alt="Webliix Logo"
                    sx={{ height: 38, objectFit: "contain" }}
                  />
                  <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: "-0.5px", color: "#0f172a" }}>
                    webliix
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="body2" fontWeight={800} color="#0f172a">
                    DATE: {previewInvoice.issueDate ? new Date(previewInvoice.issueDate).toLocaleDateString("en-GB") : new Date().toLocaleDateString("en-GB")}
                  </Typography>
                </Box>
              </Box>

              {/* Invoice Title */}
              <Box sx={{ textAlign: "center", my: 1 }}>
                <Typography variant="h4" fontWeight={900} letterSpacing="0.05em" sx={{ color: "#0f172a" }}>
                  INVOICE #{previewInvoice.invoiceNumber || "0154"}
                </Typography>
              </Box>

              {/* Bill to / Ship to Grid */}
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3, border: "1px solid #cbd5e1", borderRadius: 1.5, p: 2, bgcolor: "#f8fafc" }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={900} color="#0f172a" sx={{ borderBottom: "1px solid #cbd5e1", pb: 0.5, mb: 1 }}>
                    Bill to:
                  </Typography>
                  <Typography variant="body2"><strong>Client:</strong> {previewInvoice.customer?.companyName || previewInvoice.customer?.contactPerson || "Webliix Client"}</Typography>
                  <Typography variant="body2"><strong>Contact Person:</strong> {previewInvoice.customer?.contactPerson || previewInvoice.customer?.companyName || "Authorized Signatory"}</Typography>
                  <Typography variant="body2"><strong>Client ID#:</strong> #{previewInvoice.customer?.id || previewInvoice.id}</Typography>
                  <Typography variant="body2"><strong>Project:</strong> {previewInvoice.project?.projectName || "Engineering Services"}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight={900} color="#0f172a" sx={{ borderBottom: "1px solid #cbd5e1", pb: 0.5, mb: 1 }}>
                    Ship to:
                  </Typography>
                  <Typography variant="body2"><strong>Recipient:</strong> {previewInvoice.customer?.companyName || "Webliix Client"}</Typography>
                  <Typography variant="body2"><strong>Delivery:</strong> Digital Delivery / Remote Production Deployment</Typography>
                  <Typography variant="body2"><strong>Status:</strong> {previewInvoice.status || "DRAFT"}</Typography>
                  <Typography variant="body2"><strong>Platform:</strong> webliix.com</Typography>
                </Box>
              </Box>

              {/* Sub-grid: Payment Due, Salesperson, Terms, Status */}
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" }, gap: 1.5, border: "1px solid #cbd5e1", borderRadius: 1, p: 1.5, bgcolor: "#f1f5f9", textAlign: "center" }}>
                <Box>
                  <Typography variant="caption" fontWeight={800} color="text.secondary">PAYMENT DUE</Typography>
                  <Typography variant="body2" fontWeight={800}>{previewInvoice.dueDate ? new Date(previewInvoice.dueDate).toLocaleDateString("en-GB") : "Upon Receipt"}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" fontWeight={800} color="text.secondary">SALESPERSON / LEAD</Typography>
                  <Typography variant="body2" fontWeight={800}>Webliix Direct</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" fontWeight={800} color="text.secondary">PAYMENT TERMS</Typography>
                  <Typography variant="body2" fontWeight={800}>Contractual Schedule</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" fontWeight={800} color="text.secondary">PAYMENT STATE</Typography>
                  <Typography variant="body2" fontWeight={800} color={previewInvoice.status === "PAID" ? "success.main" : "warning.main"}>
                    Paid: ₹{(previewInvoice.paidAmount || 0).toLocaleString()}/-
                  </Typography>
                </Box>
              </Box>

              {/* Itemized Table */}
              <TableContainer sx={{ border: "1px solid #cbd5e1", borderRadius: 1 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: "#0f172a" }}>
                    <TableRow>
                      <TableCell sx={{ color: "#ffffff", fontWeight: 800 }}>Qty.</TableCell>
                      <TableCell sx={{ color: "#ffffff", fontWeight: 800 }}>Item#</TableCell>
                      <TableCell sx={{ color: "#ffffff", fontWeight: 800 }}>Description</TableCell>
                      <TableCell sx={{ color: "#ffffff", fontWeight: 800, textAlign: "right" }}>Unit price</TableCell>
                      <TableCell sx={{ color: "#ffffff", fontWeight: 800, textAlign: "right" }}>Discount</TableCell>
                      <TableCell sx={{ color: "#ffffff", fontWeight: 800, textAlign: "right" }}>Line total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {previewInvoice.items && previewInvoice.items.length > 0 ? (
                      previewInvoice.items.map((item, idx) => (
                        <TableRow key={idx} sx={{ "&:nth-of-type(even)": { bgcolor: "#f8fafc" } }}>
                          <TableCell sx={{ fontWeight: 600 }}>{item.quantity || 1}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{idx + 1}</TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={700}>{item.itemName}</Typography>
                            {item.description && <Typography variant="caption" color="text.secondary">{item.description}</Typography>}
                          </TableCell>
                          <TableCell sx={{ textAlign: "right", fontWeight: 600 }}>₹{(item.unitPrice || 0).toLocaleString()}/-</TableCell>
                          <TableCell sx={{ textAlign: "right", fontWeight: 600 }}>₹0/-</TableCell>
                          <TableCell sx={{ textAlign: "right", fontWeight: 800 }}>₹{(item.totalPrice || (item.quantity * item.unitPrice) || 0).toLocaleString()}/-</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>1</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>01</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={700}>
                            {previewInvoice.project?.projectName || "Software Engineering & Architecture Deliverables"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Delivery milestones, cloud deployment & engineering sprint
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ textAlign: "right", fontWeight: 600 }}>₹{(previewInvoice.totalAmount || 0).toLocaleString()}/-</TableCell>
                        <TableCell sx={{ textAlign: "right", fontWeight: 600 }}>₹{(previewInvoice.discountAmount || 0).toLocaleString()}/-</TableCell>
                        <TableCell sx={{ textAlign: "right", fontWeight: 800 }}>₹{(previewInvoice.totalAmount || 0).toLocaleString()}/-</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Financial Totals Block */}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Box sx={{ width: { xs: "100%", sm: 380 }, border: "1px solid #cbd5e1", borderRadius: 1.5, p: 2, bgcolor: "#f8fafc", display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>Total Discount:</Typography>
                    <Typography variant="body2" fontWeight={700}>₹{(previewInvoice.discountAmount || 0).toLocaleString()}/-</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>Subtotal:</Typography>
                    <Typography variant="body2" fontWeight={700}>₹{(previewInvoice.subtotal || previewInvoice.totalAmount || 0).toLocaleString()}/-</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="success.main" fontWeight={700}>Paid Amount:</Typography>
                    <Typography variant="body2" fontWeight={800} color="success.main">₹{(previewInvoice.paidAmount || 0).toLocaleString()}/-</Typography>
                  </Box>
                  
                  {/* Status: Remaining Payment Pill Bar */}
                  <Box sx={{ p: 1.25, bgcolor: (previewInvoice.pendingAmount || 0) > 0 ? "#fef3c7" : "#dcfce7", borderRadius: 1, border: `1px solid ${(previewInvoice.pendingAmount || 0) > 0 ? "#f59e0b" : "#16a34a"}`, textAlign: "center" }}>
                    <Typography variant="subtitle2" fontWeight={900} color={(previewInvoice.pendingAmount || 0) > 0 ? "#b45309" : "#15803d"}>
                      Status: Remaining Payment of ₹{(previewInvoice.pendingAmount ?? ((previewInvoice.totalAmount || 0) - (previewInvoice.paidAmount || 0))).toLocaleString()}/-
                    </Typography>
                  </Box>

                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" fontWeight={900}>Total:</Typography>
                    <Typography variant="h5" fontWeight={900} color="primary.main">
                      ₹{(previewInvoice.totalAmount || 0).toLocaleString()}/-
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Official Thank you & Authorized Signatory */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", pt: 2, borderTop: "1px dashed #cbd5e1" }}>
                <Box>
                  <Typography variant="h6" fontWeight={800} sx={{ fontStyle: "italic", color: "#0f172a" }}>
                    Thank you for your business!
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                    For billing support or payment confirmation: contact@webliix.com | +91 93101 81569
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body1" sx={{ fontFamily: "cursive", fontStyle: "italic", fontWeight: 700, color: "#1e293b", minHeight: 28 }}>
                    Himanshu Sharma
                  </Typography>
                  <Box sx={{ width: 140, height: 1, bgcolor: "#334155", my: 0.5, mx: "auto" }} />
                  <Typography variant="caption" fontWeight={700} color="#475569" sx={{ display: "block" }}>
                    Authorized Signatory
                  </Typography>
                </Box>
              </Box>

              {/* Official Footer */}
              <Box sx={{ textAlign: "center", pt: 1, borderTop: "2px solid #0f172a" }}>
                <Typography variant="caption" fontWeight={700} color="#334155" sx={{ display: "block" }}>
                  B-34, Galaxy Blue Sapphire Plaza, Greater Noida West Sector 4, Uttar Pradesh 201305 | contact@webliix.com | +91 93101 81569 | webliix.com
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
