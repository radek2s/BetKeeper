
# Bet Keeper Authentication

## Context and problem statement

Bet Keeper should provide authentication mechanism to limit user access to application.

## Decision drivers

- It must be free
- It can be something fresh (cutting-edge)
- It should be safe
- There should be administrator panel to manage users

## Conidered options

- **Supabase**  
Supabase offers [Supabase Auth](https://supabase.com/auth) module with complete User Management system. I uses JWT for authentication. It offers Free Plan with 50,000 Quota. In free plan it allows to 25 000 MAU with passwordles authentication. 

- **Auth0**  
Most popular [solution](https://auth0.com/) that provide authentication and authorization solutions in single platform. It is out of the box solution with SDK and providing SSO mechanism with support for OIDC, SAML, FIDO, OAuth and other. I that MFA and passwordless integration. 
- **Corbado**  
Corbado is focused on [Passkey functionality](https://www.corbado.com/) and has forever free comunity plan with unlimited logins ans MAU with passkey firs authentication, social logins up to 3 projects with one project administrator.
- **Gel Auth**  
[Gel](https://www.geldata.com/) has authentication layer with OAuth, email/password, passkeys that are stored in main database. There is no need to perfrom external synchronization. It is Free & Open Source and has build in UI. It is integrated with GitHub and Vercel.



## Decision Outcome

...
📆 Date: 15.04.2025

**Corbado** is the choosen one. It wons because of its free plan and simplified user login flow with UI managment panel and possiblity to limit user registration.

[Back to top](./readme.md)  
[Previous](./01-storage.md)  
[Next](./03-application.md)