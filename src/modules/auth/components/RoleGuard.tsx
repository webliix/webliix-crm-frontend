import type { ReactNode } from "react";
import { useAppSelector } from "@/app/store/redux";
import { selectUser } from "@/modules/auth/store/selectors";

interface Props {
  roles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGuard({
  roles,
  children,
  fallback = null,
}: Props) {
  const user = useAppSelector(selectUser);
  const userRoles = user?.roles ?? [];

  const hasRole = roles.some((role) => userRoles.includes(role));

  if (!hasRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
