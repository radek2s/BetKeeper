// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins } = require("@nx/next");
const { loadEnvConfig } = require("@next/env");
const path = require("path");

// Load .env from repository root (one level above `application/`) so
// workspace-wide env files are available when Nx/Next start from the
// `application` folder as CWD.
loadEnvConfig(path.resolve(__dirname, ".."));

const DATABASE_TYPE = process.env.DATABASE_SCHEMA;
const DATABASE_URL = process.env.DATABASE_URL;
const AUTH_TYPE = process.env.NEXT_PUBLIC_AUTH_MODE;
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "dev";
console.log(`*** BetKeeper v${APP_VERSION} ***`);
console.log(`- Authentication mode:\t ${AUTH_TYPE}`);
console.log(`- Database type:\t ${DATABASE_TYPE}`);
if (DATABASE_TYPE === "schema_sqlite") {
  console.log(`- Database file:\t ${DATABASE_URL}`);
}

const nextConfig = {
  // eslint: {
  //   ignoreDuiringBuilds: true,
  // },
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  // withNx,
];

module.exports = {
  typescript: {
    ignoreBuildErrors: true,
  },
};
