import type { ReactNode } from "react";
import { ReduxProvider } from "./ReduxProvider";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { NotificationProvider } from "@/shared/notifications";
import { AuthProvider, TenantProvider } from "@/shared/security";
import { SessionProvider } from "@/shared/providers/SessionProvider";

interface Props {
  children: ReactNode;
}

export function AppProviders({ children }: Props) {
  return (
    <ReduxProvider>
      <ThemeProvider>
        <QueryProvider>
          <NotificationProvider>
            <AuthProvider>
              <TenantProvider>
                <SessionProvider>{children}</SessionProvider>
              </TenantProvider>
            </AuthProvider>
          </NotificationProvider>
        </QueryProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
