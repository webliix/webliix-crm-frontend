import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketService } from "../services/ticket.service";
import { notificationService } from "@/shared/notifications/notification.service";
import type { PublicTicketRequest, CreateTicketCommentRequest } from "../types/ticket.types";

export function usePublicTicketDetails(ticketNumber: string | null) {
  return useQuery({
    queryKey: ["public-ticket", ticketNumber],
    queryFn: () => (ticketNumber ? ticketService.getPublicTicket(ticketNumber) : null),
    enabled: !!ticketNumber,
    refetchInterval: 8000, // Poll active customer chat every 8s
  });
}

export function useCreatePublicTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PublicTicketRequest) => ticketService.createPublicTicket(payload),
    onSuccess: (data) => {
      notificationService.success(`Query registered! Reference: ${data?.ticketNumber}`);
      queryClient.invalidateQueries({ queryKey: ["public-ticket"] });
    },
    onError: (err: any) => {
      notificationService.error(err?.message || "Failed to submit query");
    },
  });
}

export function useAddPublicComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketNumber,
      payload,
    }: {
      ticketNumber: string;
      payload: CreateTicketCommentRequest;
    }) => ticketService.addPublicComment(ticketNumber, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["public-ticket", variables.ticketNumber] });
    },
    onError: (err: any) => {
      notificationService.error(err?.message || "Failed to send reply");
    },
  });
}
