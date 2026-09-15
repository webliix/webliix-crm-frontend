import { useQuery } from "@tanstack/react-query";
import { customerService } from "../services/customer.service";

export function useCustomerDetails(customerId: number | null) {
  return useQuery({
    queryKey: ["customers", "detail", customerId],
    queryFn: () => (customerId ? customerService.getCustomer(customerId) : null),
    enabled: !!customerId,
  });
}

export function useCustomerProjects(customerId: number | null) {
  return useQuery({
    queryKey: ["customers", "projects", customerId],
    queryFn: () => (customerId ? customerService.getProjects(customerId) : []),
    enabled: !!customerId,
  });
}

export function useCustomerInvoices(customerId: number | null) {
  return useQuery({
    queryKey: ["customers", "invoices", customerId],
    queryFn: () => (customerId ? customerService.getInvoices(customerId) : []),
    enabled: !!customerId,
  });
}

export function useCustomerContacts(customerId: number | null) {
  return useQuery({
    queryKey: ["customers", "contacts", customerId],
    queryFn: () => (customerId ? customerService.getContacts(customerId) : []),
    enabled: !!customerId,
  });
}

export function useCustomerNotes(customerId: number | null) {
  return useQuery({
    queryKey: ["customers", "notes", customerId],
    queryFn: () => (customerId ? customerService.getNotes(customerId) : []),
    enabled: !!customerId,
  });
}
