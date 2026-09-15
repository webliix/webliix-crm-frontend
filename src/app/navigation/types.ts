import type { ReactNode } from "react";

export interface NavigationItem {
  label: string;
  path: string;
  icon?: ReactNode;
  permission?: string;
}
