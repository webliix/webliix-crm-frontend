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

interface PayrollItem {
  id: number;
  employeeName: string;
  department: string;
  month: string;
  basicSalary: number;
  netPay: number;
  status: string;
}

export default function PayrollListPage() {
  const [payrolls, setPayrolls] = useState<PayrollItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get("/api/v1/payroll")
      .then((res) => {
        const data = res.data?.data;
        if (Array.isArray(data)) setPayrolls(data);
        else if (data?.content) setPayrolls(data.content);
        else setPayrolls(samplePayrolls);
        setLoading(false);
      })
      .catch(() => {
        setPayrolls(samplePayrolls);
        setLoading(false);
      });
  }, []);

  const samplePayrolls: PayrollItem[] = [
    {
      id: 1,
      employeeName: "Himanshu Sharma",
      department: "Software Engineering",
      month: "September 2026",
      basicSalary: 120000,
      netPay: 115000,
      status: "PROCESSED",
    },
    {
      id: 2,
      employeeName: "Aarav Patel",
      department: "Client Delivery & Operations",
      month: "September 2026",
      basicSalary: 95000,
      netPay: 91000,
      status: "PROCESSED",
    },
  ];

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
      ) : (
        <Card sx={{ borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}`, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: tokens.colors.secondary[50] }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Employee Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Payroll Month</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Basic Salary</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Net Disbursed</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payrolls.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell sx={{ fontWeight: 700, color: tokens.colors.secondary[900] }}>{p.employeeName}</TableCell>
                    <TableCell>{p.department}</TableCell>
                    <TableCell>{p.month}</TableCell>
                    <TableCell>₹{p.basicSalary.toLocaleString()}</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: tokens.colors.success[700] }}>₹{p.netPay.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip label={p.status} color="success" size="small" sx={{ fontWeight: 700 }} />
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
