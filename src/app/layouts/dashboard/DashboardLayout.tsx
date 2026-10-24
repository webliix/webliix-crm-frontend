import { useState, type ReactNode } from "react";
import Box from "@mui/material/Box";
import { layout } from "@/shared/constants/layout";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardFooter } from "./DashboardFooter";

interface Props {
  children: ReactNode;
}

export function DashboardLayout({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <DashboardSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          overflowX: "hidden",
          ml: { xs: 0, md: `${layout.sidebarWidth}px` },
        }}
      >
        <DashboardHeader onMenuClick={handleDrawerToggle} />

        <Box component="main" sx={{ flex: 1, display: "flex", flexDirection: "column", pt: `${layout.headerHeight}px` }}>
          {children}
        </Box>

        <DashboardFooter />
      </Box>
    </Box>
  );
}
