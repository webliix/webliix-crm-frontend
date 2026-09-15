import { createContext, useContext, type ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/redux";
import { logout as logoutAction } from "@/modules/auth/store/authSlice";
import { selectAccessToken, selectAuthenticated, selectUser } from "@/modules/auth/store/selectors";
import type { CurrentUser } from "@/modules/auth/types/auth.types";

interface AuthContextValue {
  user: CurrentUser | null;
  accessToken: string | null;
  authenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const accessToken = useAppSelector(selectAccessToken);
  const authenticated = useAppSelector(selectAuthenticated);

  const logout = () => {
    dispatch(logoutAction());
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, authenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
