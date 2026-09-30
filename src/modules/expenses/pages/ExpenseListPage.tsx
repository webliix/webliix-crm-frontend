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
import Typography from "@mui/material/Typography";
import { PageLayout } from "@/shared/components/ui/layout";
import { BrandLoader } from "@/shared/components/ui/feedback/BrandLoader";
import { tokens } from "@/theme/tokens";
import { http } from "@/shared/services/http";

interface ExpenseItem {
  id: number;
  expenseCode: string;
  title: string;
  category: string;
  amount: number;
  currency: string;
  expenseDate: string;
  status: string;
  submittedBy: string;
  notes: string;
}

const statusColor = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "success";
    case "PENDING":
      return "warning";
    case "REJECTED":
      return "error";
    case "REIMBURSED":
      return "primary";
    default:
      return "default";
  }
};

export default function ExpenseListPage() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    http
      .get("/api/v1/expenses", { params: { page: 0, size: 20 } })
      .then((res) => {
        const data = res.data?.data;
        if (Array.isArray(data)) {
          setExpenses(data);
        } else if (data?.content) {
          setExpenses(data.content);
        } else {
          setExpenses([]);
        }
      })
      .catch(() => {
        setError("Failed to load expenses. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout
      title="Expense Management"
      subtitle="Track, review, and manage company and employee expense submissions"
    >
      {loading ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <BrandLoader message="Loading expense records..." size="medium" />
        </Box>
      ) : error ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : expenses.length === 0 ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Typography color="text.secondary">No expense records found.</Typography>
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
                  <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Submitted By</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((e) => (
                  <TableRow key={e.id} hover>
                    <TableCell
                      sx={{
                        fontFamily: "monospace",
                        color: tokens.colors.secondary[600],
                      }}
                    >
                      {e.expenseCode}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: tokens.colors.secondary[900] }}>
                      {e.title}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={e.category}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: tokens.colors.primary[50],
                          color: tokens.colors.primary.main,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>
                      {e.currency} {e.amount?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {e.expenseDate ? new Date(e.expenseDate).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell>{e.submittedBy}</TableCell>
                    <TableCell>
                      <Chip
                        label={e.status}
                        color={statusColor(e.status) as any}
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        color: tokens.colors.secondary[600],
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {e.notes ?? "—"}
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
