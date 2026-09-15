import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import { AppContainer } from "./AppContainer";
import { PageHeader, type PageHeaderProps } from "./PageHeader";

export interface PageLayoutProps extends Partial<PageHeaderProps> {
  children: ReactNode;
  headerProps?: PageHeaderProps;
  noContainer?: boolean;
}

export function PageLayout({
  children,
  title,
  subtitle,
  breadcrumbs,
  actions,
  status,
  onBack,
  headerProps,
  noContainer = false,
}: PageLayoutProps) {
  const resolvedTitle = title || headerProps?.title;

  const content = (
    <Box sx={{ width: "100%" }}>
      {resolvedTitle && (
        <PageHeader
          title={resolvedTitle}
          subtitle={subtitle || headerProps?.subtitle}
          breadcrumbs={breadcrumbs || headerProps?.breadcrumbs}
          actions={actions || headerProps?.actions}
          status={status || headerProps?.status}
          onBack={onBack || headerProps?.onBack}
        />
      )}
      {children}
    </Box>
  );

  if (noContainer) {
    return content;
  }

  return <AppContainer>{content}</AppContainer>;
}
