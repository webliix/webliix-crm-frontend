import { useEffect, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/app/store/redux";
import { LoadingScreen } from "@/shared/components/ui";
import { selectAuth } from "@/modules/auth/store/selectors";
import { useCurrentUser } from "@/modules/auth/hooks/useCurrentUser";
import { setUser } from "@/modules/auth/store/authSlice";

interface Props {
  children: ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const dispatch = useAppDispatch();
  const { accessToken, user, loading } = useAppSelector(selectAuth);

  const { data: currentUser, isLoading: isUserLoading, isError } = useCurrentUser();

  useEffect(() => {
    if (currentUser && !user) {
      dispatch(setUser(currentUser));
    }
  }, [currentUser, user, dispatch]);

  if (loading) {
    return <LoadingScreen message="Restoring session..." />;
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (isUserLoading && !user) {
    return <LoadingScreen message="Authorizing permissions..." />;
  }

  if (isError && !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
