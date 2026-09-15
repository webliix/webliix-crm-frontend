import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export interface TenantContext {
  tenantId: string;
  tenantName: string;
  subscriptionPlan: string;
}

interface TenantContextValue extends TenantContext {
  setTenantInfo: (info: Partial<TenantContext>) => void;
  clearTenant: () => void;
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

interface Props {
  children: ReactNode;
}

const defaultTenant: TenantContext = {
  tenantId: "",
  tenantName: "",
  subscriptionPlan: "",
};

export function TenantProvider({ children }: Props) {
  const [tenantInfo, setTenantInfo] = useState<TenantContext>(defaultTenant);

  const value = useMemo(
    () => ({
      ...tenantInfo,
      setTenantInfo: (info: Partial<TenantContext>) => setTenantInfo((current) => ({ ...current, ...info })),
      clearTenant: () => setTenantInfo(defaultTenant),
    }),
    [tenantInfo],
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenantContext(): TenantContextValue {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenantContext must be used within TenantProvider");
  }
  return context;
}
