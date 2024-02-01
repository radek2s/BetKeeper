# [Bet Keeper](https://radek2s.github.io/BetKeeper/)

![GitHub release (latest by date)](https://img.shields.io/github/v/release/radek2s/BetKeeper?style=for-the-badge)

[![codecov](https://codecov.io/gh/radek2s/BetKeeper/graph/badge.svg?token=VVZYBJRPUU)](https://codecov.io/gh/radek2s/BetKeeper)

[![CodeFactor](https://www.codefactor.io/repository/github/radek2s/betkeeper/badge)](https://www.codefactor.io/repository/github/radek2s/betkeeper)

Progressive Web Application (PWA) build with React and Typescript to manage and display
bets between two people. Store data in browser memory or connect to your own Firebase
store.

## Tech stack:

<div style="height:64px;display:flex;justify-content:space-around; align-items:center; margin:16px 0;">
    <img src='./docs/logo_react.svg' alt="React" height="48px"/>
    <img src='./docs/logo_vite.svg' alt="Vite" height="48px"/>
    <img src='./docs/logo_tailwind.svg' alt="Tailwind" height="48px"/>
    <img src='./docs/logo_firebase.svg' alt="Firebase" height="48px"/>
    <img src='./docs/logo_pwa.svg' alt="Progressive Web Application" height="48px"/>
</div>

## Usage - Quick Start

Stable version of application is hosted on GitHub Pages. To check how it looks like just
open the running environment.

### Local environment

- Clone repository
  ```
  git clone https://github.com/radek2s/BetKeeper.git
  ```
- Install dependencies for frontend application
  ```
  npm i
  ```
- Run application (from root directory)
  ```
  npm run start
  ```
- Open browser on address [http://localhost:5173/](http://localhost:5173/)

### Firebase environment

To connect with firebase to store your bet data just create a new Firebase Application and
provide all required configuration data directly on "Settings" page.

## Development

Application was designed in Adobe XD. Then based on prepared mocup this application has
been created.

### Scripts

- `npm install`: install project dependencies
- `npm prepare`: install husky 🐶 - pre-commit hooks
- `npm start`: Starts the application
- `npm test`: Run Unit Tests
- `npm run build`: Builds the application for production

### PWA

To check the PWA application you must deploy that application on any HTTP server. For
localhost you don't need to wory about SSL certificates. But for any other external server
the SSL certificate must be valid and trusted and otherwise the application service worker
will not start and the application will not work as PWA.

### License

Images from [unDraw](https://undraw.co/)  
Icons from [fluentIcons](https://fluenticons.co/)
