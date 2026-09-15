import { useAppSelector } from "@/shared/hooks/redux";
import { selectUser } from "@/modules/auth/store/selectors";

export function useRole() {
  const user = useAppSelector(selectUser);

  const hasRole = (roles: string[]) => {
    return !!user?.roles?.some((role) => roles.includes(role));
  };

  return { hasRole, roles: user?.roles ?? [] };
}
