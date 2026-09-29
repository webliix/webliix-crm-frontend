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
  Alert,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import RefreshIcon from "@mui/icons-material/Refresh";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import UnsubscribeIcon from "@mui/icons-material/Unsubscribe";
import PeopleIcon from "@mui/icons-material/People";
import { PageLayout } from "@/shared/components/ui/layout";
import { AppButton } from "@/shared/components/ui/button";
import { LoadingScreen, ErrorState } from "@/shared/components/ui/feedback";
import { newsletterApi, type NewsletterSubscriber } from "../api/newsletter.api";

export default function SubscriberListPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Broadcast dialog state
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastContent, setBroadcastContent] = useState("");
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<string | null>(null);

  const fetchSubscribers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await newsletterApi.getSubscribers(0, 100);
      const data = res.data?.data?.content || res.data?.content || res.data || [];
      setSubscribers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load newsletter subscribers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleToggleStatus = async (id: number) => {
    try {
      await newsletterApi.toggleStatus(id);
      fetchSubscribers();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to remove this subscriber?")) return;
    try {
      await newsletterApi.deleteSubscriber(id);
      fetchSubscribers();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete subscriber");
    }
  };

  const handleSendBroadcast = async () => {
    if (!broadcastSubject.trim() || !broadcastContent.trim()) {
      alert("Please provide both subject and message content.");
      return;
    }
    setSendingBroadcast(true);
    setBroadcastResult(null);
    try {
      const res = await newsletterApi.sendBroadcast({
        subject: broadcastSubject,
        content: broadcastContent,
      });
      const count = res.data?.data ?? res.data ?? 0;
      setBroadcastResult(`Successfully dispatched broadcast to ${count} active subscribers!`);
      setBroadcastSubject("");
      setBroadcastContent("");
      setTimeout(() => {
        setIsBroadcastOpen(false);
        setBroadcastResult(null);
      }, 2500);
    } catch (err: any) {
      setBroadcastResult(`Error: ${err.response?.data?.message || err.message || "Broadcast dispatch failed"}`);
    } finally {
      setSendingBroadcast(false);
    }
  };

  const activeCount = subscribers.filter((s) => s.active).length;
  const inactiveCount = subscribers.filter((s) => !s.active).length;

  if (loading && subscribers.length === 0) {
    return (
      <PageLayout title="Newsletter Subscribers" subtitle="Manage public newsletter subscribers and send broadcast updates">
        <LoadingScreen message="Loading subscriber list..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Newsletter Subscribers & Broadcast"
      subtitle="Manage public website newsletter subscribers and send broadcast update emails"
      actions={
        <Box sx={{ display: "flex", gap: 2 }}>
          <IconButton onClick={fetchSubscribers} color="inherit" title="Refresh">
            <RefreshIcon />
          </IconButton>
          <AppButton variant="contained" startIcon={<SendIcon />} onClick={() => setIsBroadcastOpen(true)}>
            Compose Broadcast
          </AppButton>
        </Box>
      }
    >
      {error && <ErrorState title="Error Loading Subscribers" message={error} onRetry={fetchSubscribers} />}

      {/* Metrics Row */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 3, mb: 3 }}>
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <PeopleIcon color="primary" sx={{ fontSize: 36 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {subscribers.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Subscribers
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <MarkEmailReadIcon color="success" sx={{ fontSize: 36 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold" color="success.main">
                {activeCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Subscribers
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <UnsubscribeIcon color="error" sx={{ fontSize: 36 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold" color="error.main">
                {inactiveCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unsubscribed / Inactive
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Subscribers Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "action.hover" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Subscriber Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Source Page</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Subscribed At</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subscribers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    No newsletter subscribers found yet.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              subscribers.map((sub) => (
                <TableRow key={sub.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{sub.email}</TableCell>
                  <TableCell>
                    <Chip label={sub.sourcePage || "/"} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleString() : "N/A"}</TableCell>
                  <TableCell>
                    {sub.active ? (
                      <Chip label="Active" color="success" size="small" />
                    ) : (
                      <Chip label="Inactive" color="default" size="small" />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={sub.active ? "Deactivate Subscriber" : "Activate Subscriber"}>
                      <IconButton onClick={() => handleToggleStatus(sub.id)} color={sub.active ? "success" : "default"}>
                        {sub.active ? <ToggleOnIcon fontSize="large" /> : <ToggleOffIcon fontSize="large" />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Subscriber">
                      <IconButton onClick={() => handleDelete(sub.id)} color="error">
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

      {/* Broadcast Email Modal */}
      <Dialog open={isBroadcastOpen} onClose={() => !sendingBroadcast && setIsBroadcastOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>Compose Newsletter Broadcast</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This message will be sent to all <strong>{activeCount}</strong> active newsletter subscribers via Brevo SMTP.
          </Typography>

          {broadcastResult && (
            <Alert severity={broadcastResult.startsWith("Error") ? "error" : "success"} sx={{ mb: 2 }}>
              {broadcastResult}
            </Alert>
          )}

          <TextField
            label="Email Subject"
            fullWidth
            required
            value={broadcastSubject}
            onChange={(e) => setBroadcastSubject(e.target.value)}
            disabled={sendingBroadcast}
            sx={{ mb: 3, mt: 1 }}
            placeholder="e.g. Webliix Monthly Product Updates & New Features"
          />

          <TextField
            label="Email Content / Message"
            fullWidth
            required
            multiline
            rows={8}
            value={broadcastContent}
            onChange={(e) => setBroadcastContent(e.target.value)}
            disabled={sendingBroadcast}
            placeholder="Write your email announcement or update here..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setIsBroadcastOpen(false)} disabled={sendingBroadcast}>
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={sendingBroadcast ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
            onClick={handleSendBroadcast}
            disabled={sendingBroadcast || !broadcastSubject.trim() || !broadcastContent.trim()}
          >
            {sendingBroadcast ? "Sending Broadcast..." : "Send Broadcast Now"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
}
