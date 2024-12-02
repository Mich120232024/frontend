import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Default port for Vite
    open: true, // Automatically open the app in the browser
    proxy: {
      "/api": "http://127.0.0.1:5000", // Proxy API requests to the backend server
    },
  },
  resolve: {
    alias: {
      "@": "/src", // Allows importing from '@/...' for the `src` directory
    },
  },
  build: {
    outDir: "dist", // Output directory for the production build
  },
});
