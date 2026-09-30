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
import AddIcon from "@mui/icons-material/Add";
import { PageLayout } from "@/shared/components/ui/layout";
import { BrandLoader } from "@/shared/components/ui/feedback/BrandLoader";
import { tokens } from "@/theme/tokens";
import { http } from "@/shared/services/http";

interface QuotationItem {
  id: number;
  quotationNumber: string;
  clientName: string;
  totalAmount: number;
  validUntil: string;
  status: string;
}

export default function QuotationListPage() {
  const [quotations, setQuotations] = useState<QuotationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get("/api/v1/quotations")
      .then((res) => {
        const data = res.data?.data;
        if (Array.isArray(data)) setQuotations(data);
        else if (data?.content) setQuotations(data.content);
        else setQuotations(sampleQuotations);
        setLoading(false);
      })
      .catch(() => {
        setQuotations(sampleQuotations);
        setLoading(false);
      });
  }, []);

  const sampleQuotations: QuotationItem[] = [
    {
      id: 1,
      quotationNumber: "QT-8801",
      clientName: "Himanshu Sharma Enterprise",
      totalAmount: 250000,
      validUntil: "2026-10-30",
      status: "APPROVED",
    },
    {
      id: 2,
      quotationNumber: "QT-8802",
      clientName: "Acme Global Web Systems",
      totalAmount: 180000,
      validUntil: "2026-11-15",
      status: "SENT",
    },
  ];

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
      ) : (
        <Card sx={{ borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}`, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: tokens.colors.secondary[50] }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Quotation #</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Client Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Total Value</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Valid Until</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quotations.map((q) => (
                  <TableRow key={q.id} hover>
                    <TableCell sx={{ fontWeight: 700, color: tokens.colors.primary.main }}>{q.quotationNumber}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{q.clientName}</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>₹{q.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>{new Date(q.validUntil).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={q.status}
                        color={q.status === "APPROVED" ? "success" : "primary"}
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
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
