import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function DashboardContent({ children }: Props) {
  return <>{children}</>;
}
