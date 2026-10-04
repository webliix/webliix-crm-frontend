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
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <PeopleAltOutlinedIcon color="primary" sx={{ fontSize: 36 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {total || leads.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Leads
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CheckCircleOutlinedIcon color="info" sx={{ fontSize: 36 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold" color="info.main">
                {qualifiedCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Qualified Prospects
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ContactMailOutlinedIcon color="warning" sx={{ fontSize: 36 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold" color="warning.main">
                {inProgressCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Contact / Proposal
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <EmojiEventsOutlinedIcon color="success" sx={{ fontSize: 36 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold" color="success.main">
                {wonCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
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
