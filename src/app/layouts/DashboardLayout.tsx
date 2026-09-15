import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function DashboardLayout({ children }: Props) {
  return <>{children}</>;
}
