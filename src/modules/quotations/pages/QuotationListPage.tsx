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
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { PageLayout } from "@/shared/components/ui/layout";
import { BrandLoader } from "@/shared/components/ui/feedback/BrandLoader";
import { tokens } from "@/theme/tokens";
import { http } from "@/shared/services/http";

interface Customer {
  companyName: string;
  contactPerson: string;
}

interface QuotationItem {
  id: number;
  quotationNumber: string;
  customer: Customer;
  totalAmount: number;
  validUntil: string;
  status: string;
}

const statusColor = (status: string) => {
  switch (status) {
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

  useEffect(() => {
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
  }, []);

  const handleConvert = async (id: number) => {
    setConverting(id);
    try {
      await http.post(`/api/v1/quotations/${id}/convert`, {});
      setQuotations((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: "CONVERTED" } : q))
      );
    } catch {
      // Conversion failed — keep current state
    } finally {
      setConverting(null);
    }
  };

  return (
    <PageLayout
      title="Quotations & Client Proposals"
      subtitle="Draft, send, and track commercial proposals and cost estimates"
      actions={
        <Button variant="contained" startIcon={<AddIcon />} sx={{ fontWeight: 700 }}>
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
                  <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quotations.map((q) => (
                  <TableRow key={q.id} hover>
                    <TableCell
                      sx={{ fontWeight: 700, color: tokens.colors.primary.main }}
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
                      {q.validUntil ? new Date(q.validUntil).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={q.status}
                        color={statusColor(q.status) as any}
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </PageLayout>
  );
}
