import type { ReactNode } from "react";
import { features } from "@/shared/constants/features";

interface Props {
  feature: keyof typeof features;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureGuard({
  feature,
  children,
  fallback = null,
}: Props) {
  if (!features[feature]) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
