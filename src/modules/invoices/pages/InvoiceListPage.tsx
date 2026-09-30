import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HourglassTopOutlinedIcon from "@mui/icons-material/HourglassTopOutlined";
import { tokens } from "@/theme/tokens";
import { invoiceApi, type InvoiceItem } from "../api/invoiceApi";

export default function InvoiceListPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    invoiceApi.getInvoices().then((res) => {
      if (isMounted) {
        setInvoices(res.content);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
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
    if (st === "PENDING") {
      return (
        <Chip
          icon={<HourglassTopOutlinedIcon style={{ fontSize: 14 }} />}
          label="Pending"
          size="small"
          sx={{ bgcolor: tokens.colors.warning[100], color: tokens.colors.warning[700], fontWeight: 700 }}
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

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} color={tokens.colors.secondary[900]} gutterBottom>
          Invoices & Billing Summary
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View your billing history, pending invoices, and payment statuses.
        </Typography>
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
        <Box sx={{ py: 10, textAlign: "center" }}>
          <CircularProgress size={40} sx={{ color: tokens.colors.primary.main }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontWeight: 500 }}>
            Loading invoices...
          </Typography>
        </Box>
      ) : invoices.length === 0 ? (
        <Card sx={{ borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}`, p: 6, textAlign: "center" }}>
          <ReceiptLongOutlinedIcon sx={{ fontSize: 56, color: tokens.colors.secondary[300], mb: 2 }} />
          <Typography variant="h6" fontWeight={700} color={tokens.colors.secondary[800]} gutterBottom>
            No Invoices Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You do not have any invoices generated for your account.
          </Typography>
        </Card>
      ) : (
        <Card sx={{ borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}`, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: tokens.colors.secondary[50] }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Invoice #</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Project / Service</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Issue Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Total Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 700, color: tokens.colors.primary.main }}>
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {invoice.project?.projectName || "Website & Software Services"}
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
                    <TableCell>{getStatusChip(invoice.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Box>
  );
}
