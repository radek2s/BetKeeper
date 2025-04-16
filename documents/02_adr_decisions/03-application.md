
# Bet Keeper Technology

## Context and problem statement

Application according to requirements should be mobile-friendly and allow invitation of users to application by email. This is small application and also development team is quite tiny. System should be maintanable and easy to maintain. It does not have to be ultra-fast or memory efficient but it must be available from anywhere.

## Decision drivers

- It must be web application
- It is small project
- It is developed by single person (or tiny team)
- It should be easily to maintain
- There should be possibility for system to evolve
- It should have connection to database 
- It must not expose configuration keys

## Conidered options


- **Angular with Analog.js**  
Quite common and recently had a lot of changes and improvements that might be interesting and may simplify the creation of simple application. But still it is mostly focused on mid to huge projets.

- **React with Next.js**  
The simplest and the most popular option. Has great integration with Next.js for SSR and also with connection to Next.js we can handle database connections. It has large ecosystem and community with lot of libraries. Complext API managment might be an issue.

- **Vue with Nuxt**  
Provides a streamlined development experience. Great for simple and easy to use application. It is smaller thatn React or Angular and has great reactivity system and composition API. 

## Decision Outcome

📆 Date: 16.04.2025

This project will be realized with **Next.js** because this will be enough to achieve goals and it will be easily integrated with Vercel hosting that supports connection to external database systems and allowing reliable access.

[Back to top](./readme.md)  
[Previous](./02-authentication.md)  