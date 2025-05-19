### Bet context
User with at least one friend he is able to create new bet request. **Bet request** is a draft of **Bet** where participants must define common version of terms and stakes that are accepted by both participants. Any participant can approve or reject given terms and stakes. When participant reject request it disappears from his pending bet request list but still is able to find it from bet requests rejected list view.

Each update of terms and stakes within bet request reset the participants votes. It is not approved nor rejected - its just in pending state. Each participants must again decide if they are rejecting or approving bet terms and stakes. If someone will change the content of bet it might cause the notification flood or other unwanted items on users dashboard so there is a possibility to block given bet request and given bet will not appear in pending list and user will not receive notifications.
CREATOR should be able to delete given bet request and this removes this item from system completly and forever.

When both participants approved terms and stakes Bet Request produces a Bet instance that has immutable terms and stakes. When bet is created any participant can resolve bet which means that person who lose must realize the "stake". When it will be done bet participant should mark bet as completed. Completed bets should not be visible on user bets in progress list. In participated bets completed bets should be moved to separate view.


```mermaid
---
title: Bet Use Cases
---
flowchart TB
    USER ---> BET_VIEW(["Show participated bets"])
    BET_VIEW ---> BET_VIEW_PENDING(["Show bets in progress"]) & BET_VIEW_RESOLVED(["Show completed bets"])
    USER -- assigining friend user defines terms and stakes ---> BET_REQUEST{{"Bet Request"}}
    USER["User"] ---> BET_REQUESTS(["Show Bet requests"])
    BET_REQUESTS(["Show Bet requests"]) --> BET_REQUESTS_PENDING(["Show pending"])
    BET_REQUESTS(["Show Bet requests"]) --> BET_REQUESTS_REJECTED(["Show rejected"])
    BET_REQUEST -- only creator or admin --> BET_REQUEST_DELETE(["Delete"])
    BET_REQUEST -- any participant --> BET_REQUEST_UPDATE(["Update terms and stakes"])
    BET_REQUEST_UPDATE --> BET_REQUSET_NOTE[/"This action notifies participants about change and reset participants agreements"/]
    BET_REQUEST -- both participants must mark that agree with terms and stakes --> BET_APPROVED(["Approve"])
    BET_REQUEST --> BET_REJECTED(["Reject"])
    BET_REJECTED --> BET_REQUEST_UNSUBSCRIBE(["Block"])
    
    BET_APPROVED(["Approve"]) -- terms and stakes becomes immutable --> BET{{"Bet"}}
    BET --> BET_RESOLVE(["Resolve"])
    BET_RESOLVE -- (optional) define due date --> BET_COMPLETE(["Complete"])
    BET -- only creator or admin --> BET_DELETE(["Delete"])


```


Bet Request participant statuses:
For each participant of bet request there should be a current state of his "Vote". When last participant approve stakes given bet request is transformed into bet.
```mermaid
---
title: Bet State Transitions
---
flowchart TB
    subgraph Bet Request
    UNKNOWN(["Unknown"]) --> APPROVED(["Approved"]) 
    UNKNOWN --> REJECTED(["Rejected"]) 
    end

    APPROVED --> PENDING

    subgraph Bet
    PENDING("Pending") --> RESOLVED("Resolved")
    RESOLVED --> COMPLETED("Completed")
    end
    

```

### Stake idea context
User should have possibility to create a stake idea for given bet that will be stored in notebook. This list should be visible only for given user. User should be able to browse this list and delete or modify stake idea.

In future this idea might be shown during defining a new bet as suggestion for stake.



[Next use case](./friend_context.md)