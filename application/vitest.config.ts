import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig(() => ({
  plugins: [react(), tsconfigPaths()],
  test: {
    name: "Application Unit Tests",
    watch: false,
    globals: true,
    environment: "jsdom",
    include: ["{src,specs}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: [
      "{src,specs}/**/*.integration.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
    onUnhandledError(error) {
      if (error.name === "TestError") {
        return false;
      }
    },
  },
}));
