import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { errorHandler } from "@/shared/errors/errorHandler";
import { ErrorCodes } from "@/shared/errors/ErrorCodes";
import { useAppDispatch } from "@/app/store/redux";
import { handleUnauthorized } from "@/shared/errors/handleUnauthorized";

/**
 * Global error listener hook that handles specific error codes
 * Should be called once in the root App component
 */
export function useGlobalErrorHandler() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = errorHandler.subscribe((error) => {
      switch (error.code) {
        case ErrorCodes.UNAUTHORIZED:
          // Handle unauthorized by logging out and redirecting
          handleUnauthorized(dispatch, (path) => navigate(path));
          break;

        case ErrorCodes.FORBIDDEN:
          // Redirect to access denied page
          navigate("/403");
          break;

        case ErrorCodes.NOT_FOUND:
          // Redirect to not found page
          navigate("/404");
          break;

        default:
          // For other errors, they're just logged via errorHandler
          break;
      }
    });

    return () => unsubscribe();
  }, [navigate, dispatch]);
}
