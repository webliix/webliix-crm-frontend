import { useQuery } from "@tanstack/react-query";
import { ticketService } from "../services/ticket.service";

export function useTicketDetails(ticketId: number | null) {
  return useQuery({
    queryKey: ["tickets", "detail", ticketId],
    queryFn: () => (ticketId ? ticketService.getTicket(ticketId) : null),
    enabled: !!ticketId,
  });
}

export function useTicketComments(ticketId: number | null) {
  return useQuery({
    queryKey: ["tickets", "comments", ticketId],
    queryFn: () => (ticketId ? ticketService.getComments(ticketId) : []),
    enabled: !!ticketId,
    refetchInterval: 10 * 1000, // Poll active chat thread every 10 seconds
  });
}
