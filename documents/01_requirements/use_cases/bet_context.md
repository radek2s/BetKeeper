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

[Next use case](./friend_context.md)