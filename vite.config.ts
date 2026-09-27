import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      "/api": {
        target: "https://webliix-crm-backend.onrender.com",
        changeOrigin: true,
        secure: false,
      },
      "/actuator": {
        target: "https://webliix-crm-backend.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
