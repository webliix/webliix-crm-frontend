import { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Chip from "@mui/material/Chip";
import SendIcon from "@mui/icons-material/Send";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import FolderSpecialOutlinedIcon from "@mui/icons-material/FolderSpecialOutlined";
import { AppDrawer } from "@/shared/components/ui/dialog";
import { AppButton } from "@/shared/components/ui/button";
import { AppTextField } from "@/shared/components/ui/form";
import { AppStatusChip, LoadingScreen } from "@/shared/components/ui/feedback";
import { useTicketDetails, useTicketComments } from "../hooks/useTicketDetails";
import { useUpdateTicket, useAssignTicket, useAddComment } from "../hooks/useTicketMutations";
import { useCurrentUser } from "@/modules/auth/hooks/useCurrentUser";
import { http } from "@/shared/services/http";
import { formatDateTime } from "@/shared/utils/formatters";
import { tokens } from "@/theme/tokens";
import { useNavigate } from "react-router-dom";
import type { TicketPriority, TicketStatus } from "../types/ticket.types";

interface EmployeeOption {
  id: number;
  firstName: string;
  lastName?: string;
  designationName?: string;
  departmentName?: string;
  email?: string;
}

interface TicketDetailsDrawerProps {
  ticketId: number | null;
  open: boolean;
  onClose: () => void;
}

export function TicketDetailsDrawer({ ticketId, open, onClose }: TicketDetailsDrawerProps) {
  const navigate = useNavigate();
  const { data: ticket, isLoading } = useTicketDetails(ticketId);
  const { data: comments = [] } = useTicketComments(ticketId);
  const { data: currentUser } = useCurrentUser();
  const updateTicketMutation = useUpdateTicket();
  const assignTicketMutation = useAssignTicket();
  const addCommentMutation = useAddComment();

  const [message, setMessage] = useState("");
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      http
        .get("/api/v1/employees", { params: { size: 100 } })
        .then((res) => {
          const list = res.data?.data?.content ?? res.data?.data ?? [];
          setEmployees(list);
        })
        .catch(() => {
          setEmployees([]);
        });
    }
  }, [open]);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  if (!ticketId || !open) return null;

  const handleStatusChange = (newStatus: TicketStatus) => {
    if (!ticket) return;
    updateTicketMutation.mutate({
      id: ticket.id,
      payload: { status: newStatus },
    });
  };

  const handlePriorityChange = (newPriority: TicketPriority) => {
    if (!ticket) return;
    updateTicketMutation.mutate({
      id: ticket.id,
      payload: { priority: newPriority },
    });
  };

  const handleAssigneeChange = (employeeId: number) => {
    if (!ticket || !employeeId) return;
    assignTicketMutation.mutate({
      id: ticket.id,
      payload: { employeeId },
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !ticket) return;

    const senderName =
      currentUser?.firstName || currentUser?.email
        ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || currentUser.email
        : "Support Team";

    addCommentMutation.mutate(
      {
        ticketId: ticket.id,
        payload: {
          comment: message.trim(),
          commentedBy: senderName,
        },
      },
      {
        onSuccess: () => {
          setMessage("");
        },
      }
    );
  };

  return (
    <AppDrawer
      open={open}
      onClose={onClose}
      title={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography variant="h6" fontWeight={700} color={tokens.colors.primary.main}>
            {ticket?.ticketNumber || "Ticket"}
          </Typography>
          {ticket && <AppStatusChip status={ticket.status} />}
        </Box>
      }
      subtitle={ticket?.title || "Ticket inquiry details and live chat"}
      width="md"
    >
      {isLoading || !ticket ? (
        <LoadingScreen message="Loading ticket thread..." />
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", gap: 2.5 }}>
          {/* Metadata & Assignment Controls Card */}
          <Box
            sx={{
              p: 2,
              borderRadius: tokens.borderRadius.md,
              bgcolor: tokens.colors.secondary[50],
              border: `1px solid ${tokens.colors.secondary[200]}`,
              display: "grid",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                gap: 2,
              }}
            >
              {/* Status Selector */}
              <Box>
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
                  Status
                </Typography>
                <FormControl size="small" fullWidth>
                  <Select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                    sx={{ bgcolor: "#ffffff", borderRadius: tokens.borderRadius.sm }}
                  >
                    <MenuItem value="OPEN">OPEN</MenuItem>
                    <MenuItem value="IN_PROGRESS">IN PROGRESS</MenuItem>
                    <MenuItem value="RESOLVED">RESOLVED</MenuItem>
                    <MenuItem value="CLOSED">CLOSED</MenuItem>
                    <MenuItem value="REOPENED">REOPENED</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Priority Selector */}
              <Box>
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
                  Priority
                </Typography>
                <FormControl size="small" fullWidth>
                  <Select
                    value={ticket.priority}
                    onChange={(e) => handlePriorityChange(e.target.value as TicketPriority)}
                    sx={{ bgcolor: "#ffffff", borderRadius: tokens.borderRadius.sm }}
                  >
                    <MenuItem value="LOW">LOW</MenuItem>
                    <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                    <MenuItem value="HIGH">HIGH</MenuItem>
                    <MenuItem value="CRITICAL">CRITICAL</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Support Team Assignee */}
              <Box>
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
                  Assigned Support Agent
                </Typography>
                <FormControl size="small" fullWidth>
                  <Select
                    value={ticket.assignedToId || ""}
                    onChange={(e) => handleAssigneeChange(Number(e.target.value))}
                    displayEmpty
                    disabled={assignTicketMutation.isPending}
                    sx={{ bgcolor: "#ffffff", borderRadius: tokens.borderRadius.sm }}
                  >
                    <MenuItem value="">
                      <em>Unassigned</em>
                    </MenuItem>
                    {employees.map((emp) => (
                      <MenuItem key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName || ""} {emp.designationName ? `(${emp.designationName})` : ""}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Divider />

            {/* Requester, Project & Category Info */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                gap: 1.5,
              }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Requester
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <PersonOutlineIcon sx={{ fontSize: 16, color: tokens.colors.secondary[500] }} />
                  {ticket.customerName || ticket.createdBy || "Client Portal User"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Associated Project
                </Typography>
                {ticket.projectId ? (
                  <Chip
                    icon={<FolderSpecialOutlinedIcon sx={{ fontSize: "14px !important" }} />}
                    label={ticket.projectName || `Project #${ticket.projectId}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                    clickable
                    onClick={() => navigate(`/projects/${ticket.projectId}`)}
                    sx={{ fontWeight: 600, fontSize: "0.75rem", cursor: "pointer" }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    General Inquiry
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Category & Created
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AppStatusChip status={ticket.category} statusType="neutral" sx={{ height: 22 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 14 }} />
                    {formatDateTime(ticket.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Ticket Original Description */}
          {ticket.description && (
            <Box
              sx={{
                p: 2,
                borderRadius: tokens.borderRadius.md,
                bgcolor: "#ffffff",
                border: `1px solid ${tokens.colors.secondary[200]}`,
              }}
            >
              <Typography variant="caption" fontWeight={700} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                ORIGINAL ISSUE INQUIRY
              </Typography>
              <Typography variant="body2" color={tokens.colors.secondary[800]} sx={{ whiteSpace: "pre-wrap" }}>
                {ticket.description}
              </Typography>
            </Box>
          )}

          {/* Live Support Conversation Thread */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: tokens.colors.primary.main }} />
              <Typography variant="subtitle2" fontWeight={700}>
                Live Support Chat Thread ({comments.length})
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#10b981", animation: "pulse 2s infinite" }} />
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Live Stream Active
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              minHeight: 260,
              maxHeight: 420,
              overflowY: "auto",
              p: 2,
              borderRadius: tokens.borderRadius.md,
              bgcolor: tokens.colors.secondary[50],
              border: `1px solid ${tokens.colors.secondary[200]}`,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {comments.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <SupportAgentIcon sx={{ fontSize: 36, color: tokens.colors.secondary[400], mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No replies yet. Send a message below to begin live support conversation.
                </Typography>
              </Box>
            ) : (
              comments.map((c) => {
                const isCustomer =
                  c.commentedBy.toLowerCase().includes("client") ||
                  c.commentedBy.toLowerCase().includes("visitor") ||
                  c.commentedBy === ticket.customerName ||
                  (ticket.createdBy && ticket.createdBy.includes(c.commentedBy));

                return (
                  <Box
                    key={c.id}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isCustomer ? "flex-start" : "flex-end",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          fontSize: "0.75rem",
                          bgcolor: isCustomer ? tokens.colors.warning.main : tokens.colors.primary.main,
                        }}
                      >
                        {(c.commentedBy || "U").charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="caption" fontWeight={700} color={tokens.colors.secondary[800]}>
                        {c.commentedBy} {isCustomer ? "(Client)" : "(Support Team)"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDateTime(c.createdAt)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: tokens.borderRadius.md,
                        maxWidth: "85%",
                        bgcolor: isCustomer ? "#ffffff" : tokens.colors.primary.main,
                        color: isCustomer ? tokens.colors.secondary[900] : "#ffffff",
                        border: isCustomer ? `1px solid ${tokens.colors.secondary[200]}` : "none",
                        boxShadow: tokens.shadows.sm,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      <Typography variant="body2">{c.comment}</Typography>
                    </Box>
                  </Box>
                );
              })
            )}
            <div ref={chatBottomRef} />
          </Box>

          {/* Live Message Form */}
          <form onSubmit={handleSendMessage}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <AppTextField
                fullWidth
                placeholder="Type your response to the customer or support team..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={addCommentMutation.isPending}
              />
              <AppButton
                type="submit"
                appVariant="primary"
                endIcon={<SendIcon sx={{ fontSize: 16 }} />}
                loading={addCommentMutation.isPending}
                disabled={!message.trim()}
              >
                Send
              </AppButton>
            </Box>
          </form>
        </Box>
      )}
    </AppDrawer>
  );
}
