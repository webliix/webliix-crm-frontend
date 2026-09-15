import { type ReactNode } from "react";
import Container, { type ContainerProps } from "@mui/material/Container";

export interface AppContainerProps extends ContainerProps {
  children: ReactNode;
  noPadding?: boolean;
}

export function AppContainer({ children, noPadding = false, sx, ...props }: AppContainerProps) {
  return (
    <Container
      maxWidth="xl"
      disableGutters={noPadding}
      sx={{
        py: noPadding ? 0 : { xs: 2, sm: 3, md: 4 },
        px: noPadding ? 0 : { xs: 2, sm: 3, md: 4 },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Container>
  );
}
