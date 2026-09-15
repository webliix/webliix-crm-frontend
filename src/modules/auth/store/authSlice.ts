import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CurrentUser } from "@/modules/auth/types/auth.types";
import { sessionService } from "@/shared/security/session.service";

interface AuthState {
  accessToken: string | null;
  authenticated: boolean;
  user: CurrentUser | null;
  loading: boolean;
}

const getInitialToken = (): string | null => {
  const token = sessionService.getAccessToken();
  if (token && !sessionService.isExpired()) {
    return token;
  }
  return null;
};

const initialToken = getInitialToken();

const initialState: AuthState = {
  accessToken: initialToken,
  authenticated: Boolean(initialToken),
  user: null,
  loading: Boolean(initialToken),
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.authenticated = true;
    },

    setUser: (state, action: PayloadAction<CurrentUser>) => {
      state.user = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    logout: (state) => {
      state.accessToken = null;
      state.authenticated = false;
      state.user = null;
    },
  },
});

export const { setToken, logout, setUser, setLoading } = authSlice.actions;

export default authSlice.reducer;
