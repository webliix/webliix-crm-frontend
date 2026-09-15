import type { RootState } from "@/app/store";

export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectRoles = (state: RootState) => state.auth.user?.roles ?? [];
export const selectAuthenticated = (state: RootState) => state.auth.authenticated;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectLoading = (state: RootState) => state.auth.loading;
