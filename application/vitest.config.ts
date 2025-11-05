import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig(() => ({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@domain", replacement: resolve(__dirname, "../domain/src") },
      { find: "@db", replacement: resolve(__dirname, "../generated/prisma") },
      { find: "application", replacement: resolve(__dirname, "./") },
    ],
  },
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
