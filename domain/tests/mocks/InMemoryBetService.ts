/** biome-ignore-all lint/complexity/noUselessConstructor: <explanation> */
import { BetService } from "../../src/bet/services/BetService";

import type { EventDispatcherMock } from "./EventDispatcherMock";
import type { InMemoryBetAggregateRepository } from "./InMemoryBetAggregateRepository";
import type { InMemoryBetQueryService } from "./InMemoryBetQueryService";

export class InMemoryBetService extends BetService {
  constructor(
    betAggregateRepository: InMemoryBetAggregateRepository,
    betQueryService: InMemoryBetQueryService,
    eventDispatcher: EventDispatcherMock,
  ) {
    super(betAggregateRepository, betQueryService, eventDispatcher);
  }
}
