# Bet Keeper project

Bet Keeper is an IT solution designed to manage bet among group of friends or anyone who enjoys making light-hearted bets and competitions with ther circle. This platform simplify the process of recording, tracking and resolving bets ensuring that all participants stays up-to date with their ventures.

Main objective is to easily create and store bets with details such as participants, terms, stakes and deadlines. There must be a bet resolution mechanism where user can resolve bet (optionaly upload evidence to support their claims). Platform should have possibility to invite friends to participate in challenges.

Additionally users should be reminded about upcoming bet deadlines or be notified when bet is resolved. 

Ensuring transparancy that reduce confusion and enhance accountability casual bets are transformed to enjoyable experience where friends can focus on fun without worriyng about logistics. 

In the future from collected data platfrom will be able to show statistics related to bets such as number of bets won, lost or participated. When platform will have more users there is a possiblity to create a leaderboards to track the most active bet-makers and provide additional gamification mechanism such as levels, badges or avatars to personalize your profile.

# Planning

## Requirements

<span style="color: #E11E39">Bussines requirements</span> - without this functionalites application will not achieve the project goal. 
<span style="color: #DB9724">Functional requirements</span> - additional application functionalities support core processes.  
<span style="color: #2E5AD1">Usability requirements</span> - requirements related with use envionment and expected use cases.

1. <span style="color: #E11E39">(Bussines)</span> Provide a platform to manage bets between friends to reduce the issue with remebering the terms and stakes.
1. <span style="color: #DB9724">(Functional)</span> User should be able to create bet  
    Bet must contains details such as
    - participants
    - terms
    - stakes
    - deadlines to complete stake (optional)
2. <span style="color: #DB9724">(Functional)</span> User should be able to see bets that he participate (including resolved, completed etc.).
3. <span style="color: #DB9724">(Functional)</span> Bet participant should be able to resolve bet (who won).
4. <span style="color: #DB9724">(Functional)</span> Bet participant should be able to mark bet as completed.
6. <span style="color: #DB9724">(Functional)</span> Bet participant should be able to reject bet
6. <span style="color: #DB9724">(Functional)</span> Administrator should be able to invite new user via email to application.
6. <span style="color: #DB9724">(Functional)</span> Creator should be able to delete bet.
6. <span style="color: #DB9724">(Functional)</span> Administrator should be able to delete any bet.
4. <span style="color: #DB9724">(Functional)</span> User should be notified when bet is Finished.
5. <span style="color: #DB9724">(Functional)</span> User should be notified when bet deadline is approaching (if bet is not Finished) (3 days left).


7. <span style="color: #DB9724">(Functional)</span> During bet creation creator should be able to select one friend from his friend list to be participate of the bet. 
8. <span style="color: #DB9724">(Functional)</span> Bet list should have ability to filter bets by:
    - status field
    - participatns
    - creation date
8. <span style="color: #DB9724">(Functional)</span> Bet list should have ability to sort bets by:
    - status field
    - creation date
    - deadline date
8. <span style="color: #DB9724">(Functional)</span> User should be able to add another user to his friend list by username (email is a username).
9. <span style="color: #DB9724">(Functional)</span> User should be able create new user invitation request to administrator.
10. <span style="color: #DB9724">(Functional)</span> Administrator should be able to approve invitation of new user.
8. <span style="color: #DB9724">(Functional)</span> There should be an audit event logs for each bet and it should contains details related with state changes, who, when and what did in this change. 

11. <span style="color: #2E5AD1">(Usability)</span> Application should be mobile-friendly.
11. <span style="color: #2E5AD1">(Usability)</span> Application data should be in sync with other users.
12. <span style="color: #2E5AD1">(Usability)</span> In a few clicks (max 3) user should be able to create a new bet.
13. <span style="color: #2E5AD1">(Usability)</span> In a few clicks (max 3) user should be able to see the list of bets he need to complete.
5. <span style="color: #2E5AD1">(Usability)</span> Notification should be send as Push.

## Use cases

### Friend context

As USER nefore I will be able to create new Bet I must have at least one friend in my "friend list". I should be able to see my friend list and add a new person by email. If that person is not a user of this application I should see the possibility to request access for this person that will be send to application ADMINISTRATOR. When administrator approve this request a new account will be created and new user will receive a note that he has been invite to use BetKeeper with pending friend request.


```mermaid
---
title Friend List Use Cases
---
flowchart TB
    
    USER["User"] --> SHOW_FREINDS(["Show friend list"])
    USER -- by username (email) --> FRIEND_INVITE(["Add to friend list"])
    FRIEND_INVITE -- when user does not exists --> REQUEST_INVITE
    USER -- when pending friend request --> APROVE_FRIEND_INVITE(["Approve freiend request"])
    USER -- for email --> REQUEST_INVITE(["Request user invitation"])

    FRIEND_INVITE -.- FREIND_INVITE_REQUEST[/"Friend request"/] -.- APROVE_FRIEND_INVITE
    ADMINISTRATOR["Administrator"] -- when pending invitation request --> APROVE_INVITE(["Approve user invitation request"])
    REQUEST_INVITE -.- INVITATION_REQUEST[/"Invitation request"/] -.- APROVE_INVITE
```

### Bet context
Then when User have at least one friend he is able to create new bet. When bet is created he must be able to modify the bet content. As CREATOR he should be able to delete given bet. Any BET PARTICIPANT should be able to reject or resolve given bet. Resolve means that person who lose must realize the "stake". When it will be done bet participant should mark bet as completed. Completed and Rejected bets should not be visible on user bets in progress list. Both are treated as FINISHED so there is no more further actions possible. Those items should be move to separate view that presents only Finished bets.

```mermaid
---
title: Bet Use Cases
---
flowchart TB
    USER["User"] ---> BET_VIEW(["Show participated bets"]) 
    BET_VIEW ---> BET_VIEW_PENDING(["Show in progress bets"]) & BET_VIEW_RESOLVED(["Show finished bets"])
    USER -- must assign 'friend' ---> BET_CREATE(["Create bet"])

    BET_CREATE --> BET_UPDATE(["Update"])
    BET_CREATE --> BET_REJECT(["Reject"])
    BET_CREATE -- only creator --> BET_DELETE(["Delete"])
    BET_CREATE --> BET_RESOLVE(["Resolve"])
    BET_RESOLVE --> BET_COMPLETE(["Complete"])
```