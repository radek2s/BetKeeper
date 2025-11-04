import { nxE2EPreset } from "@nx/cypress/plugins/cypress-preset";
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: "cypress",
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
