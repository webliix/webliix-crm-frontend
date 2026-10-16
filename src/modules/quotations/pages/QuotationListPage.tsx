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
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";

import AddIcon from "@mui/icons-material/Add";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import PrintIcon from "@mui/icons-material/Print";

import { PageLayout } from "@/shared/components/ui/layout";
import { BrandLoader } from "@/shared/components/ui/feedback/BrandLoader";
import { tokens } from "@/theme/tokens";
import { http } from "@/shared/services/http";

interface Customer {
  id?: number;
  companyName: string;
  contactPerson: string;
  email?: string;
  phone?: string;
}

interface QuotationItemLine {
  itemName: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface QuotationItem {
  id: number;
  quotationNumber: string;
  customer: Customer;
  customerId?: number;
  projectId?: number;
  totalAmount: number;
  subtotal?: number;
  taxAmount?: number;
  discount?: number;
  issueDate?: string;
  validUntil?: string;
  validTill?: string;
  notes?: string;
  status: string;
  items?: Array<{
    id?: number;
    itemName: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    totalPrice?: number;
  }>;
}

const statusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "APPROVED":
      return "success";
    case "SENT":
      return "primary";
    case "DRAFT":
      return "default";
    case "REJECTED":
      return "error";
    case "CONVERTED":
      return "secondary";
    default:
      return "default";
  }
};

export default function QuotationListPage() {
  const [quotations, setQuotations] = useState<QuotationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [converting, setConverting] = useState<number | null>(null);

  // Reference data
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submittingCreate, setSubmittingCreate] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationItem | null>(null);

  // Notification
  const [notification, setNotification] = useState<{ message: string; severity: "success" | "error" | "info" } | null>(null);

  // Create Form State
  const [formCustomerId, setFormCustomerId] = useState<number | "">("");
  const [formProjectId, setFormProjectId] = useState<number | "">("");
  const [formIssueDate, setFormIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [formValidTill, setFormValidTill] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [formNotes, setFormNotes] = useState("");
  const [formTax, setFormTax] = useState<number>(0);
  const [formDiscount, setFormDiscount] = useState<number>(0);
  const [formItems, setFormItems] = useState<QuotationItemLine[]>([
    { itemName: "Custom Software Engineering", description: "Design, development, and system deployment", quantity: 1, unitPrice: 50000 },
  ]);

  const loadQuotations = () => {
    setLoading(true);
    http
      .get("/api/v1/quotations")
      .then((res) => {
        const data = res.data?.data;
        if (Array.isArray(data)) {
          setQuotations(data);
        } else if (data?.content) {
          setQuotations(data.content);
        } else {
          setQuotations([]);
        }
      })
      .catch(() => {
        setError("Failed to load quotations. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  const loadReferenceData = async () => {
    try {
      const [custRes, projRes] = await Promise.allSettled([
        http.get("/api/v1/customers", { params: { size: 100 } }),
        http.get("/api/v1/projects", { params: { size: 100 } }),
      ]);
      if (custRes.status === "fulfilled") {
        const cData = custRes.value.data?.data?.content || custRes.value.data?.data || [];
        setCustomers(Array.isArray(cData) ? cData : []);
      }
      if (projRes.status === "fulfilled") {
        const pData = projRes.value.data?.data?.content || projRes.value.data?.data || [];
        setProjects(Array.isArray(pData) ? pData : []);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadQuotations();
    loadReferenceData();
  }, []);

  const handleConvert = async (id: number) => {
    setConverting(id);
    try {
      await http.post(`/api/v1/quotations/${id}/convert`, {});
      setNotification({ message: "Quotation successfully converted to Commercial Invoice!", severity: "success" });
      setQuotations((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: "CONVERTED" } : q))
      );
      if (selectedQuotation && selectedQuotation.id === id) {
        setSelectedQuotation({ ...selectedQuotation, status: "CONVERTED" });
      }
    } catch (err: any) {
      setNotification({
        message: err.response?.data?.message || "Failed to convert quotation to invoice",
        severity: "error",
      });
    } finally {
      setConverting(null);
    }
  };

  const handleViewQuotation = async (q: QuotationItem) => {
    try {
      const res = await http.get(`/api/v1/quotations/${q.id}`);
      setSelectedQuotation(res.data?.data || q);
    } catch {
      setSelectedQuotation(q);
    }
    setViewModalOpen(true);
  };

  const handleAddItem = () => {
    setFormItems((prev) => [...prev, { itemName: "", description: "", quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setFormItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof QuotationItemLine, val: any) => {
    setFormItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: val } : item))
    );
  };

  const calculatedSubtotal = formItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );
  const calculatedGrandTotal = Math.max(0, calculatedSubtotal + (Number(formTax) || 0) - (Number(formDiscount) || 0));

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCustomerId) {
      setNotification({ message: "Please select a client customer.", severity: "error" });
      return;
    }
    if (formItems.length === 0 || formItems.some((i) => !i.itemName.trim())) {
      setNotification({ message: "Please provide at least one valid line item.", severity: "error" });
      return;
    }

    setSubmittingCreate(true);
    try {
      const payload = {
        customerId: formCustomerId,
        projectId: formProjectId || null,
        issueDate: formIssueDate,
        validTill: formValidTill,
        taxAmount: formTax || 0,
        discount: formDiscount || 0,
        status: "SENT",
        notes: formNotes.trim(),
        items: formItems.map((item) => ({
          itemName: item.itemName.trim(),
          description: item.description.trim(),
          quantity: Number(item.quantity) || 1,
          unitPrice: Number(item.unitPrice) || 0,
        })),
      };

      await http.post("/api/v1/quotations", payload);
      setNotification({ message: "Quotation & Proposal created and registered successfully!", severity: "success" });
      setCreateModalOpen(false);
      // Reset form
      setFormCustomerId("");
      setFormProjectId("");
      setFormNotes("");
      setFormTax(0);
      setFormDiscount(0);
      setFormItems([
        { itemName: "Custom Software Engineering", description: "Design, development, and system deployment", quantity: 1, unitPrice: 50000 },
      ]);
      loadQuotations();
    } catch (err: any) {
      setNotification({
        message: err.response?.data?.message || "Failed to create quotation.",
        severity: "error",
      });
    } finally {
      setSubmittingCreate(false);
    }
  };

  return (
    <PageLayout
      title="Quotations & Client Proposals"
      subtitle="Draft, send, and track commercial proposals and cost estimates"
      actions={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateModalOpen(true)}
          sx={{ fontWeight: 700 }}
        >
          Create New Quotation
        </Button>
      }
    >
      {loading ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <BrandLoader message="Loading client quotations..." size="medium" />
        </Box>
      ) : error ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : quotations.length === 0 ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Typography color="text.secondary">No quotations found.</Typography>
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
                  <TableCell sx={{ fontWeight: 700 }}>Quotation #</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Contact Person</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Total Value</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Valid Until</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quotations.map((q) => (
                  <TableRow key={q.id} hover>
                    <TableCell
                      sx={{ fontWeight: 700, color: tokens.colors.primary.main, cursor: "pointer" }}
                      onClick={() => handleViewQuotation(q)}
                    >
                      {q.quotationNumber}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {q.customer?.companyName ?? "—"}
                    </TableCell>
                    <TableCell>{q.customer?.contactPerson ?? "—"}</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>
                      ₹{q.totalAmount?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {q.validUntil || q.validTill
                        ? new Date(q.validUntil || q.validTill!).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={q.status}
                        color={statusColor(q.status) as any}
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <Box sx={{ display: "inline-flex", gap: 1 }}>
                        <Tooltip title="View Quotation Details & Preview">
                          <IconButton size="small" color="primary" onClick={() => handleViewQuotation(q)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {q.status !== "CONVERTED" && (
                          <Tooltip title="Convert to Invoice">
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<SwapHorizIcon />}
                              disabled={converting === q.id}
                              onClick={() => handleConvert(q.id)}
                              sx={{ fontWeight: 700, fontSize: "0.75rem" }}
                            >
                              {converting === q.id ? "Converting…" : "Convert"}
                            </Button>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* ==================== CREATE QUOTATION DIALOG ==================== */}
      <Dialog
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: tokens.borderRadius.lg } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
          <DescriptionIcon color="primary" />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Draft Commercial Proposal & Quotation
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Prepare an itemized cost estimate with tax, discounts, and terms
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleCreateQuotation} sx={{ display: "grid", gap: 2.5, pt: 1 }}>
            {/* Top Row: Customer & Project */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <FormControl fullWidth size="small" required>
                <InputLabel>Client Customer</InputLabel>
                <Select
                  value={formCustomerId}
                  label="Client Customer"
                  onChange={(e) => setFormCustomerId(Number(e.target.value))}
                >
                  {customers.map((c: any) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.companyName} {c.contactPerson ? `(${c.contactPerson})` : ""}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Associated Project (Optional)</InputLabel>
                <Select
                  value={formProjectId}
                  label="Associated Project (Optional)"
                  onChange={(e) => setFormProjectId(Number(e.target.value) || "")}
                >
                  <MenuItem value="">None / Unassigned</MenuItem>
                  {projects.map((p: any) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.projectName} ({p.projectCode})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Dates Row */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <TextField
                type="date"
                label="Issue Date"
                size="small"
                fullWidth
                value={formIssueDate}
                onChange={(e) => setFormIssueDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="date"
                label="Valid Until"
                size="small"
                fullWidth
                value={formValidTill}
                onChange={(e) => setFormValidTill(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            {/* Line Items Table */}
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  Itemized Services & Deliverables
                </Typography>
                <Button size="small" startIcon={<AddIcon />} onClick={handleAddItem} variant="outlined">
                  Add Item
                </Button>
              </Box>

              <TableContainer sx={{ border: "1px solid #e2e8f0", borderRadius: 1.5 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: "action.hover" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, width: "35%" }}>Item Name</TableCell>
                      <TableCell sx={{ fontWeight: 700, width: "30%" }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 700, width: "12%" }}>Qty</TableCell>
                      <TableCell sx={{ fontWeight: 700, width: "15%" }}>Unit Price (₹)</TableCell>
                      <TableCell sx={{ width: "8%" }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formItems.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <TextField
                            size="small"
                            fullWidth
                            placeholder="e.g. Frontend Development"
                            value={item.itemName}
                            onChange={(e) => handleItemChange(idx, "itemName", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            fullWidth
                            placeholder="Brief deliverable notes"
                            value={item.description}
                            onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            size="small"
                            fullWidth
                            value={item.quantity}
                            inputProps={{ min: 1 }}
                            onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            size="small"
                            fullWidth
                            value={item.unitPrice}
                            inputProps={{ min: 0 }}
                            onChange={(e) => handleItemChange(idx, "unitPrice", Number(e.target.value))}
                          />
                        </TableCell>
                        <TableCell>
                          {formItems.length > 1 && (
                            <IconButton size="small" color="error" onClick={() => handleRemoveItem(idx)}>
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Calculations & Notes */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1.2fr 0.8fr" }, gap: 2 }}>
              <TextField
                label="Commercial Terms & Notes"
                multiline
                rows={4}
                fullWidth
                size="small"
                placeholder="Payment schedules, validity conditions, delivery timelines..."
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
              />

              <Box sx={{ bgcolor: "action.hover", p: 2, borderRadius: 2, display: "grid", gap: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
                  <Typography variant="body2" fontWeight={600}>₹{calculatedSubtotal.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">Tax Amount (₹):</Typography>
                  <TextField
                    type="number"
                    size="small"
                    sx={{ width: 110 }}
                    value={formTax}
                    onChange={(e) => setFormTax(Number(e.target.value))}
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">Discount (₹):</Typography>
                  <TextField
                    type="number"
                    size="small"
                    sx={{ width: 110 }}
                    value={formDiscount}
                    onChange={(e) => setFormDiscount(Number(e.target.value))}
                  />
                </Box>
                <Divider sx={{ my: 0.5 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1" fontWeight={800}>Grand Total:</Typography>
                  <Typography variant="subtitle1" fontWeight={800} color="primary.main">
                    ₹{calculatedGrandTotal.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <DialogActions sx={{ px: 0, pt: 1 }}>
              <Button onClick={() => setCreateModalOpen(false)} color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={submittingCreate}>
                {submittingCreate ? <CircularProgress size={20} /> : "Save & Send Proposal"}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      {/* ==================== VIEW QUOTATION DETAILS MODAL ==================== */}
      <Dialog
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: tokens.borderRadius.lg } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <DescriptionIcon color="primary" />
            <Typography variant="h6" fontWeight={800}>
              Quotation {selectedQuotation?.quotationNumber}
            </Typography>
          </Box>
          {selectedQuotation && (
            <Chip
              label={selectedQuotation.status}
              color={statusColor(selectedQuotation.status) as any}
              size="small"
              sx={{ fontWeight: 700 }}
            />
          )}
        </DialogTitle>
        <DialogContent dividers>
          {selectedQuotation && (
            <Box sx={{ display: "grid", gap: 3, pt: 1 }}>
              {/* Header Info */}
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    CLIENT / PROSPECT
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {selectedQuotation.customer?.companyName || "—"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Contact: {selectedQuotation.customer?.contactPerson || "—"}
                  </Typography>
                  {selectedQuotation.customer?.email && (
                    <Typography variant="body2" color="text.secondary">
                      Email: {selectedQuotation.customer.email}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    PROPOSAL TIMELINE & VALUE
                  </Typography>
                  <Typography variant="body2">
                    Issue Date:{" "}
                    <strong>
                      {selectedQuotation.issueDate ? new Date(selectedQuotation.issueDate).toLocaleDateString() : "—"}
                    </strong>
                  </Typography>
                  <Typography variant="body2">
                    Valid Until:{" "}
                    <strong>
                      {selectedQuotation.validUntil || selectedQuotation.validTill
                        ? new Date(selectedQuotation.validUntil || selectedQuotation.validTill!).toLocaleDateString()
                        : "—"}
                    </strong>
                  </Typography>
                  <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ mt: 1 }}>
                    Total: ₹{selectedQuotation.totalAmount?.toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              {/* Items Breakdown */}
              {selectedQuotation.items && selectedQuotation.items.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} mb={1}>
                    Line Items
                  </Typography>
                  <TableContainer sx={{ border: "1px solid #e2e8f0", borderRadius: 1.5 }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: "action.hover" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Item</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                          <TableCell sx={{ fontWeight: 700 }} align="right">Qty</TableCell>
                          <TableCell sx={{ fontWeight: 700 }} align="right">Unit Price</TableCell>
                          <TableCell sx={{ fontWeight: 700 }} align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedQuotation.items.map((it, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ fontWeight: 600 }}>{it.itemName}</TableCell>
                            <TableCell>{it.description || "—"}</TableCell>
                            <TableCell align="right">{it.quantity}</TableCell>
                            <TableCell align="right">₹{it.unitPrice?.toLocaleString()}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>
                              ₹{((it.totalPrice != null ? it.totalPrice : it.quantity * it.unitPrice) || 0).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Notes */}
              {selectedQuotation.notes && (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    PROPOSAL TERMS & NOTES
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-line", mt: 0.5 }}>
                    {selectedQuotation.notes}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, justifyContent: "space-between" }}>
          <Button
            startIcon={<PrintIcon />}
            variant="outlined"
            onClick={() => window.print()}
            color="inherit"
          >
            Print Proposal
          </Button>
          <Box sx={{ display: "flex", gap: 1 }}>
            {selectedQuotation && selectedQuotation.status !== "CONVERTED" && (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<SwapHorizIcon />}
                onClick={() => handleConvert(selectedQuotation.id)}
                disabled={converting === selectedQuotation.id}
              >
                {converting === selectedQuotation.id ? "Converting…" : "Convert to Invoice"}
              </Button>
            )}
            <Button onClick={() => setViewModalOpen(false)} color="inherit">
              Close
            </Button>
          </Box>
        </DialogActions>
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
