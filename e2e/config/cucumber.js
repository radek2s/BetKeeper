module.exports = {
  default: {
    formateOptions: {
      snippentInterface: "async-await",
    },
    paths: ["e2e/features/*.feature"],
    publishQuite: true,
    dryRun: false,
    require: ["e2e/steps/*.ts"],
    requireModule: ["ts-node/register"],
    format: [
      "html:test-result/cucumber-report.html",
      "json:test-result/cucumber-report.json",
    ],
    parallel: 2,
  },
};
