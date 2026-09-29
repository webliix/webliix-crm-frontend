import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  Tooltip,
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GoogleIcon from "@mui/icons-material/Google";
import LanguageIcon from "@mui/icons-material/Language";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import RateReviewIcon from "@mui/icons-material/RateReview";
import VerifiedIcon from "@mui/icons-material/Verified";
import { PageLayout } from "@/shared/components/ui/layout";
import { AppButton } from "@/shared/components/ui/button";
import { LoadingScreen, ErrorState } from "@/shared/components/ui/feedback";
import { reviewApi, type ReviewItem, type ReviewPlatform, type CreateReviewPayload } from "../api/review.api";

export default function ReviewListPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add review dialog state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addPayload, setAddPayload] = useState<CreateReviewPayload>({
    authorName: "",
    companyName: "",
    email: "",
    rating: 5,
    reviewText: "",
    platform: "GOOGLE",
    platformUrl: "",
    serviceUsed: "",
    publishConsent: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reviewApi.getAllReviews(0, 100);
      const data = res.data?.data?.content || res.data?.content || res.data || [];
      setReviews(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApproved = async (id: number) => {
    try {
      await reviewApi.toggleApproved(id);
      fetchReviews();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update approval status");
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      await reviewApi.toggleFeatured(id);
      fetchReviews();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update featured status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await reviewApi.deleteReview(id);
      fetchReviews();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete review");
    }
  };

  const handleCreateReview = async () => {
    if (!addPayload.authorName.trim() || !addPayload.reviewText.trim()) {
      alert("Please enter author name and review text.");
      return;
    }
    setSubmitting(true);
    try {
      await reviewApi.createReview(addPayload);
      setIsAddOpen(false);
      setAddPayload({
        authorName: "",
        companyName: "",
        email: "",
        rating: 5,
        reviewText: "",
        platform: "GOOGLE",
        platformUrl: "",
        serviceUsed: "",
        publishConsent: true,
      });
      fetchReviews();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Failed to create review");
    } finally {
      setSubmitting(false);
    }
  };

  const getPlatformChip = (platform: ReviewPlatform) => {
    switch (platform) {
      case "GOOGLE":
        return <Chip icon={<GoogleIcon />} label="Google Review" color="error" size="small" variant="outlined" />;
      case "LINKEDIN":
        return <Chip icon={<LinkedInIcon />} label="LinkedIn Review" color="info" size="small" variant="outlined" />;
      case "WEBSITE":
        return <Chip icon={<LanguageIcon />} label="Website Review" color="success" size="small" variant="outlined" />;
      default:
        return <Chip icon={<RateReviewIcon />} label={platform || "Review"} color="default" size="small" variant="outlined" />;
    }
  };

  const approvedCount = reviews.filter((r) => r.approved).length;
  const featuredCount = reviews.filter((r) => r.featured).length;

  if (loading && reviews.length === 0) {
    return (
      <PageLayout title="Reviews & Feedback Control" subtitle="Manage website testimonials and platform reviews">
        <LoadingScreen message="Loading reviews..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Reviews & Feedback Moderation"
      subtitle="Manage public website testimonials, Google Business reviews, and platform feedback"
      actions={
        <Box sx={{ display: "flex", gap: 2 }}>
          <IconButton onClick={fetchReviews} color="inherit" title="Refresh">
            <RefreshIcon />
          </IconButton>
          <AppButton variant="contained" startIcon={<AddIcon />} onClick={() => setIsAddOpen(true)}>
            Add Manual Review
          </AppButton>
        </Box>
      }
    >
      {error && <ErrorState title="Error Loading Reviews" message={error} onRetry={fetchReviews} />}

      {/* Metrics Header */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 3, mb: 3 }}>
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <RateReviewIcon color="primary" sx={{ fontSize: 36 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {reviews.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Reviews
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 36 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold" color="success.main">
                {approvedCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Approved & Public
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <VerifiedIcon color="warning" sx={{ fontSize: 36 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold" color="warning.main">
                {featuredCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Featured on Homepage
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Reviews Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ backgroundColor: "action.hover" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Author & Company</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Platform Source</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Rating</TableCell>
              <TableCell sx={{ fontWeight: "bold", maxWidth: 300 }}>Review Content</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Approved</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Featured</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    No reviews stored in system yet.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {item.authorName}
                    </Typography>
                    {item.companyName && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        {item.companyName}
                      </Typography>
                    )}
                    {item.serviceUsed && (
                      <Chip label={item.serviceUsed} size="small" variant="outlined" sx={{ mt: 0.5 }} />
                    )}
                  </TableCell>
                  <TableCell>{getPlatformChip(item.platform)}</TableCell>
                  <TableCell>
                    <Rating value={item.rating} readOnly precision={0.5} size="small" />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                      {item.reviewText}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={item.approved}
                      onChange={() => handleToggleApproved(item.id)}
                      color="success"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={item.featured}
                      onChange={() => handleToggleFeatured(item.id)}
                      color="warning"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Delete Review">
                      <IconButton onClick={() => handleDelete(item.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Review Dialog */}
      <Dialog open={isAddOpen} onClose={() => !submitting && setIsAddOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>Add Manual / External Review</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, pt: 1 }}>
            <TextField
              label="Author Name"
              fullWidth
              required
              value={addPayload.authorName}
              onChange={(e) => setAddPayload({ ...addPayload, authorName: e.target.value })}
            />
            <TextField
              label="Company / Business Name"
              fullWidth
              value={addPayload.companyName}
              onChange={(e) => setAddPayload({ ...addPayload, companyName: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Platform Source</InputLabel>
              <Select
                value={addPayload.platform}
                label="Platform Source"
                onChange={(e) => setAddPayload({ ...addPayload, platform: e.target.value as ReviewPlatform })}
              >
                <MenuItem value="GOOGLE">Google Business Profile</MenuItem>
                <MenuItem value="WEBSITE">Website Feedback</MenuItem>
                <MenuItem value="LINKEDIN">LinkedIn Recommendation</MenuItem>
                <MenuItem value="TRUSTPILOT">Trustpilot</MenuItem>
                <MenuItem value="OTHER">Other Platform</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ pt: 0.5 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Star Rating (1 - 5)
              </Typography>
              <Rating
                value={addPayload.rating}
                onChange={(_, val) => setAddPayload({ ...addPayload, rating: val || 5 })}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
              <TextField
                label="Platform Profile/Review URL (Optional)"
                fullWidth
                placeholder="https://g.page/r/..."
                value={addPayload.platformUrl}
                onChange={(e) => setAddPayload({ ...addPayload, platformUrl: e.target.value })}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
              <TextField
                label="Service Delivered"
                fullWidth
                placeholder="e.g. Webliix LaunchKit, Website Development"
                value={addPayload.serviceUsed}
                onChange={(e) => setAddPayload({ ...addPayload, serviceUsed: e.target.value })}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
              <TextField
                label="Review Content"
                fullWidth
                required
                multiline
                rows={4}
                value={addPayload.reviewText}
                onChange={(e) => setAddPayload({ ...addPayload, reviewText: e.target.value })}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setIsAddOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCreateReview} disabled={submitting || !addPayload.authorName.trim() || !addPayload.reviewText.trim()}>
            {submitting ? "Saving..." : "Save Review"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
}
