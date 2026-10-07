import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { PageLayout } from "@/shared/components/ui/layout";
import { BrandLoader } from "@/shared/components/ui/feedback/BrandLoader";
import { tokens } from "@/theme/tokens";
import { http } from "@/shared/services/http";

export interface Offer {
  id: number;
  title: string;
  description: string;
  code: string;
  discount: string;
  badge?: string;
  badgeColor?: "primary" | "secondary" | "success" | "warning";
  features?: string;
  expiresAt?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function OffersListPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form Modal State
  const [openModal, setOpenModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [description, setDescription] = useState("");
  const [badge, setBadge] = useState("Special Deal");
  const [badgeColor, setBadgeColor] = useState<"primary" | "secondary" | "success" | "warning">("primary");
  const [features, setFeatures] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete State
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await http.get("/api/v1/offers?all=true");
      const data = res.data?.data;
      if (Array.isArray(data)) {
        setOffers(data);
      } else if (data?.content) {
        setOffers(data.content);
      } else {
        setOffers([]);
      }
    } catch {
      setError("Failed to fetch offers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleOpenCreate = () => {
    setEditingOffer(null);
    setTitle("");
    setCode("");
    setDiscount("");
    setDescription("");
    setBadge("Special Deal");
    setBadgeColor("primary");
    setFeatures("");
    setExpiresAt("");
    setActive(true);
    setFormError(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setTitle(offer.title || "");
    setCode(offer.code || "");
    setDiscount(offer.discount || "");
    setDescription(offer.description || "");
    setBadge(offer.badge || "Special Deal");
    setBadgeColor((offer.badgeColor as any) || "primary");
    setFeatures(offer.features || "");
    setExpiresAt(offer.expiresAt || "");
    setActive(offer.active);
    setFormError(null);
    setOpenModal(true);
  };

  const handleToggle = async (id: number) => {
    try {
      await http.patch(`/api/v1/offers/${id}/toggle`, {});
      setOffers((prev) =>
        prev.map((o) => (o.id === id ? { ...o, active: !o.active } : o))
      );
    } catch {
      // Toggle failed
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim() || !discount.trim()) {
      setFormError("Title, Offer Code, and Discount are required.");
      return;
    }

    setSaving(true);
    setFormError(null);

    const payload = {
      title: title.trim(),
      code: code.trim().toUpperCase(),
      discount: discount.trim(),
      description: description.trim(),
      badge: badge.trim(),
      badgeColor,
      features: features.trim(),
      expiresAt: expiresAt.trim() || undefined,
      active,
    };

    try {
      if (editingOffer) {
        await http.put(`/api/v1/offers/${editingOffer.id}`, payload);
      } else {
        await http.post("/api/v1/offers", payload);
      }
      setOpenModal(false);
      fetchOffers();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Failed to save offer.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await http.delete(`/api/v1/offers/${deleteId}`);
      setDeleteId(null);
      fetchOffers();
    } catch {
      alert("Failed to delete offer.");
    } finally {
      setDeleting(false);
    }
  };

  const totalOffers = offers.length;
  const activeOffers = offers.filter((o) => o.active).length;
  const inactiveOffers = totalOffers - activeOffers;

  return (
    <PageLayout
      title="Promotional & Client Offers"
      subtitle="Publish special discounts, coupons, and promotional services displayed in the Client Portal."
      actions={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{
            fontWeight: 700,
            borderRadius: `${tokens.borderRadius.md}px`,
            textTransform: "none",
            bgcolor: tokens.colors.primary.main,
          }}
        >
          + Create New Offer
        </Button>
      }
    >
      {/* KPI Cards */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2.5, mb: 3 }}>
        <Card sx={{ borderRadius: `${tokens.borderRadius.lg}px`, border: `1px solid ${tokens.colors.secondary[200]}` }}>
          <CardContent sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: `${tokens.borderRadius.md}px`, bgcolor: tokens.colors.primary[50], color: tokens.colors.primary.main }}>
              <LocalOfferIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase">
                Total Offers
              </Typography>
              <Typography variant="h5" fontWeight={800} color={tokens.colors.secondary[900]}>
                {totalOffers}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: `${tokens.borderRadius.lg}px`, border: `1px solid ${tokens.colors.secondary[200]}` }}>
          <CardContent sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: `${tokens.borderRadius.md}px`, bgcolor: tokens.colors.success[50], color: tokens.colors.success.main }}>
              <CheckCircleOutlineIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase">
                Active in Client Portal
              </Typography>
              <Typography variant="h5" fontWeight={800} color={tokens.colors.success[700]}>
                {activeOffers}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: `${tokens.borderRadius.lg}px`, border: `1px solid ${tokens.colors.secondary[200]}` }}>
          <CardContent sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: `${tokens.borderRadius.md}px`, bgcolor: tokens.colors.warning[50], color: tokens.colors.warning.main }}>
              <LocalOfferIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase">
                Inactive / Draft
              </Typography>
              <Typography variant="h5" fontWeight={800} color={tokens.colors.warning[700]}>
                {inactiveOffers}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
          <BrandLoader message="Loading promotional offers..." size="medium" />
        </Box>
      ) : offers.length === 0 ? (
        <Card sx={{ p: 6, textAlign: "center", borderRadius: `${tokens.borderRadius.lg}px`, border: `1px solid ${tokens.colors.secondary[200]}` }}>
          <LocalOfferIcon sx={{ fontSize: 48, color: tokens.colors.secondary[300], mb: 1.5 }} />
          <Typography variant="h6" fontWeight={700} gutterBottom>
            No Offers Created Yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create promotional offers and vouchers that will be dynamically displayed to clients on their portal.
          </Typography>
          <Button variant="contained" onClick={handleOpenCreate} startIcon={<AddIcon />}>
            Create First Offer
          </Button>
        </Card>
      ) : (
        <Card sx={{ borderRadius: `${tokens.borderRadius.lg}px`, overflow: "hidden", border: `1px solid ${tokens.colors.secondary[200]}` }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: tokens.colors.secondary[50] }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Offer Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Discount / Value</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Badge</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Validity / Expiry</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Client Portal Visibility</TableCell>
                  <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {offers.map((offer) => (
                  <TableRow key={offer.id} hover>
                    <TableCell>
                      <Chip
                        label={offer.code}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          bgcolor: tokens.colors.primary[50],
                          color: tokens.colors.primary.main,
                          fontFamily: "monospace",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 260 }}>
                      <Typography variant="body2" fontWeight={700}>{offer.title}</Typography>
                      {offer.description && (
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
                          {offer.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: tokens.colors.success[700] }}>
                      {offer.discount}
                    </TableCell>
                    <TableCell>
                      {offer.badge ? (
                        <Chip
                          label={offer.badge}
                          size="small"
                          color={offer.badgeColor || "primary"}
                          variant="outlined"
                          sx={{ fontWeight: 700, fontSize: "0.75rem" }}
                        />
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {offer.expiresAt || "Ongoing / No Expiry"}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Switch
                          size="small"
                          checked={offer.active}
                          onChange={() => handleToggle(offer.id)}
                          color="primary"
                        />
                        <Typography variant="caption" fontWeight={600} color={offer.active ? "success.main" : "text.secondary"}>
                          {offer.active ? "Published" : "Draft"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <IconButton size="small" onClick={() => handleOpenEdit(offer)} sx={{ color: tokens.colors.primary.main, mr: 0.5 }}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => setDeleteId(offer.id)} sx={{ color: tokens.colors.error.main }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingOffer ? "Edit Promotional Offer" : "Create New Promotional Offer"}
        </DialogTitle>
        <Box component="form" onSubmit={handleSave}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {formError && <Alert severity="error">{formError}</Alert>}

            <TextField
              label="Offer Title"
              fullWidth
              required
              placeholder="e.g., AI Integration & Workflow Copilot"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <TextField
                label="Promo Code"
                fullWidth
                required
                placeholder="e.g., WEBLIIX-AI-25"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                helperText="Must be unique"
              />
              <TextField
                label="Discount / Perk"
                fullWidth
                required
                placeholder="e.g., 25% OFF or $1,200 Credit"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <TextField
                label="Badge Label"
                fullWidth
                placeholder="e.g., Most Popular"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel id="badge-color-select">Badge Color</InputLabel>
                <Select
                  labelId="badge-color-select"
                  value={badgeColor}
                  label="Badge Color"
                  onChange={(e) => setBadgeColor(e.target.value as any)}
                >
                  <MenuItem value="primary">Primary (Blue)</MenuItem>
                  <MenuItem value="secondary">Secondary (Slate)</MenuItem>
                  <MenuItem value="success">Success (Green)</MenuItem>
                  <MenuItem value="warning">Warning (Amber)</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Offer Description"
              multiline
              rows={2}
              fullWidth
              placeholder="Explain the value proposition for the client..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <TextField
              label="Included Features & Perks (One per line)"
              multiline
              rows={3}
              fullWidth
              placeholder={"Custom LLM fine-tuning or RAG pipelines\nSeamless integration with database\nDedicated consultation session"}
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              helperText="Lines will appear as bulleted checklist items in client portal."
            />

            <TextField
              label="Expiration / Validity Note"
              fullWidth
              placeholder="e.g., Valid until November 30, 2026"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  color="primary"
                />
              }
              label={active ? "Active & Visible in Client Portal" : "Draft (Hidden from Clients)"}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={saving} sx={{ fontWeight: 700 }}>
              {saving ? "Saving..." : editingOffer ? "Update Offer" : "Publish Offer"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to permanently delete this offer? It will no longer be visible to any clients.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={deleting} sx={{ fontWeight: 700 }}>
            {deleting ? "Deleting..." : "Delete Offer"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
}
