import { BetService } from "../../src/bet/services/BetService";

import { EventDispatcherMock } from "./EventDispatcherMock";
import { InMemoryBetRepository } from "./InMemoryBetRepository";
import { InMemoryBetQueryService } from "./InMemoryBetQueryService";
import { InMemoryBetRequestRepository } from "./InMemoryBetRequestRepository";
import { InMemoryBetAggregateRepository } from "./InMemoryBetAggregateRepository";

export class InMemoryBetService extends BetService {
  constructor(
    betRequestRepository: InMemoryBetRequestRepository,
    betRepository: InMemoryBetRepository,
    betAggregateRepository: InMemoryBetAggregateRepository,
    betQueryService: InMemoryBetQueryService,
    eventDispatcher: EventDispatcherMock,
  ) {
    super(
      betRequestRepository,
      betRepository,
      betAggregateRepository,
      betQueryService,
      eventDispatcher,
    );
  }
}
