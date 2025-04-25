### Context Architecture
From bird's-eye view the application architecture is very simple. Actors such as user and admin are using Bet Keeper application to perform use cases actions. Application connects to external systems to provide user authentication and persis user data.

```mermaid
flowchart TD
AUTH["`**Corbado**
    _External Service_
`"]

DB[("`**Supabase**
    _External Service_
`")]
USER(["`**User**`"])
ADMIN(["`**Administrator**`"])
    USER -- manage bets --> APP["Bet Keeper"]
    ADMIN -- manage bets and users --> APP
    APP -- auth validation -->  AUTH
    APP -- persist data --> DB
```
[More details](./02-containers.md)