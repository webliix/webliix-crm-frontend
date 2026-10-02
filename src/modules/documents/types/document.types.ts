export type DocumentTypeCategory =
  | "CONTRACT"
  | "BRIEF"
  | "SPECIFICATION"
  | "PROPOSAL"
  | "NDA"
  | "DESIGN"
  | "DELIVERABLE"
  | "REPORT"
  | "INVOICE"
  | "OTHER";

export interface DocumentCategoryMeta {
  key: DocumentTypeCategory;
  label: string;
  color: "primary" | "secondary" | "success" | "warning" | "info" | "error" | "default";
  description: string;
}

export const DOCUMENT_CATEGORIES: DocumentCategoryMeta[] = [
  {
    key: "CONTRACT",
    label: "Contract & Agreement",
    color: "primary",
    description: "Legal service agreements, master contracts, and statement of work",
  },
  {
    key: "SPECIFICATION",
    label: "Technical Specs & Blueprint",
    color: "info",
    description: "System architecture, API schemas, and technical specifications",
  },
  {
    key: "BRIEF",
    label: "Project Brief & Requirements",
    color: "secondary",
    description: "Client product discovery, functional requirements, and scoping documents",
  },
  {
    key: "DELIVERABLE",
    label: "Release & Deliverable",
    color: "success",
    description: "Production builds, exported assets, code packages, and live milestones",
  },
  {
    key: "PROPOSAL",
    label: "Proposal & Quotation",
    color: "warning",
    description: "Commercial estimates, cost breakdowns, and proposals",
  },
  {
    key: "NDA",
    label: "Non-Disclosure Agreement (NDA)",
    color: "error",
    description: "Confidentiality and proprietary data protection agreements",
  },
  {
    key: "DESIGN",
    label: "Design & UI/UX Assets",
    color: "primary",
    description: "Figma exports, brand guidelines, typography, and wireframes",
  },
  {
    key: "REPORT",
    label: "Audit & Security Report",
    color: "warning",
    description: "Vulnerability assessments, performance audits, and compliance reviews",
  },
  {
    key: "INVOICE",
    label: "Invoice & Billing Receipt",
    color: "success",
    description: "Official tax invoices, advance receipts, and payout statements",
  },
  {
    key: "OTHER",
    label: "General Document",
    color: "default",
    description: "User guides, handover documentation, and miscellaneous files",
  },
];

export interface StoredDocument {
  id: number;
  fileName: string;
  originalName: string;
  fileSize: number;
  contentType: string;
  storageProvider?: string;
  storagePath?: string;
  tenantId?: number;
  uploadedBy?: number;
  module: string;
  referenceId?: number;
  createdAt: string;
  // Enhanced metadata fields
  category?: DocumentTypeCategory;
  title?: string;
  description?: string;
  productName?: string;
  customerName?: string;
}
