import { useAppSelector } from "@/shared/hooks/redux";
import { selectUser } from "@/modules/auth/store/selectors";

export function usePermission() {
  const user = useAppSelector(selectUser);

  const hasPermission = (permission?: string) => {
    if (!permission) return true;
    if (!user) return false;

    const isSuperAdmin = user.roles?.some(
      (r) => r.toUpperCase() === "SUPER_ADMIN" || r.toUpperCase() === "ROLE_SUPER_ADMIN"
    );

    if (isSuperAdmin || user.permissions?.includes("*")) {
      return true;
    }

    return Boolean(user.permissions?.includes(permission));
  };

  return { hasPermission, permissions: user?.permissions ?? [] };
}
