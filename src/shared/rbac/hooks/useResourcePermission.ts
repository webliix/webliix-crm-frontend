import { permissions } from "../permissions";
import { useAppSelector } from "@/shared/hooks/redux";
import { selectUser } from "@/modules/auth/store/selectors";

export function useResourcePermission<Resource extends keyof typeof permissions>(
  resource: Resource,
  action: keyof typeof permissions[Resource],
) {
  const user = useAppSelector(selectUser);
  const permission = permissions[resource][action] as string;

  const hasPermission = () => {
    return !!permission && !!user?.permissions?.includes(permission);
  };

  return { permission, hasPermission };
}
