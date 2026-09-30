import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BarChartIcon from "@mui/icons-material/BarChart";
import { PageLayout } from "@/shared/components/ui/layout";
import { BrandLoader } from "@/shared/components/ui/feedback/BrandLoader";
import { tokens } from "@/theme/tokens";
import { http } from "@/shared/services/http";

interface RevenueData {
  totalRevenue?: number;
  currency?: string;
  [key: string]: any;
}

interface ProfitData {
  totalProfit?: number;
  profitMargin?: number;
  [key: string]: any;
}

interface MonthlyRevenueRow {
  month: string;
  year: number;
  revenue: number;
  currency?: string;
}

export default function ReportsPage() {
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [profit, setProfit] = useState<ProfitData | null>(null);
  const [monthly, setMonthly] = useState<MonthlyRevenueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      http.get("/api/v1/reports/revenue"),
      http.get("/api/v1/reports/profit"),
      http.get("/api/v1/reports/revenue/monthly"),
    ])
      .then(([revRes, profRes, monthRes]) => {
        setRevenue(revRes.data?.data ?? null);
        setProfit(profRes.data?.data ?? null);
        const mData = monthRes.data?.data;
        setMonthly(Array.isArray(mData) ? mData : mData?.content ?? []);
      })
      .catch(() => {
        setError("Failed to load report data. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const summaryCards = [
    {
      label: "Total Revenue",
      value: revenue?.totalRevenue != null ? `₹${revenue.totalRevenue.toLocaleString()}` : "—",
      icon: <TrendingUpIcon fontSize="large" />,
      color: tokens.colors.primary.main,
      bg: tokens.colors.primary[50],
    },
    {
      label: "Total Profit",
      value: profit?.totalProfit != null ? `₹${profit.totalProfit.toLocaleString()}` : "—",
      icon: <AccountBalanceIcon fontSize="large" />,
      color: tokens.colors.success[700],
      bg: tokens.colors.success[50],
    },
    {
      label: "Profit Margin",
      value:
        profit?.profitMargin != null ? `${profit.profitMargin.toFixed(1)}%` : "—",
      icon: <BarChartIcon fontSize="large" />,
      color: tokens.colors.warning[700],
      bg: tokens.colors.warning[50],
    },
  ];

  return (
    <PageLayout
      title="Financial Reports"
      subtitle="Overview of revenue, profit, and monthly financial performance"
    >
      {loading ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <BrandLoader message="Loading financial reports..." size="medium" />
        </Box>
      ) : error ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <Box sx={{ display: "grid", gap: 3 }}>
          {/* Summary Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 2,
            }}
          >
            {summaryCards.map((card) => (
              <Card
                key={card.label}
                sx={{
                  borderRadius: tokens.borderRadius.lg,
                  border: `1px solid ${tokens.colors.secondary[200]}`,
                  p: 2.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: tokens.borderRadius.md,
                    bgcolor: card.bg,
                    color: card.color,
                    display: "flex",
                  }}
                >
                  {card.icon}
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={800} color={card.color}>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.label}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>

          {/* Monthly Revenue Table */}
          <Box>
            <Typography variant="h6" fontWeight={700} mb={1.5} color={tokens.colors.secondary[900]}>
              Monthly Revenue Breakdown
            </Typography>
            {monthly.length === 0 ? (
              <Box sx={{ py: 4, textAlign: "center" }}>
                <Typography color="text.secondary">
                  No monthly revenue data available.
                </Typography>
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
                        <TableCell sx={{ fontWeight: 700 }}>Month</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Year</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Revenue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {monthly.map((row, idx) => (
                        <TableRow key={idx} hover>
                          <TableCell sx={{ fontWeight: 600 }}>{row.month}</TableCell>
                          <TableCell>{row.year}</TableCell>
                          <TableCell sx={{ fontWeight: 800, color: tokens.colors.primary.main }}>
                            {row.currency ?? "₹"}{row.revenue?.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            )}
          </Box>
        </Box>
      )}
    </PageLayout>
  );
}
