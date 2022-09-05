## Bet Keeper application

Simple React application with Redux library. This application is ready to use as a
Progressive Web App so it can be installed on any device.

### Scripts

- `npm install`: install project dependencies
- `npm run start`: Starts the application
- `npm run build`: Builds the application for production

### PWA

To check the PWA application you must deploy that application on any HTTP server. For
localhost you don't need to wory about SSL certificates. But for any other external server
the SSL certificate must be valid and trusted and otherwise the application service worker
will not start and the application will not work as PWA.
