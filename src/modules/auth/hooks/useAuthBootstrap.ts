import { useEffect } from "react";
import { sessionService } from "@/shared/security/session.service";
import { authService } from "@/modules/auth/services/auth.service";
import { useAppDispatch } from "@/app/store/redux";
import { setToken, setUser, setLoading, logout } from "@/modules/auth/store/authSlice";

export function useAuthBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = sessionService.getAccessToken();
        if (!token || sessionService.isExpired()) {
          if (token) {
            sessionService.clearSession();
          }
          dispatch(logout());
          dispatch(setLoading(false));
          return;
        }

        dispatch(setLoading(true));
        dispatch(setToken(token));

        const user = await authService.me();
        if (user) {
          dispatch(setUser(user));
        }
      } catch {
        // If token is invalid or expired, clear session & state
        sessionService.clearSession();
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    };

    bootstrap();
  }, [dispatch]);
}

export default useAuthBootstrap;
