import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The API runs on its own port in development; Vite forwards /api to it.
const apiUrl = process.env.API_URL || "http://127.0.0.1:8000";

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.PORT) || 5173,
    proxy: {
      "/api": {
        target: apiUrl,
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.js"],
    // End-to-end journeys live in e2e/ and run with Playwright, not vitest.
    include: ["src/**/*.{test,spec}.{js,jsx}"],
    exclude: ["**/node_modules/**", "**/dist/**", "../e2e/**"],
  },
});
