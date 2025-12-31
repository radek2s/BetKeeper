import { nxE2EPreset } from "@nx/cypress/plugins/cypress-preset.js";
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    ...nxE2EPreset("cypress.config.js", {
      cypressDir: "e2e-tests/cypress",
      bundler: "vite",
      webServerCommands: {
        default: "nx run application:dev",
        // production: "nx run my-project:preview",
      },
      //   ciWebServerCommand: "nx run application:dev",
    }),
    baseUrl: "http://localhost:3000",
  },
});
