import type { ReactNode } from "react";
import { usePermission } from "@/modules/auth/hooks/usePermission";

interface Props {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGuard({
  permission,
  children,
  fallback = null,
}: Props) {
  const { hasPermission } = usePermission();

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
