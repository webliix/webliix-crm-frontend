import { AppDataTable } from "@/shared/components/ui/table";
import { createLeadColumns } from "./leadColumns";
import type { LeadResponse } from "@/api/generated";

interface Props {
  leads: LeadResponse[];
  total: number;
  page: number;
  pageSize: number;
  loading?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onConvert?: (id: number) => void;
}

export function LeadTable({
  leads,
  total,
  page,
  pageSize,
  loading = false,
  onPageChange,
  onPageSizeChange,
  onView,
  onEdit,
  onDelete,
  onConvert,
}: Props) {
  const columns = createLeadColumns({ onView, onEdit, onDelete, onConvert });

  return (
    <AppDataTable
      rows={leads}
      columns={columns}
      loading={loading}
      page={page}
      pageSize={pageSize}
      totalRows={total}
      emptyTitle="No Leads Found"
      emptyMessage="No leads match your current search criteria. Create a new lead to get started."
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onRowClick={(row) => onView?.((row as any).id)}
    />
  );
}
