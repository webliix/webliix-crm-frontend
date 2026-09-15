import { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import Drawer from "@mui/material/Drawer";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import { AppButton } from "@/shared/components/ui/button";
import { AppTextField } from "@/shared/components/ui/form";
import { AppStatusChip } from "@/shared/components/ui/feedback";
import {
  useCreatePublicTicket,
  usePublicTicketDetails,
  useAddPublicComment,
} from "../hooks/usePublicTicket";
import { http } from "@/shared/services/http";
import { notificationService } from "@/shared/notifications/notification.service";
import { formatDateTime } from "@/shared/utils/formatters";
import { tokens } from "@/theme/tokens";
import type { TicketCategory } from "../types/ticket.types";

export function WebsiteHelpWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTicketNumber, setActiveTicketNumber] = useState<string | null>(() => {
    return localStorage.getItem("webliix_active_ticket") || null;
  });
  const [viewMode, setViewMode] = useState<"NEW" | "CHAT" | "LEAD" | "LOOKUP">(
    activeTicketNumber ? "CHAT" : "NEW"
  );

  // Form State for new visitor query
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TicketCategory>("SUPPORT");

  // Lead capture state
  const [leadName, setLeadName] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadRequirements, setLeadRequirements] = useState("");
  const [leadService, setLeadService] = useState("Custom Web / Mobile Development");
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadWhatsappUrl, setLeadWhatsappUrl] = useState<string | null>(null);

  // Chat message & lookup state
  const [chatMessage, setChatMessage] = useState("");
  const [lookupTicketInput, setLookupTicketInput] = useState("");

  const chatBottomRef = useRef<HTMLDivElement>(null);

  const createPublicTicketMutation = useCreatePublicTicket();
  const { data: ticketDetails, refetch: refetchTicket } = usePublicTicketDetails(
    viewMode === "CHAT" ? activeTicketNumber : null
  );
  const addPublicCommentMutation = useAddPublicComment();

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [ticketDetails?.comments]);

  const handleStartConversation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !title.trim() || !description.trim()) return;

    createPublicTicketMutation.mutate(
      {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        title: title.trim(),
        description: description.trim(),
        category,
      },
      {
        onSuccess: (data) => {
          if (data?.ticketNumber) {
            setActiveTicketNumber(data.ticketNumber);
            localStorage.setItem("webliix_active_ticket", data.ticketNumber);
            setViewMode("CHAT");
          }
        },
      }
    );
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadEmail.trim() || !leadRequirements.trim()) return;

    setLeadSubmitting(true);
    try {
      const res = await http.post("/api/v1/public/leads", {
        name: leadName.trim(),
        companyName: leadCompany.trim() || undefined,
        email: leadEmail.trim(),
        phone: leadPhone.trim() || undefined,
        requirements: leadRequirements.trim(),
        serviceRequested: leadService,
        source: "WEBSITE",
      });

      const data = res.data?.data;
      notificationService.success("Project inquiry submitted! Confirmation email sent.");
      if (data?.whatsappConnectUrl) {
        setLeadWhatsappUrl(data.whatsappConnectUrl);
      }
    } catch (err: any) {
      notificationService.error(err?.message || "Failed to submit project inquiry");
    } finally {
      setLeadSubmitting(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !activeTicketNumber) return;

    const sender = name.trim() || ticketDetails?.customerName || "Visitor";

    addPublicCommentMutation.mutate(
      {
        ticketNumber: activeTicketNumber,
        payload: {
          comment: chatMessage.trim(),
          commentedBy: sender,
        },
      },
      {
        onSuccess: () => {
          setChatMessage("");
        },
      }
    );
  };

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupTicketInput.trim()) return;
    const cleanNum = lookupTicketInput.trim().toUpperCase();
    setActiveTicketNumber(cleanNum);
    localStorage.setItem("webliix_active_ticket", cleanNum);
    setViewMode("CHAT");
  };

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="support-chat"
        onClick={() => setIsOpen(true)}
        sx={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 1300,
          background: `linear-gradient(135deg, ${tokens.colors.primary.main} 0%, ${tokens.colors.primary[700]} 100%)`,
          boxShadow: "0 8px 24px rgba(30, 64, 175, 0.4)",
          "&:hover": {
            transform: "scale(1.05)",
            background: `linear-gradient(135deg, ${tokens.colors.primary[700]} 0%, ${tokens.colors.primary[800]} 100%)`,
          },
          transition: tokens.transitions.fast,
        }}
      >
        <SupportAgentIcon sx={{ fontSize: 28, color: "#ffffff" }} />
      </Fab>

      {/* Slide-in Help & Live Chat Drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 460 },
            display: "flex",
            flexDirection: "column",
            boxShadow: tokens.shadows.xl,
            p: 0,
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2.5,
            bgcolor: tokens.colors.primary.main,
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", color: "#ffffff", width: 40, height: 40 }}>
              <HeadsetMicIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                Webliix Connect
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.85 }}>
                Direct inquiry, WhatsApp chat & helpdesk
              </Typography>
            </Box>
          </Box>

          <IconButton onClick={() => setIsOpen(false)} sx={{ color: "#ffffff" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Mode Navigation Bar */}
        <Box
          sx={{
            display: "flex",
            borderBottom: `1px solid ${tokens.colors.secondary[200]}`,
            bgcolor: tokens.colors.secondary[50],
            overflowX: "auto",
          }}
        >
          <Box
            onClick={() => {
              setLeadWhatsappUrl(null);
              setViewMode("NEW");
            }}
            sx={{
              flex: 1,
              py: 1.25,
              px: 1,
              textAlign: "center",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.8125rem",
              whiteSpace: "nowrap",
              color: viewMode === "NEW" ? tokens.colors.primary.main : tokens.colors.secondary[600],
              borderBottom:
                viewMode === "NEW" ? `2px solid ${tokens.colors.primary.main}` : "2px solid transparent",
            }}
          >
            Help Ticket
          </Box>

          <Box
            onClick={() => setViewMode("LEAD")}
            sx={{
              flex: 1,
              py: 1.25,
              px: 1,
              textAlign: "center",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.8125rem",
              whiteSpace: "nowrap",
              color: viewMode === "LEAD" ? tokens.colors.primary.main : tokens.colors.secondary[600],
              borderBottom:
                viewMode === "LEAD" ? `2px solid ${tokens.colors.primary.main}` : "2px solid transparent",
            }}
          >
            Project Inquiry
          </Box>

          {activeTicketNumber && (
            <Box
              onClick={() => setViewMode("CHAT")}
              sx={{
                flex: 1,
                py: 1.25,
                px: 1,
                textAlign: "center",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.8125rem",
                whiteSpace: "nowrap",
                color: viewMode === "CHAT" ? tokens.colors.primary.main : tokens.colors.secondary[600],
                borderBottom:
                  viewMode === "CHAT" ? `2px solid ${tokens.colors.primary.main}` : "2px solid transparent",
              }}
            >
              Live Chat
            </Box>
          )}

          <Box
            onClick={() => setViewMode("LOOKUP")}
            sx={{
              flex: 1,
              py: 1.25,
              px: 1,
              textAlign: "center",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.8125rem",
              whiteSpace: "nowrap",
              color: viewMode === "LOOKUP" ? tokens.colors.primary.main : tokens.colors.secondary[600],
              borderBottom:
                viewMode === "LOOKUP" ? `2px solid ${tokens.colors.primary.main}` : "2px solid transparent",
            }}
          >
            Lookup
          </Box>
        </Box>

        {/* Content Body */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
          {/* TAB 1: NEW TICKET FORM */}
          {viewMode === "NEW" && (
            <form onSubmit={handleStartConversation}>
              <Box sx={{ display: "grid", gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  No login required. Submit your query and start chatting directly with our helpdesk.
                </Typography>

                <Box>
                  <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                    Your Name *
                  </Typography>
                  <AppTextField
                    placeholder="e.g., Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Box>

                <Box>
                  <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                    Email Address *
                  </Typography>
                  <AppTextField
                    type="email"
                    placeholder="e.g., jane@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Box>

                <Box>
                  <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                    Phone Number (Optional)
                  </Typography>
                  <AppTextField
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Box>

                <Box>
                  <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                    Inquiry Category
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as TicketCategory)}
                      sx={{ bgcolor: "#ffffff", borderRadius: tokens.borderRadius.sm }}
                    >
                      <MenuItem value="SUPPORT">General Support</MenuItem>
                      <MenuItem value="TECHNICAL">Technical Query</MenuItem>
                      <MenuItem value="BILLING">Billing & Invoicing</MenuItem>
                      <MenuItem value="FEATURE_REQUEST">Feature Request</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                    Subject / Title *
                  </Typography>
                  <AppTextField
                    placeholder="Brief summary of what you need help with"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Box>

                <Box>
                  <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                    Detailed Message *
                  </Typography>
                  <AppTextField
                    multiline
                    rows={4}
                    placeholder="Explain your query in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Box>

                <AppButton
                  type="submit"
                  appVariant="primary"
                  appSize="lg"
                  loading={createPublicTicketMutation.isPending}
                  loadingText="Connecting to Support..."
                  sx={{ mt: 1 }}
                >
                  Start Live Support Chat
                </AppButton>
              </Box>
            </form>
          )}

          {/* TAB 2: PROJECT INQUIRY & WHATSAPP CONNECT */}
          {viewMode === "LEAD" && (
            <Box>
              {leadWhatsappUrl ? (
                <Box
                  sx={{
                    p: 3,
                    borderRadius: tokens.borderRadius.md,
                    bgcolor: tokens.colors.success[50],
                    border: `1px solid ${tokens.colors.success[200]}`,
                    textAlign: "center",
                    display: "grid",
                    gap: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight={700} color={tokens.colors.success[700]}>
                    Inquiry Received!
                  </Typography>
                  <Typography variant="body2" color={tokens.colors.secondary[800]}>
                    We have logged your project requirement and sent an automatic confirmation to your email.
                  </Typography>

                  <AppButton
                    appVariant="primary"
                    appSize="lg"
                    startIcon={<WhatsAppIcon sx={{ fontSize: 20 }} />}
                    onClick={() => window.open(leadWhatsappUrl, "_blank")}
                    sx={{
                      bgcolor: "#25D366 !important",
                      color: "#ffffff !important",
                      "&:hover": { bgcolor: "#1EBE5D !important" },
                    }}
                  >
                    Open WhatsApp Chat Now
                  </AppButton>

                  <AppButton
                    appVariant="ghost"
                    appSize="sm"
                    onClick={() => {
                      setLeadWhatsappUrl(null);
                      setLeadRequirements("");
                    }}
                  >
                    Submit Another Inquiry
                  </AppButton>
                </Box>
              ) : (
                <form onSubmit={handleLeadSubmit}>
                  <Box sx={{ display: "grid", gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Looking to build an enterprise application or software solution? Fill out your requirement below to get an instant email confirmation and direct WhatsApp connect with our solutions team.
                    </Typography>

                    <Box>
                      <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                        Your Name *
                      </Typography>
                      <AppTextField
                        placeholder="e.g., Alex Johnson"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        required
                      />
                    </Box>

                    <Box>
                      <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                        Company / Organization
                      </Typography>
                      <AppTextField
                        placeholder="e.g., Acme Technologies"
                        value={leadCompany}
                        onChange={(e) => setLeadCompany(e.target.value)}
                      />
                    </Box>

                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
                      <Box>
                        <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                          Email *
                        </Typography>
                        <AppTextField
                          type="email"
                          placeholder="alex@acme.com"
                          value={leadEmail}
                          onChange={(e) => setLeadEmail(e.target.value)}
                          required
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                          Phone (WhatsApp) *
                        </Typography>
                        <AppTextField
                          placeholder="+91 98765 43210"
                          value={leadPhone}
                          onChange={(e) => setLeadPhone(e.target.value)}
                          required
                        />
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                        Service Requested
                      </Typography>
                      <FormControl size="small" fullWidth>
                        <Select
                          value={leadService}
                          onChange={(e) => setLeadService(e.target.value)}
                          sx={{ bgcolor: "#ffffff", borderRadius: tokens.borderRadius.sm }}
                        >
                          <MenuItem value="Custom Web / Mobile Development">Custom Web / Mobile Development</MenuItem>
                          <MenuItem value="Enterprise SaaS / CRM Implementation">Enterprise SaaS / CRM Implementation</MenuItem>
                          <MenuItem value="Cloud Architecture & DevOps">Cloud Architecture & DevOps</MenuItem>
                          <MenuItem value="AI / Automation Solutions">AI / Automation Solutions</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>

                    <Box>
                      <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                        Project Scope & Requirements *
                      </Typography>
                      <AppTextField
                        multiline
                        rows={4}
                        placeholder="Describe what you want to build, target timeline, and goals..."
                        value={leadRequirements}
                        onChange={(e) => setLeadRequirements(e.target.value)}
                        required
                      />
                    </Box>

                    <AppButton
                      type="submit"
                      appVariant="primary"
                      appSize="lg"
                      startIcon={<BusinessCenterOutlinedIcon sx={{ fontSize: 18 }} />}
                      loading={leadSubmitting}
                      loadingText="Registering Lead & Connecting..."
                      sx={{ mt: 1 }}
                    >
                      Connect with Webliix Solutions
                    </AppButton>
                  </Box>
                </form>
              )}
            </Box>
          )}

          {/* TAB 3: LIVE CHAT THREAD */}
          {viewMode === "CHAT" && (
            <Box sx={{ display: "flex", flexDirection: "column", height: "100%", gap: 2 }}>
              {/* Ticket Status Bar */}
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: tokens.borderRadius.md,
                  bgcolor: tokens.colors.secondary[50],
                  border: `1px solid ${tokens.colors.secondary[200]}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="caption" fontWeight={700} color={tokens.colors.primary.main}>
                    {activeTicketNumber}
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color={tokens.colors.secondary[900]} noWrap>
                    {ticketDetails?.title || "Support Thread"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {ticketDetails && <AppStatusChip status={ticketDetails.status} />}
                  <IconButton size="small" onClick={() => refetchTicket()}>
                    <RefreshIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              </Box>

              {/* Message List */}
              <Box
                sx={{
                  flex: 1,
                  minHeight: 280,
                  maxHeight: 380,
                  overflowY: "auto",
                  p: 2,
                  borderRadius: tokens.borderRadius.md,
                  bgcolor: "#f9fafb",
                  border: `1px solid ${tokens.colors.secondary[200]}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.75,
                }}
              >
                {ticketDetails?.comments?.map((c) => {
                  const isVisitor =
                    c.commentedBy === name ||
                    c.commentedBy === ticketDetails.customerName ||
                    (ticketDetails.createdBy && ticketDetails.createdBy.includes(c.commentedBy));

                  return (
                    <Box
                      key={c.id}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isVisitor ? "flex-end" : "flex-start",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5 }}>
                        <Typography variant="caption" fontWeight={700} color={tokens.colors.secondary[800]}>
                          {isVisitor ? "You" : c.commentedBy || "Support Specialist"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDateTime(c.createdAt)}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: tokens.borderRadius.md,
                          maxWidth: "88%",
                          bgcolor: isVisitor ? tokens.colors.primary.main : "#ffffff",
                          color: isVisitor ? "#ffffff" : tokens.colors.secondary[900],
                          border: isVisitor ? "none" : `1px solid ${tokens.colors.secondary[200]}`,
                          boxShadow: tokens.shadows.sm,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        <Typography variant="body2">{c.comment}</Typography>
                      </Box>
                    </Box>
                  );
                })}
                <div ref={chatBottomRef} />
              </Box>

              {/* Message Send Form */}
              <form onSubmit={handleSendMessage}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <AppTextField
                    fullWidth
                    placeholder="Type your message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    disabled={addPublicCommentMutation.isPending}
                  />
                  <AppButton
                    type="submit"
                    appVariant="primary"
                    endIcon={<SendIcon sx={{ fontSize: 16 }} />}
                    loading={addPublicCommentMutation.isPending}
                    disabled={!chatMessage.trim()}
                  >
                    Send
                  </AppButton>
                </Box>
              </form>
            </Box>
          )}

          {/* TAB 4: LOOKUP EXISTING TICKET */}
          {viewMode === "LOOKUP" && (
            <form onSubmit={handleLookupSubmit}>
              <Box sx={{ display: "grid", gap: 2.5 }}>
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <HelpOutlineIcon sx={{ fontSize: 44, color: tokens.colors.primary.main, mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight={700}>
                    Resume Previous Conversation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enter the ticket number given to you (e.g., TCK-2026-0001) to continue chatting.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                    Ticket Reference Number *
                  </Typography>
                  <AppTextField
                    placeholder="TCK-2026-0001"
                    value={lookupTicketInput}
                    onChange={(e) => setLookupTicketInput(e.target.value)}
                    required
                  />
                </Box>

                <AppButton type="submit" appVariant="primary" appSize="lg" disabled={!lookupTicketInput.trim()}>
                  Find & Open Chat
                </AppButton>
              </Box>
            </form>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: `1px solid ${tokens.colors.secondary[200]}`, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            Powered by Webliix Hub Enterprise Solutions
          </Typography>
        </Box>
      </Drawer>
    </>
  );
}

function HeadsetMicIcon() {
  return <ChatBubbleOutlineIcon sx={{ fontSize: 20 }} />;
}
