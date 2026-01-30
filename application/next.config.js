// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins } = require("@nx/next");
const { loadEnvConfig } = require("@next/env");

loadEnvConfig(process.cwd());

const DATABASE_TYPE = process.env.DATABASE_SCHEMA;
const DATABASE_URL = process.env.DATABASE_URL;
const AUTH_TYPE = process.env.NEXT_PUBLIC_AUTH_MODE;
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION;
console.log(`*** BetKeeper v${APP_VERSION} ***`);
console.log(`Using ${DATABASE_TYPE} on URL: ${DATABASE_URL}`);
console.log(`Using authentication mode: ${AUTH_TYPE}\n`);

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
