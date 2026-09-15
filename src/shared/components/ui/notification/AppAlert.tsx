import { type ReactNode } from "react";
import Alert, { type AlertProps } from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { tokens } from "@/theme/tokens";

export interface AppAlertProps extends Omit<AlertProps, "title"> {
  title?: string;
  children: ReactNode;
}

export function AppAlert({ title, children, severity = "info", sx, ...props }: AppAlertProps) {
  return (
    <Alert
      severity={severity}
      sx={{
        borderRadius: tokens.borderRadius.md,
        fontSize: "0.875rem",
        border: "1px solid",
        ...(severity === "info" && {
          borderColor: tokens.colors.info[200],
          backgroundColor: tokens.colors.info[50],
          color: tokens.colors.info[700],
        }),
        ...(severity === "success" && {
          borderColor: tokens.colors.success[200],
          backgroundColor: tokens.colors.success[50],
          color: tokens.colors.success[700],
        }),
        ...(severity === "warning" && {
          borderColor: tokens.colors.warning[200],
          backgroundColor: tokens.colors.warning[50],
          color: tokens.colors.warning[700],
        }),
        ...(severity === "error" && {
          borderColor: tokens.colors.error[200],
          backgroundColor: tokens.colors.error[50],
          color: tokens.colors.error[700],
        }),
        ...sx,
      }}
      {...props}
    >
      {title && <AlertTitle sx={{ fontWeight: 700, mb: 0.5 }}>{title}</AlertTitle>}
      {children}
    </Alert>
  );
}
