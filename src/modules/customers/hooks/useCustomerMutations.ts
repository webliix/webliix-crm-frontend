import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerService } from "../services/customer.service";
import { notificationService } from "@/shared/notifications/notification.service";
import type { CreateCustomerRequest, CustomerContact, CustomerNote } from "../types/customer.types";

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCustomerRequest) => customerService.createCustomer(payload),
    onSuccess: (newCust) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      notificationService.success(`Customer ${newCust?.companyName || ""} created and welcome email dispatched!`);
    },
    onError: (err: any) => {
      notificationService.error(err?.message || "Failed to create customer");
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreateCustomerRequest }) =>
      customerService.updateCustomer(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      notificationService.success(`Customer ${updated?.companyName || ""} updated`);
    },
    onError: (err: any) => {
      notificationService.error(err?.message || "Failed to update customer");
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => customerService.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      notificationService.success("Customer removed successfully");
    },
    onError: (err: any) => {
      notificationService.error(err?.message || "Failed to delete customer");
    },
  });
}

export function useAddCustomerContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, contact }: { customerId: number; contact: CustomerContact }) =>
      customerService.addContact(customerId, contact),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers", "contacts", variables.customerId] });
      notificationService.success("Contact added successfully");
    },
    onError: (err: any) => {
      notificationService.error(err?.message || "Failed to add contact");
    },
  });
}

export function useAddCustomerNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, note }: { customerId: number; note: CustomerNote }) =>
      customerService.addNote(customerId, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers", "notes", variables.customerId] });
      notificationService.success("Note recorded");
    },
    onError: (err: any) => {
      notificationService.error(err?.message || "Failed to add note");
    },
  });
}
