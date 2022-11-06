<style>
.header {
    display:flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 8px;
    border-bottom: 1px solid
}
.header .flex{
    display: flex;
    align-items: center;
}
.header img {
    height: 3em;
    margin-right: 8px
}
.header h1  {
    margin: 0;
    padding: 0;
    border: none;
    font-size: 2.5em
}
</style>
<a class="header" src="https://radek2s.github.io/BetKeeper">
<div class="flex">
    <img src='https://github.com/radek2s/BetKeeper/raw/main/public/logo192.png'>
    <h1>Bet Keeper</h1>
    </div>
    <img src="https://github.com/radek2s/Company-People-Management/raw/master/doc/pwa.png">
</a>

![GitHub release (latest by date)](https://img.shields.io/github/v/release/radek2s/BetKeeper?style=for-the-badge)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/radek2s/BetKeeper/pages?label=GitHub%20pages&style=for-the-badge)

Progressive Web Application (PWA) build with React and Typescript to manage and display
bets between two people. Store data on local database by using dedicated Node Server or
connect to your own Firebase store.

## Usage - Quick Start

Stable version of application is hosted on GitHub Pages. To check how it looks like just
open the running environment.

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
