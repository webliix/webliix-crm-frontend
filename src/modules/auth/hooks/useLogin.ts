import { useMutation } from "@tanstack/react-query";
import { authService } from "@/modules/auth/services/auth.service";
import { sessionService } from "@/shared/security/session.service";
import { useAppDispatch } from "@/app/store/redux";
import { setToken, setUser } from "@/modules/auth/store/authSlice";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/shared/notifications/useNotification";
import { messages } from "@/shared/constants/messages";
import type { LoginRequest } from "@/modules/auth/types/auth.types";

export function useLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notification = useNotification();

  return useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    onSuccess: async (response: any) => {
      const token = response?.data?.accessToken ?? response?.accessToken;
      const refreshToken = response?.data?.refreshToken ?? response?.refreshToken;
      const user = response?.data?.user ?? response?.user;

      if (!token) {
        return;
      }

      sessionService.setTokens(token, refreshToken);
      dispatch(setToken(token));

      if (user) {
        dispatch(setUser(user));
      }

      notification.success(messages.loginSuccess);

      navigate("/dashboard", { replace: true });
    },
  });
}

export default useLogin;
