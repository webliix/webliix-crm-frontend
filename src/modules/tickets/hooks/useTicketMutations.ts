import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketService } from "../services/ticket.service";
import { notificationService } from "@/shared/notifications/notification.service";
import type {
  CreateTicketRequest,
  UpdateTicketRequest,
  AssignTicketRequest,
  CreateTicketCommentRequest,
} from "../types/ticket.types";

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTicketRequest) => ticketService.createTicket(payload),
    onSuccess: (newTicket) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      notificationService.success(`Ticket ${newTicket?.ticketNumber || ""} created successfully`);
    },
    onError: (err: any) => {
      notificationService.error(err?.message || "Failed to create ticket");
    },
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTicketRequest }) =>
      ticketService.updateTicket(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      notificationService.success(`Ticket ${updated?.ticketNumber || ""} updated`);
    },
    onError: (err: any) => {
      notificationService.error(err?.message || "Failed to update ticket");
    },
  });
}

export function useAssignTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AssignTicketRequest }) =>
      ticketService.assignTicket(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      notificationService.success(`Assigned ticket ${updated?.ticketNumber || ""}`);
    },
    onError: (err: any) => {
      notificationService.error(err?.message || "Failed to assign ticket");
    },
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, payload }: { ticketId: number; payload: CreateTicketCommentRequest }) =>
      ticketService.addComment(ticketId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tickets", "comments", variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ["tickets", "detail", variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ["tickets", "list"] });
    },
    onError: (err: any) => {
      notificationService.error(err?.message || "Failed to post reply");
    },
  });
}
