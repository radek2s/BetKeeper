### Friend context

As USER before I will be able to create new request Bet I must have at least one friend in my "friend list". I should be able to see my friend list and add a new person by email. If that person is not a user of this application I should see the possibility to request access for this person that will be send to application ADMINISTRATOR. When administrator approve this request a new account will be created and new user will receive a note that he has been invite to use BetKeeper with pending friend request.

There should be a possibility to remove users from bet list to not receive bet request from unwanted person.


```mermaid
---
title Friend List Use Cases
---
flowchart TB
    
    USER["User"] --> SHOW_FREINDS(["Show friend list"])
    SHOW_FREINDS --> REMOVE_USER(["Remove from friend list"])
    USER -- by username (email) --> FRIEND_INVITE(["Add to friend list"])
    FRIEND_INVITE -- when user does not exists --> REQUEST_INVITE
    USER -- when pending friend request --> APROVE_FRIEND_INVITE(["Approve freiend request"])
    USER -- for email --> REQUEST_INVITE(["Request user invitation"])

    FRIEND_INVITE -.- FREIND_INVITE_REQUEST[/"Friend request"/] -.- APROVE_FRIEND_INVITE
    ADMINISTRATOR["Administrator"] -- when pending invitation request --> APROVE_INVITE(["Approve user invitation request"])
    REQUEST_INVITE -.- INVITATION_REQUEST[/"Invitation request"/] -.- APROVE_INVITE
```

[Previous use case](./bet_context.md)
