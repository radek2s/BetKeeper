# Bet Keeper project

Bet Keeper is an IT solution designed to manage bet among group of friends or anyone who enjoys making light-hearted bets and competitions with ther circle. This platform simplify the process of recording, tracking and resolving bets ensuring that all participants stays up-to date with their ventures.

Main objective is to easily create and store bets with details such as participants, terms, claims, stakes and deadlines. There must be a bet resolution mechanism where user can resolve bet (optionaly upload evidence to support their claims). Platform should have possibility to invite friends to participate in challenges.

Additionally users should be reminded about upcoming bet deadlines or be notified when bet is resolved. 

Ensuring transparancy that reduce confusion and enhance accountability casual bets are transformed to enjoyable experience where friends can focus on fun without worriyng about logistics. 

In the future from collected data platfrom will be able to show statistics related to bets such as number of bets won, lost or participated. When platform will have more users there is a possiblity to create a leaderboards to track the most active bet-makers and provide additional gamification mechanism such as levels, badges or avatars to personalize your profile.

# Planning

Application is intended to use by narrow group of users but it might grow up to 50 registered user accounts. This project is mostly focused to present on development process from the idea, through design phase then with organized development to application deploy and publish. Main goal is to share expirience how to conduct software project.

## Requirements



<span style="color: #E11E39">Bussines requirements</span> - without this functionalites application will not achieve the project goal. 
<span style="color: #DB9724">Functional requirements</span> - additional application functionalities support core processes.  
<span style="color: #2E5AD1">Usability requirements</span> - requirements related with use envionment and expected use cases.

- ✓ BKR_01 <span style="color: #E11E39">(Bussines)</span> Provide a platform to manage bets between friends to reduce the issue with remebering the terms, claims and stakes.
- ✓ BKR_02 <span style="color: #E11E39">(Bussines)</span> Provide a space to establish and refine bets with friends regardless of distance and location.
- ✓ BKR_03 <span style="color: #DB9724">(Functional)</span> User should be able to create bet request  
Bet Request must contains details such as:
    - participants
    - claims
    - terms
    - stakes (there are 2 wariants of stakes)
        - common stake (all participants has has the same stake to deal with)
        - individual stakes (each participant defines what he want to 'recive' when he wins)
    - deadlines to complete stake (optional)
- ✓ BKR_04 <span style="color: #DB9724">(Functional)</span> During bet request creation creator should be able to select one friend from his friend list to be participate of the bet. 
- ✓ BKR_05 <span style="color: #DB9724">(Functional)</span> User should be able to see pending bet requests and vote to accept or reject them.
- ✓ BKR_06 <span style="color: #DB9724">(Functional)</span> Bet request participants should be able to modify terms or common stake and his own claims and individual stake in given bet request.
- ✓ BKR_07 <span style="color: #DB9724">(Functional)</span> Each change of terms, claims and stakes in bet request should reset given "votes" (Approval or Rejection).
- ✓ BKR_08 <span style="color: #DB9724">(Functional)</span> Each change of terms, claims and stakes in bet request should send a notifications to participants.

- ✓ BKR_09 <span style="color: #DB9724">(Functional)</span> Bet creator should be able to delete bet request.
- ✗ <strike>BKR_10 <span style="color: #DB9724">(Functional)</span> User should be able to block Bet Request to hide it from his dashboard and block unwanted notifications.</strike> Rejected bet requests should be hidden by default in Main Menu view but user should be able to show rejected items.
- ✓ BKR_11 <span style="color: #DB9724">(Functional)</span> User should be able to see bets that he participate (including pending, resolved, completed etc.).
- ✓ BKR_12 <span style="color: #DB9724">(Functional)</span> Bet participant should be able to resolve bet (who won).
- ✓ BKR_13 <span style="color: #DB9724">(Functional)</span> Bet participant should be able to mark bet as completed.
- ✓ BKR_14 <span style="color: #DB9724">(Functional)</span> Administrator should be able to invite new user via email to application.
- ✓ BKR_15 <span style="color: #DB9724">(Functional)</span> Creator should be able to delete bet.
- ✓ BKR_16 <span style="color: #DB9724">(Functional)</span> Administrator should be able to delete any bet.
- ✓ BKR_17 <span style="color: #DB9724">(Functional)</span> User should be notified when bet is Finished.
- ✗ <strike>BKR_18 <span style="color: #DB9724">(Functional)</span> User should be notified when bet deadline is approaching (if bet is not Finished) (3 days left).</strike> 

- ✗ <strike>BKR_19 <span style="color: #DB9724">(Functional)</span> User should be notified when bet is still in Pending state for longer than 1 week. (Pending is after creation state before resolved or rejected)</strike>



- ✓ BKR_20 <span style="color: #DB9724">(Functional)</span> Bet list should have ability to filter bets by:
    - status field
    - participatns
    - creation date
- ✓ BKR_21 <span style="color: #DB9724">(Functional)</span> Bet list should have ability to sort bets by:
    - status field
    - creation date
- ✓ BKR_22 <span style="color: #DB9724">(Functional)</span> User should be able to add another user to his friend list by username (email is a username).
- ✓ BKR_23 <span style="color: #DB9724">(Functional)</span> User should be able create new user invitation request to administrator.
- ✓ BKR_24 <span style="color: #DB9724">(Functional)</span> Administrator should be able to approve invitation of new user.
- ✓ BKR_25 <span style="color: #DB9724">(Functional)</span> There should be an audit event logs for each bet and it should contains details related with state changes, who, when and what did in this change. 

- ... BKR_26 <span style="color: #DB9724">(Functional)</span> User should be able to browse, create, modify and delete his stake ideas (for future bet stakes) as simple list of text notes.

- ✗ <strike>BKR_19 <span style="color: #DB9724">(Functional)</span> User should be notified when bet is still in Pending state for longer than 1 week. (Pending is after creation state before resolved or rejected)</strike>

- ✓ BKR_27 <span style="color: #2E5AD1">(Usability)</span> Application should be mobile-friendly.
- ✓ BKR_28 <span style="color: #2E5AD1">(Usability)</span> Application data should be in sync with other users.
- ✓ BKR_29 <span style="color: #2E5AD1">(Usability)</span> In a few clicks (max 10) user should be able to create a new bet.
- ✓ BKR_30 <span style="color: #2E5AD1">(Usability)</span> In a few clicks (max 10) user should be able to see the list of bets he need to complete.
- ... BKR_31 <span style="color: #2E5AD1">(Usability)</span> Notification should be send as notification emails. User should be notified about new friend invitation and new bet request. User should be able to turn off the notifications. When user will be invited to use application should receive welcome email and also when his account will be suspended also should be notified about this.


Check use cases:
- [friend context](./use_cases/friend_context.md)
- [bet context](./use_cases/bet_context.md)

And related risks:
- [Risk](./01-risks)