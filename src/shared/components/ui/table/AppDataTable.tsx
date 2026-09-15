import { type ReactNode, type ChangeEvent } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Box from "@mui/material/Box";
import { AppCard } from "@/shared/components/ui/card";
import { TableSkeleton } from "@/shared/components/ui/feedback/AppSkeleton";
import { EmptyState } from "@/shared/components/ui/feedback/EmptyState";
import { tokens } from "@/theme/tokens";

export interface DataTableColumn<RowType> {
  field: keyof RowType | string;
  headerName: string;
  flex?: number;
  width?: number | string;
  align?: "left" | "center" | "right";
  render?: (value: any, row: RowType) => ReactNode;
}

export interface AppDataTableProps<RowType> {
  rows: RowType[];
  columns: DataTableColumn<RowType>[];
  loading?: boolean;
  page?: number;
  pageSize?: number;
  totalRows?: number;
  pageSizeOptions?: number[];
  emptyMessage?: string;
  emptyTitle?: string;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onRowClick?: (row: RowType) => void;
}

export function AppDataTable<RowType extends Record<string, any>>({
  rows,
  columns,
  loading = false,
  page = 0,
  pageSize = 20,
  totalRows = 0,
  pageSizeOptions = [10, 20, 50, 100],
  emptyTitle = "No records found",
  emptyMessage = "There are no records to display.",
  onPageChange,
  onPageSizeChange,
  onRowClick,
}: AppDataTableProps<RowType>) {
  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange?.(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newSize = Number(event.target.value);
    onPageSizeChange?.(newSize);
    onPageChange?.(0);
  };

  return (
    <AppCard padding="none" sx={{ overflow: "hidden" }}>
      <TableContainer
        sx={{
          maxHeight: 680,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "-ms-autohide-scrollbar",
        }}
      >
        <Table stickyHeader size="medium" sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.field)}
                  align={column.align || "left"}
                  sx={{
                    width: column.width || (column.flex ? `${column.flex * 100}px` : undefined),
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    whiteSpace: "nowrap",
                    color: tokens.colors.secondary[600],
                    backgroundColor: tokens.colors.secondary[50],
                    borderBottom: `1px solid ${tokens.colors.secondary[200]}`,
                    py: 1.75,
                  }}
                >
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ p: 0 }}>
                  <TableSkeleton rows={pageSize > 5 ? 5 : pageSize} cols={columns.length} />
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ py: 6 }}>
                  <EmptyState title={emptyTitle} message={emptyMessage} />
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, rowIndex) => (
                <TableRow
                  key={String((row as any).id ?? rowIndex)}
                  hover
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    cursor: onRowClick ? "pointer" : "default",
                    transition: tokens.transitions.fast,
                    "&:last-child td": {
                      borderBottom: 0,
                    },
                    "&:hover": {
                      backgroundColor: `${tokens.colors.primary[50]} !important`,
                    },
                  }}
                >
                  {columns.map((column) => {
                    const val = (row as any)[column.field];
                    return (
                      <TableCell
                        key={`${String(column.field)}-${rowIndex}`}
                        align={column.align || "left"}
                        sx={{
                          py: 1.75,
                          fontSize: "0.875rem",
                          whiteSpace: "nowrap",
                          color: tokens.colors.secondary[800],
                          borderBottom: `1px solid ${tokens.colors.secondary[100]}`,
                        }}
                      >
                        {column.render ? column.render(val, row) : String(val ?? "-")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalRows > 0 && (
        <Box sx={{ borderTop: `1px solid ${tokens.colors.secondary[200]}`, bgcolor: "#ffffff", overflowX: "auto" }}>
          <TablePagination
            component="div"
            count={totalRows}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={pageSize}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={pageSizeOptions}
            sx={{
              ".MuiTablePagination-toolbar": {
                px: { xs: 1, sm: 2 },
                flexWrap: { xs: "wrap", sm: "nowrap" },
                justifyContent: { xs: "center", sm: "flex-end" },
              },
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                fontSize: "0.8125rem",
                color: tokens.colors.secondary[600],
              },
            }}
          />
        </Box>
      )}
    </AppCard>
  );
}
