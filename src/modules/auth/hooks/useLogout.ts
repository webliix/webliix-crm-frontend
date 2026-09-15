import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/app/store/redux";
import { useNavigate } from "react-router-dom";
import { authService } from "@/modules/auth/services/auth.service";
import { logout as logoutAction } from "@/modules/auth/store/authSlice";

export function useLogout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useCallback(() => {
    authService.logout();
    dispatch(logoutAction());
    queryClient.clear();
    navigate("/login", { replace: true });
  }, [dispatch, navigate, queryClient]);
}
