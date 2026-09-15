import Chip, { type ChipProps } from "@mui/material/Chip";
import { tokens } from "@/theme/tokens";
import { capitalize } from "@/shared/utils/formatters";

export type StatusColorType = "success" | "warning" | "error" | "info" | "neutral" | "primary";

export interface AppStatusChipProps extends Omit<ChipProps, "color"> {
  status: string;
  statusType?: StatusColorType;
  customLabel?: string;
}

export function AppStatusChip({
  status,
  statusType,
  customLabel,
  sx,
  ...props
}: AppStatusChipProps) {
  const normalize = (status || "").toUpperCase();

  const resolveType = (): StatusColorType => {
    if (statusType) return statusType;

    // Success types
    if (
      ["WON", "PAID", "COMPLETED", "ACTIVE", "RESOLVED", "PRESENT", "APPROVED", "SUCCESS", "ENABLED"].includes(
        normalize
      )
    ) {
      return "success";
    }

    // Warning types
    if (
      ["CONTACTED", "PENDING", "IN_PROGRESS", "ON_HOLD", "HALF_DAY", "QUALIFIED", "PARTIAL"].includes(
        normalize
      )
    ) {
      return "warning";
    }

    // Error / Danger types
    if (
      ["LOST", "OVERDUE", "CANCELLED", "CLOSED", "ABSENT", "REJECTED", "FAILED", "DISABLED"].includes(
        normalize
      )
    ) {
      return "error";
    }

    // Info types
    if (["NEW", "OPEN", "DRAFT", "SENT", "ON_LEAVE", "ASSIGNED"].includes(normalize)) {
      return "info";
    }

    // Neutral
    return "neutral";
  };

  const type = resolveType();

  const getStyle = () => {
    switch (type) {
      case "success":
        return {
          backgroundColor: tokens.colors.success[50],
          color: tokens.colors.success[700],
          border: `1px solid ${tokens.colors.success[200]}`,
        };
      case "warning":
        return {
          backgroundColor: tokens.colors.warning[50],
          color: tokens.colors.warning[700],
          border: `1px solid ${tokens.colors.warning[200]}`,
        };
      case "error":
        return {
          backgroundColor: tokens.colors.error[50],
          color: tokens.colors.error[700],
          border: `1px solid ${tokens.colors.error[200]}`,
        };
      case "info":
        return {
          backgroundColor: tokens.colors.info[50],
          color: tokens.colors.info[700],
          border: `1px solid ${tokens.colors.info[200]}`,
        };
      case "primary":
        return {
          backgroundColor: tokens.colors.primary[50],
          color: tokens.colors.primary[700],
          border: `1px solid ${tokens.colors.primary[200]}`,
        };
      case "neutral":
      default:
        return {
          backgroundColor: tokens.colors.secondary[100],
          color: tokens.colors.secondary[700],
          border: `1px solid ${tokens.colors.secondary[200]}`,
        };
    }
  };

  const labelText = customLabel || capitalize(status.replace(/_/g, " "));

  return (
    <Chip
      size="small"
      label={labelText}
      sx={{
        fontWeight: 600,
        fontSize: "0.75rem",
        height: 24,
        borderRadius: tokens.borderRadius.xs,
        ...getStyle(),
        ...sx,
      }}
      {...props}
    />
  );
}
