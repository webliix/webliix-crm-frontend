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
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import BadgeIcon from "@mui/icons-material/Badge";
import { PageLayout } from "@/shared/components/ui/layout";
import { BrandLoader } from "@/shared/components/ui/feedback/BrandLoader";
import { tokens } from "@/theme/tokens";
import { http } from "@/shared/services/http";

interface EmployeeItem {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentName: string;
  designationName: string;
  status: string;
  joiningDate: string;
}

interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  newThisMonth: number;
}

const statusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "INACTIVE":
      return "default";
    case "ON_LEAVE":
      return "warning";
    case "TERMINATED":
      return "error";
    default:
      return "default";
  }
};

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      http.get("/api/v1/employees", { params: { page: 0, size: 20 } }),
      http.get("/api/v1/employees/statistics"),
    ])
      .then(([empRes, statsRes]) => {
        const empData = empRes.data?.data;
        if (Array.isArray(empData)) {
          setEmployees(empData);
        } else if (empData?.content) {
          setEmployees(empData.content);
        } else {
          setEmployees([]);
        }

        const sData = statsRes.data?.data;
        if (sData) setStats(sData);
      })
      .catch(() => {
        setError("Failed to load employee data. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "Total Employees",
      value: stats?.totalEmployees ?? 0,
      icon: <PeopleIcon fontSize="large" />,
      color: tokens.colors.primary.main,
      bg: tokens.colors.primary[50],
    },
    {
      label: "Active",
      value: stats?.activeEmployees ?? 0,
      icon: <BadgeIcon fontSize="large" />,
      color: tokens.colors.success[700],
      bg: tokens.colors.success[50],
    },
    {
      label: "Inactive",
      value: stats?.inactiveEmployees ?? 0,
      icon: <PersonOffIcon fontSize="large" />,
      color: tokens.colors.secondary[600],
      bg: tokens.colors.secondary[100],
    },
    {
      label: "New This Month",
      value: stats?.newThisMonth ?? 0,
      icon: <PersonAddIcon fontSize="large" />,
      color: tokens.colors.warning[700],
      bg: tokens.colors.warning[50],
    },
  ];

  return (
    <PageLayout
      title="Employee Management"
      subtitle="View and manage all employee records, departments, and designations"
    >
      {loading ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <BrandLoader message="Loading employee records..." size="medium" />
        </Box>
      ) : error ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <Box sx={{ display: "grid", gap: 3 }}>
          {/* Stats Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 2,
            }}
          >
            {statCards.map((card) => (
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

          {/* Employees Table */}
          {employees.length === 0 ? (
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Typography color="text.secondary">No employees found.</Typography>
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
                      <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Designation</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Joining Date</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employees.map((e) => (
                      <TableRow key={e.id} hover>
                        <TableCell
                          sx={{
                            fontFamily: "monospace",
                            color: tokens.colors.secondary[600],
                          }}
                        >
                          {e.employeeCode}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: tokens.colors.secondary[900] }}>
                          {e.firstName} {e.lastName}
                        </TableCell>
                        <TableCell>{e.email}</TableCell>
                        <TableCell>{e.phone}</TableCell>
                        <TableCell>{e.departmentName}</TableCell>
                        <TableCell>{e.designationName}</TableCell>
                        <TableCell>
                          {e.joiningDate ? new Date(e.joiningDate).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={e.status}
                            color={statusColor(e.status) as any}
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
        </Box>
      )}
    </PageLayout>
  );
}
