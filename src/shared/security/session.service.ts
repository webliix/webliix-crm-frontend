import { authEvents, type AuthEventType } from "./auth-events";

const ACCESS_TOKEN_KEY = "crm_access_token";
const REFRESH_TOKEN_KEY = "crm_refresh_token";
const EXPIRY_KEY = "crm_session_expiry";
const SESSION_EVENT_KEY = "crm_session_event";

const decodeJwtPayload = (token: string): Record<string, any> | undefined => {
  try {
    const [, payload] = token.split(".");
    if (!payload) {
      return undefined;
    }
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "="));
    return JSON.parse(decoded);
  } catch {
    return undefined;
  }
};

const getExpiryFromToken = (token: string): Date | undefined => {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") {
    return undefined;
  }
  return new Date(payload.exp * 1000);
};

const publishAuthEvent = (event: AuthEventType): void => {
  authEvents.emit(event);
  localStorage.setItem(SESSION_EVENT_KEY, JSON.stringify({ event, timestamp: Date.now() }));
};

export const sessionService = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken(accessToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    const expiry = getExpiryFromToken(accessToken);
    if (expiry) {
      localStorage.setItem(EXPIRY_KEY, expiry.toISOString());
    }
    publishAuthEvent("TOKEN_REFRESH");
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  setTokens(accessToken: string, refreshToken?: string): void {
    this.setAccessToken(accessToken);
    if (refreshToken) {
      this.setRefreshToken(refreshToken);
    }
    publishAuthEvent("LOGIN");
  },

  clearSession(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    publishAuthEvent("LOGOUT");
  },

  clear(): void {
    this.clearSession();
  },

  getExpiry(): Date | null {
    const raw = localStorage.getItem(EXPIRY_KEY);
    if (!raw) {
      return null;
    }

    const date = new Date(raw);
    return Number.isNaN(date.getTime()) ? null : date;
  },

  isExpired(): boolean {
    const expiry = this.getExpiry();
    if (!expiry) {
      return false;
    }
    return expiry.getTime() <= Date.now();
  },

  isAuthenticated(): boolean {
    return Boolean(this.getAccessToken()) && !this.isExpired();
  },

  async refresh(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return Promise.reject(new Error("Refresh token is not available."));
    }

    // Refresh token endpoint is not currently declared in the OpenAPI spec.
    // This method is intentionally prepared for the backend refresh flow once the API is available.
    return Promise.reject(new Error("Refresh endpoint is not configured."));
  },
};
