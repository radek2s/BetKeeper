# [Bet Keeper](https://bet-keeper.vercel.app)


![](./documents/BetKeeper_Logo.png)



![Static Badge](https://img.shields.io/badge/Next.js-%23262c36.svg?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Static Badge](https://img.shields.io/badge/Prisma-%23262c36.svg?style=for-the-badge&logo=prisma&logoColor=white)
![Static Badge](https://img.shields.io/badge/TypeScript-%23262c36.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Static Badge](https://img.shields.io/badge/Tailwind-%23262c36.svg?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Static Badge](https://img.shields.io/badge/Biome-%23262c36.svg?style=for-the-badge&logo=biome&logoColor=white)
![Static Badge](https://img.shields.io/badge/Figma-%23262c36.svg?style=for-the-badge&logo=figma&logoColor=white)
![Static Badge](https://img.shields.io/badge/Vercel-%23262c36.svg?style=for-the-badge&logo=vercel&logoColor=white)
![Static Badge](https://img.shields.io/badge/Supabase-%23262c36.svg?style=for-the-badge&logo=supabase&logoColor=white)
![Static Badge](https://img.shields.io/badge/Nx-%23262c36.svg?style=for-the-badge&logo=nx&logoColor=white)
![Static Badge](https://img.shields.io/badge/Vite-%23262c36.svg?style=for-the-badge&logo=vite&logoColor=white)
![Static Badge](https://img.shields.io/badge/Vitest-%23262c36.svg?style=for-the-badge&logo=vitest&logoColor=white)
![Static Badge](https://img.shields.io/badge/Cucumber-%23262c36.svg?style=for-the-badge&logo=cucumber&logoColor=white)
![Static Badge](https://img.shields.io/badge/Playwright-%23262c36.svg?style=for-the-badge)
![Static Badge](https://img.shields.io/badge/Pino.js-%23262c36.svg?style=for-the-badge&logo=pino&logoColor=white)
![Static Badge](https://img.shields.io/badge/RadixUI-%23262c36.svg?style=for-the-badge&logo=radixui&logoColor=white)
![Static Badge](https://img.shields.io/badge/TanStack%20Query-%23262c36.svg?style=for-the-badge&logo=tanstack&logoColor=white)





# 🏗️ Project under construction...

Project enters final phase before release of version 3.0 according to [BetKeeper plan](https://github.com/users/radek2s/projects/1). Now application is validated against usability tests in small group of people. 

# About

Bet Keeper is an IT solution designed to manage bet among group of friends or anyone who enjoys making light-hearted bets and competitions with their circle. This platform simplify the process of recording, tracking and resolving bets ensuring that all participants stays up-to date with their ventures.  
[read more...](./documents/01_requirements/00-requirements.md)

## Development plan

The main goal of this project is to show my experience in designing and developing web applications. **The project will follow the full software development lifecycle**, starting from design, then moving through implementation, verification, and validation. Each phase will be completed in a waterfall model. During the validation phase, I will collect feedback that will help improve the application in the next version.

#### Design Phase
In this phase, I will define the requirements and prepare sketches and interface designs. This will help set the scope of the work and the expected result.

- [Requirements](./documents/01_requirements/00-requirements.md)
- [Bet Use Cases](./documents/01_requirements/use_cases/bet_context.md)
- [Friend Use Cases](./documents/01_requirements/use_cases/friend_context.md)
- [Architecture Design](./documents/03_architecture/01-context.md)
- [Concept graphics | Wireframe](./documents/04_concept_designs/readme.md)
- [Mockups more detailed design](./documents/05_app_designs/readme.md)

#### Implementation Phase
During implementation, I will build each module of the application using good software development practices. The code will be clean, maintainable, and easy to extend.

- [Project plan](https://github.com/users/radek2s/projects/1)

#### Verification Phase

[![codecov](https://codecov.io/gh/radek2s/BetKeeper/branch/main/graph/badge.svg?token=VVZYBJRPUU)](https://codecov.io/gh/radek2s/BetKeeper)

All parts of the application will be verified using unit tests and end‑to‑end tests. This will ensure that the system works correctly and meets the defined requirements. 

- [Tests reports](https://github.com/radek2s/BetKeeper/actions/workflows/dev-branch-health.yml)

#### Validation Phase
The ready release candidate version  will be shared with a small test group. Their feedback will help evaluate the usability of the application and guide improvements for the next release.

[... Current phase ...](./documents/07_validation)


# Technology

- [NX](https://nx.dev/) - Build platform to manage codebase and organize modules within
  BetKeeper monorepo.
- [Vite](https://vite.dev/) - Build Tool.
- [Next.js](https://nextjs.org/) - React Framework for full stack experience for
  web-application.

- [Biome.js](https://biomejs.dev/) Performant toolchain for WebApplication

- [Vercel](https://vercel.com/) Hosting for Next.js application
- [Supabase](https://supabase.com/) PostgreSQL database provider
- [Corbado](https://www.corbado.com/) Passwordless authentication provider
- [Playwright](https://playwright.dev/) E2E Test tool


### Sub modules

- [Domain](./domain/readme.md) - business logic and tests of core BetKeeper objects
- [Application](./application/readme.md) - application layer that host an UI and wrap business logic with database persistence and server logic
- [E2E Tests](./e2e-tests/readme.md) - end-to-end tests for BetKeeper application that check if requirements are met using cucumber and playwright.

# Development Quick Start
Project runs on [Node.js](https://nodejs.org/en) environment and is required for development.

Dependencies installation and workspace initialization:
```
npm i
```

Environment variables are described in `.env` file.  
Create `.env.local` file to override environment variables without adding to git stash area and keep your secrets away from version control.


### Authentication preparation


**Prepare Manual authentication project**  
`MANUAL` Manual Authentication  (via manual set of active user ID - for tests or local development)  

To change active logged user visit `http://localhost:3000/dev` and enter the user ID you want to switch to.


**Prepare Corbado authentication project [advanced]**  
`CORBADO` [Corbado Authentication](https://www.corbado.com/) requires creation of free open-source project and providing valid properties to `.env.local` variable  


```properties
DB_PRISMA_URL="file:./betKeeper.db"
NEXT_PUBLIC_CORBADO_PROJECT_ID=pro-xxxxxxxxxxxxxxxxxxx
CORBADO_API_SECRET=corbado1_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CORBADO_FRONTEND_API=https://pro-xxxxxxxxxxxxxxxxxxx.frontendapi.cloud.corbado.io
CORBADO_BACKEND_API=https://backendapi.cloud.corbado.io
```

Create in Corbado panel a new user.

Replace providerId value in database in `user` table with userId from Corbado panel after performing `dev:init` command from next step.

### Environment initialization

```shell
npm run dev:init # To initialize SQLite database (can be omitted when already created)
```

### Development sever
```shell
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and login as created user.

# E2E Tests Quick start
Project use Playwright with TypeScript on [Node.js](https://nodejs.org/en) environment that is required for test development and execution.  
Check [E2E Readme](./e2e-tests/readme.md) for more details


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

To just execute tests in headless mode:
```shell
npm run e2e
```

You can modify the E2E test environment in `.env.test.local` file by overriding available variables. This file is excluded from version control system.


# License

Images from [unDraw](https://undraw.co/)  
Icons from [fluentIcons](https://fluenticons.co/)


[Using RadixUI Primitives](https://www.radix-ui.com/primitives)
