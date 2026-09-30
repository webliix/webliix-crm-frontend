import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { PageLayout } from "@/shared/components/ui/layout";
import { BrandLoader } from "@/shared/components/ui/feedback/BrandLoader";
import { tokens } from "@/theme/tokens";
import { http } from "@/shared/services/http";

interface AutomationRule {
  id: number;
  ruleName: string;
  triggerEvent: string;
  actionType: string;
  active: boolean;
  executionCount?: number;
}

export default function AutomationsListPage() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get("/api/v1/automations")
      .then((res) => {
        const data = res.data?.data;
        if (Array.isArray(data)) setRules(data);
        else if (data?.content) setRules(data.content);
        else setRules(sampleRules);
        setLoading(false);
      })
      .catch(() => {
        setRules(sampleRules);
        setLoading(false);
      });
  }, []);

  const sampleRules: AutomationRule[] = [
    {
      id: 1,
      ruleName: "Automated Welcome & Credentials Email",
      triggerEvent: "CUSTOMER_CREATED",
      actionType: "SEND_EMAIL_VIA_BREVO",
      active: true,
      executionCount: 42,
    },
    {
      id: 2,
      ruleName: "Lead WhatsApp Confirmation Dispatch",
      triggerEvent: "PUBLIC_LEAD_SUBMITTED",
      actionType: "WHATSAPP_GREETING_URL",
      active: true,
      executionCount: 128,
    },
    {
      id: 3,
      ruleName: "Support Ticket SLA Violation Alert",
      triggerEvent: "TICKET_SLA_EXPIRED",
      actionType: "NOTIFY_SUPER_ADMIN",
      active: true,
      executionCount: 5,
    },
  ];

  const handleToggle = (id: number) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  return (
    <PageLayout
      title="Workflow Automations"
      subtitle="Configure event triggers, automated Brevo email sequences, and customer notifications"
      actions={
        <Button variant="contained" startIcon={<AddIcon />} sx={{ fontWeight: 700 }}>
          New Automation Rule
        </Button>
      }
    >
      {loading ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <BrandLoader message="Loading automation triggers..." size="medium" />
        </Box>
      ) : (
        <Box sx={{ display: "grid", gap: 3 }}>
          {rules.map((rule) => (
            <Card
              key={rule.id}
              sx={{
                borderRadius: tokens.borderRadius.lg,
                border: `1px solid ${tokens.colors.secondary[200]}`,
                boxShadow: tokens.shadows.sm,
              }}
            >
              <CardContent sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ p: 1.5, borderRadius: tokens.borderRadius.md, bgcolor: tokens.colors.primary[50], color: tokens.colors.primary.main }}>
                    <AutoFixHighIcon />
                  </Box>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Typography variant="subtitle1" fontWeight={800} color={tokens.colors.secondary[900]}>
                        {rule.ruleName}
                      </Typography>
                      <Chip label={rule.triggerEvent} size="small" sx={{ fontWeight: 700, fontSize: "0.7rem" }} />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Action: <strong>{rule.actionType}</strong> • Triggered {rule.executionCount ?? 0} times
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Chip
                    label={rule.active ? "Active" : "Disabled"}
                    color={rule.active ? "success" : "default"}
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                  <Switch checked={rule.active} onChange={() => handleToggle(rule.id)} color="primary" />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </PageLayout>
  );
}
