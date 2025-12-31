import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig(() => ({
  plugins: [react()],
  test: {
    name: "Application Unit Tests",
    watch: false,
    globals: true,
    environment: "jsdom",
    include: ["{src,specs}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: [
      "{src,specs}/**/*.integration.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
  },
}));
