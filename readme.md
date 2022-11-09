# [Bet Keeper](https://radek2s.github.io/BetKeeper/)

![GitHub release (latest by date)](https://img.shields.io/github/v/release/radek2s/BetKeeper?style=for-the-badge)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/radek2s/BetKeeper/pages?label=GitHub%20pages&style=for-the-badge)
<img src='https://github.com/radek2s/BetKeeper/raw/main/public/logo192.png' height='32'/>
<img src="https://github.com/radek2s/Company-People-Management/raw/master/doc/pwa.png" height='32'/>

Progressive Web Application (PWA) build with React and Typescript to manage and display
bets between two people. Store data on local database by using dedicated Node Server or
connect to your own Firebase store.

## Usage - Quick Start

Stable version of application is hosted on GitHub Pages. To check how it looks like just
open the running environment.

By default all your data is stored inside your browser memory. But you can connect to
external data provider like firebase or dedicated REST Node server.

You can also run it on your own computer

### Local environment

- Clone repository
  ```bash
  git clone https://github.com/radek2s/BetKeeper.git
  ```
- Install dependencies for frontend application
  ```bash
  npm i
  ```
- Install dependencies for backend server
  ```bash
  cd ./backend
  ```
- Run server (from `backend` directory)
  ```bash
  npm run start
  ```
- Run application (from root directory)
  ```
  npm run start
  ```
- Open browser on address [http://localhost:3000](http://localhost:3000)

### Firebase environment

To connect with firebase to store your bet data just create a new Firebase Application and
provide all required configuration data directly on "Settings" page. Save, and apply
changes.

## Development

Application was developed using custom styles. But we added
[FluentUI Controlls](https://developer.microsoft.com/en-us/fluentui#/controls/web) to
speed up the develpment provess.

### Scripts

- `npm install`: install project dependencies
- `npm prepare`: install husky 🐶 - pre-commit hooks
- `npm run start`: Starts the application
- `npm run build`: Builds the application for production

### PWA

To check the PWA application you must deploy that application on any HTTP server. For
localhost you don't need to wory about SSL certificates. But for any other external server
the SSL certificate must be valid and trusted and otherwise the application service worker
will not start and the application will not work as PWA.
