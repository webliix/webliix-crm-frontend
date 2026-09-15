import { useQuery } from "@tanstack/react-query";
import { ticketService } from "../services/ticket.service";

export function useTickets() {
  return useQuery({
    queryKey: ["tickets", "list"],
    queryFn: () => ticketService.getAllTickets(),
    staleTime: 30 * 1000,
  });
}

export function useTicketDashboard() {
  return useQuery({
    queryKey: ["tickets", "dashboard"],
    queryFn: () => ticketService.getDashboard(),
    staleTime: 60 * 1000,
  });
}
