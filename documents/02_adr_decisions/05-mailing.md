
# Bet Keeper Mailing server

## Context and problem statement

Based on the requirements and expected useage there is a need to define where the application will be hosted.

## Decision drivers

- It must be free up to 1000 emails per month.
- It must be free up to 100 emails per day. (for example 10 uses create 10 bets)
- It should be easy to integrate with BetKeeper.
- It should be secure and trusted.
- Emails should be delived to recipients inbox (provider should have great deliverability)
- Mostly focused on transactional flows where email is send when application triggers given action
- Possibility to provide various email templates (for example for betRequestInvitation and friendInvitation)
- Easy email template creator (nice to have)

## Conidered options

- **Sinch Mailgun**  
Sending 100 emails/day for free with no credit card required. Protected data with GDPR compliance and ISO 27001. Build for developers, with simple API key generation and [good documentation](https://documentation.mailgun.com/docs/mailgun/quickstart). Great logging and event tracking. Scales well.


- **Mailtrap**  
Sending 150 emails/day, up to 4000 emails per month. Free for single user and keeps logs for 3 days. Single domain per account. No possibility to send more emails when limit exceeded. Has templates, API access dedicated SDK's. Drag and drop email editor. GDPR compliance, ISO 27001. API key permissions. [Clear documentation](https://docs.mailtrap.io/developers). Maximum size of email is 10MB.

- **Brevo**  
Sending 300 emails/day 5000 emails per month. Drag-n-drop editor and email templates. Inbox preview.  Transactional email. Reporting an analytics. Brevo logo in message! API is not developer-centric.

- **Mailer Lite**
Sending 1200 emails monthly with support of 500 recipients. Has drag-n-drop editor. Poor documentation related to API integration. 

## Decision Outcome

📆 Date: 18.02.2026

The best free plan connected with grreat developer expirience and great documentation with examples has **Mailtrap**. Emails has gread deliverability and user can create his own email template with drag-n-drop editor and HTML editor. Messages can be tracked with stats panel and logs. There is possibility to perform email testing.


[Back to top](./readme.md)  
[Previous](./04-cdn-service.md) | [Next](./06-domain.md)