# Bet Keeper E2E Tests for Application

[Back to parent](../readme.md)

Tech stack:
- [Playwright](https://playwright.dev/) E2E test framework for testing async Server Components
- [Cucumber](https://cucumber.io/) Behaviour-Driven Development framework for testing requirements

## Commands

Run application and perform E2E tests in Playwright UI
Playwright start Next.js server automatically.
```shell
npx nx build application
npx nx run e2e-tests:e2e --ui
```

Run Cucumber Behaviour-Driven Development tests that verifies requirements
```shell
npx nx run bet-keeper:test:bdd
```
Then you can open [cucumber-report.html](./test-result/cucumber-report.html) to visit what requriements are met.