import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Remove hardcoded proxy since we're using environment variables
    // The frontend will now use the full API URL from VITE_API_BASE_URL
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  // Vite automatically loads environment variables prefixed with VITE_
  // from .env files, so no additional configuration is needed
});
