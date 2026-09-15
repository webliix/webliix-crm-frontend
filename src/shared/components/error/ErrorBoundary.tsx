import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import type { ReactNode } from "react";
import { ErrorFallback } from "./ErrorFallback";

interface Props {
  children: ReactNode;
}

export function ErrorBoundary({ children }: Props) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.href = "/"}>
      {children}
    </ReactErrorBoundary>
  );
}
