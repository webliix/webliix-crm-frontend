import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import { PageLayout } from "@/shared/components/ui/layout";
import { LeadTable } from "@/modules/leads/components/LeadTable";
import { useLeads } from "@/modules/leads/hooks/useLeads";
import { LeadDetailsDrawer } from "@/modules/leads/components/LeadDetailsDrawer";
import { useNavigate } from "react-router-dom";
import { ActionGuard } from "@/shared/components/rbac/ActionGuard";
import { permissions } from "@/shared/rbac/permissions";

export default function LeadListPage() {
  const { rows, total, page, size, setPage, setSize, setSearch, isLoading } = useLeads();
  const leads = rows ?? [];
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleView = (id: number) => {
    setSelectedId(id);
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setSelectedId(null);
    setDrawerOpen(false);
  };

  const handleEdit = (id: number) => {
    navigate(`/leads/${id}/edit`);
  };

  const handleSearchChange = (val: string) => {
    setSearchValue(val);
    setSearch(val);
  };

  const qualifiedCount = leads.filter((l: any) => String(l.status).toUpperCase() === "QUALIFIED").length;
  const inProgressCount = leads.filter((l: any) => {
    const s = String(l.status).toUpperCase();
    return s === "CONTACTED" || s === "PROPOSAL_SENT" || s === "NEGOTIATION" || s === "IN_PROGRESS";
  }).length;
  const wonCount = leads.filter(
    (l: any) => String(l.status).toUpperCase() === "WON" || Boolean(l.converted)
  ).length;

  return (
    <PageLayout
      title="Leads Pipeline & Opportunities"
      subtitle="Manage, qualify, and convert potential client sales opportunities into active accounts"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard", onClick: () => navigate("/dashboard") },
        { label: "Leads" },
      ]}
      actions={
        <ActionGuard permission={permissions.leads.create}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/leads/create")}
            sx={{ fontWeight: "bold" }}
          >
            Create New Lead
          </Button>
        </ActionGuard>
      }
    >
      {/* Metrics Row */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 3, mb: 3 }}>
        <Card
          variant="outlined"
          sx={{
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
            transition: "all 0.2s ease",
            "&:hover": { borderColor: "primary.main", boxShadow: "0 4px 16px rgba(0,0,0,0.04)", transform: "translateY(-1px)" },
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5 }}>
            <Box sx={{ p: 1.25, borderRadius: "8px", bgcolor: "#eef2ff", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PeopleAltOutlinedIcon sx={{ fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} color="#0f172a" lineHeight={1.2}>
                {total || leads.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Total Leads
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          variant="outlined"
          sx={{
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
            transition: "all 0.2s ease",
            "&:hover": { borderColor: "info.main", boxShadow: "0 4px 16px rgba(0,0,0,0.04)", transform: "translateY(-1px)" },
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5 }}>
            <Box sx={{ p: 1.25, borderRadius: "8px", bgcolor: "#f0f9ff", color: "#0ea5e9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircleOutlinedIcon sx={{ fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} color="#0ea5e9" lineHeight={1.2}>
                {qualifiedCount}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Qualified Prospects
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          variant="outlined"
          sx={{
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
            transition: "all 0.2s ease",
            "&:hover": { borderColor: "warning.main", boxShadow: "0 4px 16px rgba(0,0,0,0.04)", transform: "translateY(-1px)" },
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5 }}>
            <Box sx={{ p: 1.25, borderRadius: "8px", bgcolor: "#fffbeb", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ContactMailOutlinedIcon sx={{ fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} color="#f59e0b" lineHeight={1.2}>
                {inProgressCount}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                In Contact / Proposal
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          variant="outlined"
          sx={{
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
            transition: "all 0.2s ease",
            "&:hover": { borderColor: "success.main", boxShadow: "0 4px 16px rgba(0,0,0,0.04)", transform: "translateY(-1px)" },
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5 }}>
            <Box sx={{ p: 1.25, borderRadius: "8px", bgcolor: "#ecfdf5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <EmojiEventsOutlinedIcon sx={{ fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} color="#10b981" lineHeight={1.2}>
                {wonCount}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Won / Converted
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Filter / Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search leads by company, contact, or email..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          size="small"
          sx={{ maxWidth: 400, width: "100%" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Lead Table */}
      <LeadTable
        leads={leads}
        total={total}
        page={page}
        pageSize={size}
        loading={isLoading}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(s) => setSize(s)}
        onView={handleView}
        onEdit={handleEdit}
      />

      <LeadDetailsDrawer id={selectedId ?? undefined} open={drawerOpen} onClose={handleClose} />
    </PageLayout>
  );
}
