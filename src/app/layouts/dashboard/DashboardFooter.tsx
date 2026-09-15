import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { tokens } from "@/theme/tokens";

export function DashboardFooter() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2.5,
        px: { xs: 2, sm: 3, md: 4 },
        borderTop: `1px solid ${tokens.colors.secondary[200]}`,
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
        mt: "auto",
      }}
    >
      <Typography variant="caption" color="text.secondary">
        © {new Date().getFullYear()} Webliix Hub. All rights reserved.
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Link href="#" underline="hover" variant="caption" color="text.secondary">
          Privacy Policy
        </Link>
        <Link href="#" underline="hover" variant="caption" color="text.secondary">
          Terms of Service
        </Link>
        <Link href="#" underline="hover" variant="caption" color="text.secondary">
          Help & Support
        </Link>
      </Box>
    </Box>
  );
}
