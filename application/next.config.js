// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins } = require("@nx/next");
const { loadEnvConfig } = require("@next/env");

loadEnvConfig(process.cwd());

const DATABASE_URL = process.env.DB_PRISMA_URL;
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION;
console.log(`*** BetKeeper v${APP_VERSION} ***`);
console.log(`Using SQLite file: ${DATABASE_URL}\n`);

const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  // withNx,
];

module.exports = {};
