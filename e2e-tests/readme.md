# Bet Keeper E2E Tests for Application

[Back to parent](../readme.md)

Tech stack:
- [Cypress](https://docs.cypress.io/) E2E test framework for testing async Server Components
- [Cucumber](https://cucumber.io/) Behaviour-Driven Development framework for testing requirements

## Commands

Preparation of environment  
Because Prisma can create SQLite database without any complex scripts there is prepared step-by-step generator that purge database for E2E tests and initialize default user. 

```shell
npm run prepare-e2e
```

Then you can execute single test run that runs server and performs full E2E execution:
```shell
npm run e2e
```

To open Cypress UI use following command:
```shell
npm run e2e:ui
```
For some reasons on Windows this running server through UI blocks generated files. Then database purge might not work. To solve this issue try to logout and login into system or find process that is blocking files listed in terminal.

---

Run Cucumber Behaviour-Driven Development tests that verifies requirements
```shell
npx nx run bet-keeper:test:bdd
```
Then you can open [cucumber-report.html](./test-result/cucumber-report.html) to visit what requriements are met.