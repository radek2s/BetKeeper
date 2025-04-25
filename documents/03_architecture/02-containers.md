### Containers Architecture
Container level of details of the application architecture is the same as it was explained in context level. In this level we add additional context of chosen frameworks and tech solutions.

```mermaid
flowchart TD
AUTH["`**Corbado**
    _External Service_
`"]

DB[("`**Supabase**
    _PostgresSQL_
`")]
USER(["`**User**`"])
ADMIN(["`**Administrator**`"])
APP["`Bet Keeper
*Next.js application*
`"]
    USER -- manage bets --> APP
    ADMIN -- manage bets and users --> APP
    APP -- get user details -->  AUTH
    APP -- persist data --> DB
```

[Less details](./01-context.md) | [More details](./03-components.md)