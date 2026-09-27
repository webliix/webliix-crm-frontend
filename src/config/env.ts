// Easy Switcher for Backend Server:
export const BACKEND_SERVERS = {
  local: "http://localhost:8082",
  cloud: "https://webliix-crm-backend.onrender.com",
};

// -------------------------------------------------------------
// 👈 CHANGE THIS LINE TO SWITCH BETWEEN LOCAL AND CLOUD SERVER:
// Options: BACKEND_SERVERS.cloud  OR  BACKEND_SERVERS.local
// -------------------------------------------------------------
const ACTIVE_SERVER = BACKEND_SERVERS.cloud;

const rawApiUrl = import.meta.env.VITE_API_BASE_URL || ACTIVE_SERVER;

export const env = {
  appName: import.meta.env.VITE_APP_NAME || "Webliix Hub",
  apiBaseUrl: rawApiUrl.replace(/\/+$/, ""),
};

