
# Bet Keeper Domain

## Context and problem statement

SMTP will not work on vercel.app domain. Each [email service provider](./05-mailing.md) requrie verified domain to send emails.

## Decision drivers

- It must be cheep for long term use
- Domain provider should be verified vendor.
- Domain should be related with BetKeeper (can be *.pl or something related with technology.)

## Conidered options

- **Cyber_folks**  
.pl domain - first year for free. Next years for 179 PLN/year. 

- **home.pl**  
.pl domain - first year for 2,99. Next years for 215,25 PLN/year.

- **nazwa.pl**  
.pl domain - first year for free. Next years for 240 PLN/year. 

- **ovh**  
.pl domain - first year for 16,69 PLN. Next years for 58,99 PLN/year. 
.ovh domain - first year for 8.88 PLN. Next years for 11,99 PLN/year.

## Decision Outcome

📆 Date: 18.02.2026

From vendors offered very simillar price for long term  maintenance for .pl domain. BetKeeper is not expected to be used by dozens of people so domain can be *.ovh. For long terms **ovh cloud** offers the best price.


[Back to top](./readme.md)  
[Previous](./05-mailing.md)
