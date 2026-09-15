export type AuthEventType = "LOGIN" | "LOGOUT" | "TOKEN_REFRESH" | "SESSION_EXPIRED";

type Listener = (event: AuthEventType) => void;

const listeners = new Set<Listener>();

export const authEvents = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  emit(event: AuthEventType) {
    listeners.forEach((listener) => listener(event));
  },
};
