import { useState, type ReactNode } from "react";
import Box from "@mui/material/Box";
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
        }}
      >
        <DashboardHeader onMenuClick={handleDrawerToggle} />

        <Box component="main" sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {children}
        </Box>

        <DashboardFooter />
      </Box>
    </Box>
  );
}
