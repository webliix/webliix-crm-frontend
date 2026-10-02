// Easy Switcher for Backend Server:
export const BACKEND_SERVERS = {
  local: "http://localhost:8082",
  cloud: "https://webliix-crm-backend.onrender.com",
};

// -------------------------------------------------------------
// 👈 CHANGE THIS LINE TO SWITCH BETWEEN LOCAL AND CLOUD SERVER:
// Options: BACKEND_SERVERS.cloud  OR  BACKEND_SERVERS.local
// -------------------------------------------------------------
const ACTIVE_SERVER = BACKEND_SERVERS.local;

export const env = {
  appName: import.meta.env.VITE_APP_NAME || "Webliix Hub",
  apiBaseUrl: ACTIVE_SERVER.replace(/\/+$/, ""),
};


