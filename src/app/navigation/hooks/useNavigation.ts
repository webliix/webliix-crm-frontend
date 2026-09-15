import { useMemo } from "react";
import { useAppSelector } from "@/app/store/redux";
import { getVisibleNavigationItems } from "../registry";
import { selectUser } from "@/modules/auth/store/selectors";

export function useNavigation() {
  const user = useAppSelector(selectUser);

  return useMemo(() => getVisibleNavigationItems(user), [user]);
}
