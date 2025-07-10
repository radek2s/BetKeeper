import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: ["domain/vite.config.ts", "application/vitest.config.ts"],
    reporters: ["default", "junit"],
    outputFile: "./tests-results.xml",
    coverage: {
      enabled: true,
      include: ["domain/**/*", "application/**/*"],
      reporter: ["html"],
      reportsDirectory: "coverage",
      provider: "v8",
    },
  },
});
