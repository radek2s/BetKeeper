# Bet Keeper E2E Tests for Application

[Back to parent](../readme.md)

Tech stack:
- [Playwright](https://playwright.dev/) E2E test framework for testing async Server Components

## Commands

Preparation of environment  
Because Prisma can create SQLite database without any complex scripts there is prepared step-by-step generator that purge database for E2E tests and initialize default user. 


Installation of packages
```shell
npm i
```

To prepare environment for E2E test you need to generate database. Given script prepares empty SQLite database with initial user.
```shell
npm run e2e:init
```

Playwright perform auto-start of Next.js application in `dev` mode that performs hot-swap during code changes.  
To start developing your E2E tests with Playwright UI run:
```shell
npm run e2e:ui
```

To just exetute tests in headless mode:
```shell
npm run e2e
```
