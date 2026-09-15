import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function AuthLayout({ children }: Props) {
  return <>{children}</>;
}
