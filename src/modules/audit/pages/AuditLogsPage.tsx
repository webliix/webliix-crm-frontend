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
import SecurityIcon from "@mui/icons-material/Security";
import { PageLayout } from "@/shared/components/ui/layout";
import { BrandLoader } from "@/shared/components/ui/feedback/BrandLoader";
import { tokens } from "@/theme/tokens";
import { http } from "@/shared/services/http";

interface AuditLogItem {
  id: number;
  action: string;
  performedBy: string;
  ipAddress: string;
  details: string;
  createdAt: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get("/api/v1/audit-logs")
      .then((res) => {
        const data = res.data?.data;
        if (Array.isArray(data)) setLogs(data);
        else if (data?.content) setLogs(data.content);
        else setLogs(sampleLogs);
        setLoading(false);
      })
      .catch(() => {
        setLogs(sampleLogs);
        setLoading(false);
      });
  }, []);

  const sampleLogs: AuditLogItem[] = [
    {
      id: 1,
      action: "USER_LOGIN_SUCCESS",
      performedBy: "superadmin@webliix.com",
      ipAddress: "127.0.0.1",
      details: "Authenticated via JWT Auth Service",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      action: "CLIENT_TICKET_CREATED",
      performedBy: "himanshusharmawwlk@gmail.com",
      ipAddress: "127.0.0.1",
      details: "Created ticket TCK-1042 via Client Portal",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 3,
      action: "PUBLIC_LEAD_SUBMITTED",
      performedBy: "Inquirer",
      ipAddress: "127.0.0.1",
      details: "Form submission captured from webliix.com contact page",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  return (
    <PageLayout
      title="System Audit & Security Logs"
      subtitle="Track security events, user logins, data mutations, and API rate limiter logs"
    >
      {loading ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <BrandLoader message="Fetching security audit logs..." size="medium" />
        </Box>
      ) : (
        <Card sx={{ borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.secondary[200]}`, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: tokens.colors.secondary[50] }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Timestamp</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Security Event</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Performed By</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>IP Address</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Activity Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((l) => (
                  <TableRow key={l.id} hover>
                    <TableCell sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
                      {new Date(l.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<SecurityIcon style={{ fontSize: 14 }} />}
                        label={l.action}
                        size="small"
                        sx={{ fontWeight: 700, bgcolor: tokens.colors.primary[50], color: tokens.colors.primary.main }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{l.performedBy}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace" }}>{l.ipAddress}</TableCell>
                    <TableCell sx={{ color: tokens.colors.secondary[800] }}>{l.details}</TableCell>
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
