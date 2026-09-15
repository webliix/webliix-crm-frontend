import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { usePermission } from "@/shared/rbac/hooks/usePermission";

interface Props {
  permission: string;
  children: ReactNode;
}

export function PageGuard({ permission, children }: Props) {
  const { hasPermission } = usePermission();

  if (!hasPermission(permission)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}
