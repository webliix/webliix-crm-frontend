import type { ReactNode } from "react";
import { useEffect } from "react";
import { SnackbarProvider, useSnackbar } from "notistack";
import { setNotificationService } from "./notification.service";

interface Props {
  children: ReactNode;
}

function NotificationServiceInitializer() {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setNotificationService({
      success: (message: string) =>
        enqueueSnackbar(message, { variant: "success" }),
      error: (message: string) =>
        enqueueSnackbar(message, { variant: "error" }),
      warning: (message: string) =>
        enqueueSnackbar(message, { variant: "warning" }),
      info: (message: string) =>
        enqueueSnackbar(message, { variant: "info" }),
    });
  }, [enqueueSnackbar]);

  return null;
}

export function NotificationProvider({ children }: Props) {
  return (
    <SnackbarProvider
      maxSnack={5}
      autoHideDuration={4000}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <NotificationServiceInitializer />
      {children}
    </SnackbarProvider>
  );
}
