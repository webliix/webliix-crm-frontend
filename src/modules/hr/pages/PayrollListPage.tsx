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
import AddIcon from "@mui/icons-material/Add";
import { PageLayout } from "@/shared/components/ui/layout";
import { BrandLoader } from "@/shared/components/ui/feedback/BrandLoader";
import { tokens } from "@/theme/tokens";
import { http } from "@/shared/services/http";

interface PayrollItem {
  id: number;
  employeeName: string;
  employeeCode: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: string;
}

const statusColor = (status: string) => {
  switch (status) {
    case "PAID":
    case "PROCESSED":
      return "success";
    case "PENDING":
      return "warning";
    case "CANCELLED":
      return "error";
    default:
      return "default";
  }
};

export default function PayrollListPage() {
  const [payrolls, setPayrolls] = useState<PayrollItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    http
      .get("/api/v1/payrolls")
      .then((res) => {
        const data = res.data?.data;
        if (Array.isArray(data)) {
          setPayrolls(data);
        } else if (data?.content) {
          setPayrolls(data.content);
        } else {
          setPayrolls([]);
        }
      })
      .catch(() => {
        setError("Failed to load payroll records. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout
      title="HR & Payroll Management"
      subtitle="Manage team salaries, salary disbursements, and monthly payroll statements"
      actions={
        <Button variant="contained" startIcon={<AddIcon />} sx={{ fontWeight: 700 }}>
          Generate Payroll Run
        </Button>
      }
    >
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
                  <TableCell sx={{ fontWeight: 700 }}>Basic Salary</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Allowances</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Deductions</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Net Salary</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payrolls.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell sx={{ fontWeight: 700, color: tokens.colors.secondary[900] }}>
                      {p.employeeName}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "monospace", color: tokens.colors.secondary[600] }}>
                      {p.employeeCode}
                    </TableCell>
                    <TableCell>
                      {p.month}/{p.year}
                    </TableCell>
                    <TableCell>₹{p.basicSalary?.toLocaleString()}</TableCell>
                    <TableCell sx={{ color: tokens.colors.success[700] }}>
                      +₹{p.allowances?.toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ color: "error.main" }}>
                      -₹{p.deductions?.toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800, color: tokens.colors.success[700] }}>
                      ₹{p.netSalary?.toLocaleString()}
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </PageLayout>
  );
}
