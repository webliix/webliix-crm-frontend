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
import SecurityIcon from "@mui/icons-material/Security";
import { PageLayout } from "@/shared/components/ui/layout";
import { BrandLoader } from "@/shared/components/ui/feedback/BrandLoader";
import { tokens } from "@/theme/tokens";
import { http } from "@/shared/services/http";

interface AuditLogItem {
  id: number;
  userId: number;
  username: string;
  action: string;
  module: string;
  entityType: string;
  entityId: string;
  ipAddress: string;
  status: string;
  createdAt: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    http
      .post("/api/v1/audit/logs", { module: null, action: null, page: 0, size: 20 })
      .then((res) => {
        const data = res.data?.data;
        if (Array.isArray(data)) {
          setLogs(data);
        } else if (data?.content) {
          setLogs(data.content);
        } else {
          setLogs([]);
        }
      })
      .catch(() => {
        setError("Failed to load audit logs. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const getActionColor = (action: string) => {
    if (action?.includes("DELETE") || action?.includes("FAIL")) return "error";
    if (action?.includes("CREATE") || action?.includes("SUCCESS")) return "success";
    if (action?.includes("UPDATE")) return "warning";
    return "default";
  };

  return (
    <PageLayout
      title="System Audit & Security Logs"
      subtitle="Track security events, user logins, data mutations, and API rate limiter logs"
    >
      {loading ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <BrandLoader message="Fetching security audit logs..." size="medium" />
        </Box>
      ) : error ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : logs.length === 0 ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Typography color="text.secondary">No audit logs found.</Typography>
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
                  <TableCell sx={{ fontWeight: 700 }}>Timestamp</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Module</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Entity</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>IP Address</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((l) => (
                  <TableRow key={l.id} hover>
                    <TableCell sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
                      {new Date(l.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{l.username}</TableCell>
                    <TableCell>
                      <Chip
                        icon={<SecurityIcon style={{ fontSize: 14 }} />}
                        label={l.action}
                        size="small"
                        color={getActionColor(l.action) as any}
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={l.module}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: tokens.colors.primary[50],
                          color: tokens.colors.primary.main,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: tokens.colors.secondary[800] }}>
                      {l.entityType}
                      {l.entityId ? ` #${l.entityId}` : ""}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "monospace" }}>{l.ipAddress}</TableCell>
                    <TableCell>
                      <Chip
                        label={l.status}
                        size="small"
                        color={l.status === "SUCCESS" ? "success" : "error"}
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
