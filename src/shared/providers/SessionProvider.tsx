import { useEffect, useState, type ReactNode } from "react";
import { useAppDispatch } from "@/app/store/redux";
import { handleUnauthorized } from "@/shared/errors/handleUnauthorized";
import { sessionService } from "@/shared/security/session.service";
import { authEvents, type AuthEventType } from "@/shared/security/auth-events";
import { SessionExpiredDialog } from "@/shared/components/session/SessionExpiredDialog";

const SESSION_EVENT_KEY = "crm_session_event";

interface Props {
  children: ReactNode;
}

export function SessionProvider({ children }: Props) {
  const dispatch = useAppDispatch();
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const handleAuthEvent = (event: AuthEventType) => {
      if (event === "SESSION_EXPIRED" || event === "LOGOUT") {
        setExpired(true);
      }
    };

    const unsubscribe = authEvents.subscribe(handleAuthEvent);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.storageArea !== window.localStorage || event.key !== SESSION_EVENT_KEY) {
        return;
      }

      try {
        const payload = event.newValue ? JSON.parse(event.newValue) : null;
        if (payload?.event === "SESSION_EXPIRED" || payload?.event === "LOGOUT") {
          setExpired(true);
          handleUnauthorized(dispatch);
        }
      } catch {
        // Ignore malformed session sync events.
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [dispatch]);

  useEffect(() => {
    if (sessionService.isExpired()) {
      setExpired(true);
      handleUnauthorized(dispatch);
    }

    const interval = window.setInterval(() => {
      if (sessionService.isExpired()) {
        setExpired(true);
        handleUnauthorized(dispatch);
      }
    }, 30_000);

    return () => window.clearInterval(interval);
  }, [dispatch]);

  const handleLoginRedirect = () => {
    setExpired(false);
    window.location.assign("/login");
  };

  return (
    <>
      {children}
      <SessionExpiredDialog open={expired} onClose={handleLoginRedirect} />
    </>
  );
}
