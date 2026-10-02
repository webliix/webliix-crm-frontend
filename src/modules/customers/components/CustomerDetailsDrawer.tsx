import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import LinearProgress from "@mui/material/LinearProgress";
import Chip from "@mui/material/Chip";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { AppDrawer } from "@/shared/components/ui/dialog";
import { AppButton } from "@/shared/components/ui/button";
import { AppTextField } from "@/shared/components/ui/form";
import { AppStatusChip, LoadingScreen, EmptyState } from "@/shared/components/ui/feedback";
import { DocumentExplorer } from "@/modules/documents/components/DocumentExplorer";
import { documentService } from "@/modules/documents/services/document.service";
import type { StoredDocument } from "@/modules/documents/types/document.types";
import { ticketService } from "@/modules/tickets/services/ticket.service";
import type { TicketResponse } from "@/modules/tickets/types/ticket.types";
import { TicketDetailsDrawer, TicketCreateDrawer } from "@/modules/tickets/components";
import {
  useCustomerDetails,
  useCustomerProjects,
  useCustomerInvoices,
  useCustomerContacts,
  useCustomerNotes,
} from "../hooks/useCustomerDetails";
import {
  useDeleteCustomer,
  useAddCustomerContact,
  useAddCustomerNote,
} from "../hooks/useCustomerMutations";
import { formatCurrency, formatDate, formatDateTime } from "@/shared/utils/formatters";
import { tokens } from "@/theme/tokens";

interface CustomerDetailsDrawerProps {
  customerId: number | null;
  open: boolean;
  onClose: () => void;
  onEdit: (customer: any) => void;
}

export function CustomerDetailsDrawer({
  customerId,
  open,
  onClose,
  onEdit,
}: CustomerDetailsDrawerProps) {
  const [currentTab, setCurrentTab] = useState(0);

  // Queries
  const { data: customer, isLoading } = useCustomerDetails(customerId);
  const { data: projects = [] } = useCustomerProjects(customerId);
  const { data: invoices = [] } = useCustomerInvoices(customerId);
  const { data: contacts = [] } = useCustomerContacts(customerId);
  const { data: notes = [] } = useCustomerNotes(customerId);

  // Dynamic state for documents and tickets
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [ticketDetailsOpen, setTicketDetailsOpen] = useState(false);
  const [ticketCreateOpen, setTicketCreateOpen] = useState(false);

  // Mutations
  const deleteMutation = useDeleteCustomer();
  const addContactMutation = useAddCustomerContact();
  const addNoteMutation = useAddCustomerNote();

  // Contact form state
  const [showAddContact, setShowAddContact] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactDesignation, setContactDesignation] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Note form state
  const [noteContent, setNoteContent] = useState("");

  const loadDocumentsAndTickets = async () => {
    if (!customerId) return;
    try {
      const [docList, ticketList] = await Promise.all([
        documentService.getDocuments({ module: "CUSTOMER", referenceId: customerId }),
        ticketService.getAllTickets({ customerId: customerId || undefined }),
      ]);
      setDocuments(docList || []);
      setTickets(Array.isArray(ticketList) ? ticketList : []);
    } catch (err) {
      console.error("Error fetching customer files/tickets:", err);
    }
  };

  useEffect(() => {
    if (open && customerId) {
      loadDocumentsAndTickets();
    }
  }, [open, customerId]);

  if (!customerId || !open) return null;

  const handleWhatsApp = () => {
    if (!customer?.phone) return;
    const cleanPhone = customer.phone.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      `Hello ${customer.contactPerson || customer.companyName}, connecting from Webliix regarding your client account and projects.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  const handleEmail = () => {
    if (!customer?.email) return;
    window.location.href = `mailto:${customer.email}?subject=Webliix%20Account%20Updates`;
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to remove this client account?")) {
      deleteMutation.mutate(customerId, {
        onSuccess: () => onClose(),
      });
    }
  };

  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim()) return;

    addContactMutation.mutate(
      {
        customerId,
        contact: {
          name: contactName.trim(),
          designation: contactDesignation.trim() || undefined,
          email: contactEmail.trim() || undefined,
          phone: contactPhone.trim() || undefined,
          isPrimary: contacts.length === 0,
        },
      },
      {
        onSuccess: () => {
          setContactName("");
          setContactDesignation("");
          setContactEmail("");
          setContactPhone("");
          setShowAddContact(false);
        },
      }
    );
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    addNoteMutation.mutate(
      {
        customerId,
        note: {
          note: noteContent.trim(),
          createdBy: "Staff",
        },
      },
      {
        onSuccess: () => {
          setNoteContent("");
        },
      }
    );
  };

  return (
    <>
      <AppDrawer
        open={open}
        onClose={onClose}
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="h6" fontWeight={700} color={tokens.colors.secondary[900]}>
              {customer?.companyName || "Client Details"}
            </Typography>
            {customer && (
              <AppStatusChip
                status={customer.active !== false ? "ACTIVE" : "INACTIVE"}
                statusType={customer.active !== false ? "success" : "neutral"}
              />
            )}
          </Box>
        }
        subtitle={customer?.customerCode ? `Account Reference: ${customer.customerCode}` : "Client Portfolio"}
        width="lg"
      >
        {isLoading || !customer ? (
          <LoadingScreen message="Loading client portfolio..." />
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* Quick Action Toolbar */}
            <Box
              sx={{
                p: 2,
                borderRadius: tokens.borderRadius.md,
                bgcolor: tokens.colors.secondary[50],
                border: `1px solid ${tokens.colors.secondary[200]}`,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                {customer.phone && (
                  <AppButton
                    appVariant="primary"
                    appSize="sm"
                    startIcon={<WhatsAppIcon sx={{ fontSize: 16 }} />}
                    onClick={handleWhatsApp}
                    sx={{
                      bgcolor: "#25D366 !important",
                      color: "#ffffff !important",
                      "&:hover": { bgcolor: "#1EBE5D !important" },
                    }}
                  >
                    WhatsApp
                  </AppButton>
                )}

                {customer.email && (
                  <AppButton
                    appVariant="secondary"
                    appSize="sm"
                    startIcon={<EmailOutlinedIcon sx={{ fontSize: 16 }} />}
                    onClick={handleEmail}
                  >
                    Email Client
                  </AppButton>
                )}
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <AppButton
                  appVariant="outlined"
                  appSize="sm"
                  startIcon={<EditOutlinedIcon sx={{ fontSize: 16 }} />}
                  onClick={() => onEdit(customer)}
                >
                  Edit Details
                </AppButton>

                <AppButton
                  appVariant="danger"
                  appSize="sm"
                  startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
                  onClick={handleDelete}
                  loading={deleteMutation.isPending}
                >
                  Remove
                </AppButton>
              </Box>
            </Box>

            {/* Navigation Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={currentTab}
                onChange={(_, val) => setCurrentTab(val)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  "& .MuiTab-root": {
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    textTransform: "none",
                  },
                }}
              >
                <Tab label="Overview & Contacts" />
                <Tab label={`Projects (${projects.length})`} />
                <Tab label={`Documents Library (${documents.length})`} />
                <Tab label={`Support Tickets (${tickets.length})`} />
                <Tab label={`Invoices (${invoices.length})`} />
                <Tab label={`Notes (${notes.length})`} />
              </Tabs>
            </Box>

            {/* TAB 0: OVERVIEW & CONTACTS */}
            {currentTab === 0 && (
              <Box sx={{ display: "grid", gap: 3 }}>
                {/* Account Details Summary */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Primary Contact Person
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color={tokens.colors.secondary[900]}>
                      {customer.contactPerson || "-"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Email Address
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color={tokens.colors.secondary[900]}>
                      {customer.email || "-"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Phone Number
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color={tokens.colors.secondary[900]}>
                      {customer.phone || "-"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      GST / Tax Identifier
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color={tokens.colors.secondary[900]}>
                      {customer.gstNumber || "Not Registered"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Website URL
                    </Typography>
                    {customer.website ? (
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color={tokens.colors.primary.main}
                        sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "pointer" }}
                        onClick={() =>
                          window.open(
                            customer.website?.startsWith("http") ? customer.website : `https://${customer.website}`,
                            "_blank"
                          )
                        }
                      >
                        <LanguageIcon sx={{ fontSize: 16 }} />
                        {customer.website}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        -
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Total Lifetime Value
                    </Typography>
                    <Typography variant="body2" fontWeight={700} color={tokens.colors.success[700]}>
                      {customer.lifetimeValue ? formatCurrency(customer.lifetimeValue) : "₹0"}
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                {/* Billing Address */}
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                    Registered Address
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {[customer.address, customer.city, customer.state, customer.country].filter(Boolean).join(", ") ||
                      "No physical address specified."}
                  </Typography>
                </Box>

                <Divider />

                {/* Contacts List */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Associated Key Contacts ({contacts.length})
                  </Typography>
                  <AppButton
                    appVariant="secondary"
                    appSize="sm"
                    startIcon={<PersonAddOutlinedIcon sx={{ fontSize: 16 }} />}
                    onClick={() => setShowAddContact(!showAddContact)}
                  >
                    {showAddContact ? "Cancel" : "Add Contact"}
                  </AppButton>
                </Box>

                {showAddContact && (
                  <form onSubmit={handleAddContactSubmit}>
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
                      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
                        <AppTextField
                          placeholder="Contact Name *"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          required
                        />
                        <AppTextField
                          placeholder="Designation / Role"
                          value={contactDesignation}
                          onChange={(e) => setContactDesignation(e.target.value)}
                        />
                        <AppTextField
                          placeholder="Email Address"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                        />
                        <AppTextField
                          placeholder="Phone Number"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                        />
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <AppButton
                          type="submit"
                          appVariant="primary"
                          appSize="sm"
                          loading={addContactMutation.isPending}
                        >
                          Save Contact
                        </AppButton>
                      </Box>
                    </Box>
                  </form>
                )}

                {contacts.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No secondary contacts registered.
                  </Typography>
                ) : (
                  <Box sx={{ display: "grid", gap: 1.5 }}>
                    {contacts.map((c) => (
                      <Box
                        key={c.id}
                        sx={{
                          p: 1.5,
                          borderRadius: tokens.borderRadius.md,
                          bgcolor: "#ffffff",
                          border: `1px solid ${tokens.colors.secondary[200]}`,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {c.name} {c.designation ? `(${c.designation})` : ""}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {c.email || ""} {c.phone ? `• ${c.phone}` : ""}
                          </Typography>
                        </Box>
                        {c.isPrimary && <AppStatusChip status="PRIMARY" statusType="info" sx={{ height: 20 }} />}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            )}

            {/* TAB 1: PROJECTS */}
            {currentTab === 1 && (
              <Box sx={{ display: "grid", gap: 2 }}>
                {projects.length === 0 ? (
                  <EmptyState
                    title="No Associated Projects"
                    message="This client does not currently have any active or completed projects."
                  />
                ) : (
                  projects.map((p) => (
                    <Box
                      key={p.id}
                      sx={{
                        p: 2,
                        borderRadius: tokens.borderRadius.md,
                        bgcolor: "#ffffff",
                        border: `1px solid ${tokens.colors.secondary[200]}`,
                        display: "grid",
                        gap: 1.5,
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={700} color={tokens.colors.secondary[900]}>
                            {p.projectName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            {p.projectCode}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", gap: 1 }}>
                          <AppStatusChip status={p.priority} statusType="warning" sx={{ height: 22 }} />
                          <AppStatusChip status={p.status} sx={{ height: 22 }} />
                        </Box>
                      </Box>

                      {/* Progress */}
                      <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Delivery Progress
                          </Typography>
                          <Typography variant="caption" fontWeight={700}>
                            {p.progressPercentage ?? 0}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={p.progressPercentage ?? 0}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="caption" color="text.secondary">
                          Target Timeline: {p.startDate ? formatDate(p.startDate) : "TBD"} –{" "}
                          {p.expectedEndDate ? formatDate(p.expectedEndDate) : "TBD"}
                        </Typography>
                        <Typography variant="body2" fontWeight={700} color={tokens.colors.secondary[900]}>
                          {p.budget ? formatCurrency(p.budget) : "Budget N/A"}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            )}

            {/* TAB 2: MULTI-TYPE DOCUMENTS LIBRARY */}
            {currentTab === 2 && (
              <Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} color={tokens.colors.secondary[900]}>
                    Customer Multi-Type Documents
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Upload contracts, blueprints, technical specs, deliverables, NDAs, and receipts for this client.
                  </Typography>
                </Box>
                <DocumentExplorer
                  documents={documents}
                  onRefresh={loadDocumentsAndTickets}
                  allowUpload={true}
                  module="CUSTOMER"
                  referenceId={customerId}
                  customerName={customer.companyName}
                />
              </Box>
            )}

            {/* TAB 3: SUPPORT TICKETS & LIVE CHAT */}
            {currentTab === 3 && (
              <Box sx={{ display: "grid", gap: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Customer Support Inquiries & Tickets ({tickets.length})
                  </Typography>
                  <AppButton
                    appVariant="primary"
                    appSize="sm"
                    startIcon={<ConfirmationNumberOutlinedIcon sx={{ fontSize: 16 }} />}
                    onClick={() => setTicketCreateOpen(true)}
                  >
                    Raise Ticket
                  </AppButton>
                </Box>

                {tickets.length === 0 ? (
                  <EmptyState
                    title="No Support Tickets"
                    message="No active or past support tickets generated for this customer."
                  />
                ) : (
                  tickets.map((t) => (
                    <Box
                      key={t.id}
                      sx={{
                        p: 2,
                        borderRadius: tokens.borderRadius.md,
                        bgcolor: "#ffffff",
                        border: `1px solid ${tokens.colors.secondary[200]}`,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                          <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            color={tokens.colors.primary.main}
                            sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                            onClick={() => {
                              setSelectedTicketId(t.id);
                              setTicketDetailsOpen(true);
                            }}
                          >
                            {t.ticketNumber}
                          </Typography>
                          <Chip
                            label={t.status}
                            size="small"
                            color={
                              t.status === "RESOLVED" || t.status === "CLOSED"
                                ? "success"
                                : t.status === "IN_PROGRESS"
                                ? "warning"
                                : "primary"
                            }
                            sx={{ height: 20, fontSize: "0.6875rem", fontWeight: 700 }}
                          />
                        </Box>
                        <Typography variant="body2" fontWeight={600}>
                          {t.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Category: {t.category} • Created: {t.createdAt ? formatDate(t.createdAt) : ""}
                        </Typography>
                      </Box>

                      <AppButton
                        appVariant="secondary"
                        appSize="sm"
                        startIcon={<ChatOutlinedIcon sx={{ fontSize: 16 }} />}
                        onClick={() => {
                          setSelectedTicketId(t.id);
                          setTicketDetailsOpen(true);
                        }}
                      >
                        Live Chat
                      </AppButton>
                    </Box>
                  ))
                )}
              </Box>
            )}

            {/* TAB 4: INVOICES & FINANCIALS */}
            {currentTab === 4 && (
              <Box sx={{ display: "grid", gap: 2 }}>
                {invoices.length === 0 ? (
                  <EmptyState
                    title="No Invoices Issued"
                    message="No billing records or invoices found for this client account."
                  />
                ) : (
                  invoices.map((inv) => (
                    <Box
                      key={inv.id}
                      sx={{
                        p: 2,
                        borderRadius: tokens.borderRadius.md,
                        bgcolor: "#ffffff",
                        border: `1px solid ${tokens.colors.secondary[200]}`,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700} color={tokens.colors.primary.main}>
                          {inv.invoiceNumber}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Due: {inv.dueDate ? formatDate(inv.dueDate) : "Upon receipt"}
                        </Typography>
                      </Box>

                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2" fontWeight={700} color={tokens.colors.secondary[900]}>
                          {formatCurrency(inv.totalAmount)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Paid: {formatCurrency(inv.paidAmount)} • Pending: {formatCurrency(inv.pendingAmount)}
                        </Typography>
                      </Box>

                      <AppStatusChip status={inv.status} sx={{ height: 22 }} />
                    </Box>
                  ))
                )}
              </Box>
            )}

            {/* TAB 5: ACTIVITY & NOTES */}
            {currentTab === 5 && (
              <Box sx={{ display: "grid", gap: 2.5 }}>
                <form onSubmit={handleAddNoteSubmit}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <AppTextField
                      fullWidth
                      placeholder="Log client discussion, meeting summary, or internal note..."
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                    />
                    <AppButton
                      type="submit"
                      appVariant="primary"
                      startIcon={<NoteAddOutlinedIcon sx={{ fontSize: 16 }} />}
                      loading={addNoteMutation.isPending}
                      disabled={!noteContent.trim()}
                    >
                      Add Note
                    </AppButton>
                  </Box>
                </form>

                {notes.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No notes logged yet. Use the field above to record client interactions.
                  </Typography>
                ) : (
                  <Box sx={{ display: "grid", gap: 1.5 }}>
                    {notes.map((n) => (
                      <Box
                        key={n.id}
                        sx={{
                          p: 2,
                          borderRadius: tokens.borderRadius.md,
                          bgcolor: tokens.colors.secondary[50],
                          border: `1px solid ${tokens.colors.secondary[200]}`,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color={tokens.colors.secondary[900]}
                          sx={{ whiteSpace: "pre-wrap", mb: 1 }}
                        >
                          {n.note}
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[600]}>
                            By: {n.createdBy || "Staff"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {n.createdAt ? formatDateTime(n.createdAt) : ""}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )}
      </AppDrawer>

      {/* Ticket Create Drawer */}
      <TicketCreateDrawer
        open={ticketCreateOpen}
        onClose={() => {
          setTicketCreateOpen(false);
          loadDocumentsAndTickets();
        }}
      />

      {/* Ticket Details & Live Chat Drawer */}
      <TicketDetailsDrawer
        ticketId={selectedTicketId}
        open={ticketDetailsOpen}
        onClose={() => {
          setTicketDetailsOpen(false);
          setSelectedTicketId(null);
          loadDocumentsAndTickets();
        }}
      />
    </>
  );
}
