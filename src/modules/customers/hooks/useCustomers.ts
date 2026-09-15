import { useQuery } from "@tanstack/react-query";
import { customerService } from "../services/customer.service";

export function useCustomers() {
  return useQuery({
    queryKey: ["customers", "list"],
    queryFn: () => customerService.getAllCustomers(),
    staleTime: 30 * 1000,
  });
}

export function useCustomerStatistics() {
  return useQuery({
    queryKey: ["customers", "statistics"],
    queryFn: () => customerService.getStatistics(),
    staleTime: 60 * 1000,
  });
}
