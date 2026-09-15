export interface CustomerResponse {
  id: number;
  companyName: string;
  customerCode?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  website?: string;
  gstNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  lifetimeValue?: number;
  customerSince?: string;
  active?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerStatisticsResponse {
  totalCustomers: number;
  activeCustomers: number;
  totalLifetimeValue: number;
  newCustomersThisMonth: number;
}

export interface CreateCustomerRequest {
  companyName: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  website?: string;
  gstNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  lifetimeValue?: number;
  customerSince?: string;
  active?: boolean;
}

export interface CustomerContact {
  id?: number;
  customerId?: number;
  name: string;
  designation?: string;
  email?: string;
  phone?: string;
  isPrimary?: boolean;
}

export interface CustomerNote {
  id?: number;
  customerId?: number;
  note: string;
  createdBy?: string;
  createdAt?: string;
}

export interface CustomerProjectSummary {
  id: number;
  projectName: string;
  projectCode: string;
  status: string;
  priority: string;
  budget?: number;
  progressPercentage?: number;
  startDate?: string;
  expectedEndDate?: string;
}

export interface CustomerInvoiceSummary {
  id: number;
  invoiceNumber: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  status: string;
  issueDate?: string;
  dueDate?: string;
}
