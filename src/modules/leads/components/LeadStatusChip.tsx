import { AppStatusChip } from "@/shared/components/ui/feedback";
import type { LeadResponse } from "@/api/generated";

interface Props {
  status?: LeadResponse["status"];
}

export function LeadStatusChip({ status }: Props) {
  return <AppStatusChip status={String(status ?? "NEW")} />;
}
