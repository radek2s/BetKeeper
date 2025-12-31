import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: ["domain/vite.config.ts", "application/vitest.config.ts"],
    reporters: ["default", "junit"],
    outputFile: "./tests-results.xml",
    coverage: {
      enabled: true,
      include: [
        "domain/src/**/*",
        "application/src/**/*",
        "application/specs/**/*",
      ],
      exclude: ["application/src/app/**", "**/*.mock.ts"],
      reporter: ["html", ["json", { file: "./coverage.json" }]],
      reportsDirectory: "coverage",
      provider: "v8",
    },
  },
});
